import AnalyticsEvent from '../models/AnalyticsEvent.js'
import Product from '../models/Product.js'
import Category from '../models/Category.js'

function sourceFromRequest(req) {
  const source = req.body?.source || req.body?.utm_source || req.query?.utm_source
  if (source) return String(source).toLowerCase()
  const ref = req.get('referer') || ''
  if (/pinterest/i.test(ref)) return 'pinterest'
  if (/instagram/i.test(ref)) return 'instagram'
  if (/facebook/i.test(ref)) return 'facebook'
  if (/google/i.test(ref)) return 'google'
  return 'direct'
}

export async function trackVisit(req, res) {
  await AnalyticsEvent.create({ eventType: 'VISIT', source: sourceFromRequest(req), sessionId: req.body?.sessionId, path: req.body?.path })
  res.status(204).end()
}

export async function trackProductView(req, res) {
  const product = await Product.findOne({ _id: req.body.productId, status: 'published' }).select('_id category')
  if (!product) return res.status(404).json({ message: 'Product not found' })
  await Promise.all([
    AnalyticsEvent.create({ eventType: 'PRODUCT_VIEW', productId: product._id, categoryId: product.category, source: sourceFromRequest(req), sessionId: req.body?.sessionId, path: req.body?.path }),
    Product.updateOne({ _id: product._id }, { $inc: { viewsCount: 1 } })
  ])
  res.status(204).end()
}

function rangeStart(range) {
  const now = new Date()
  if (range === 'today') return new Date(now.getFullYear(), now.getMonth(), now.getDate())
  if (range === '7d') return new Date(Date.now() - 7 * 864e5)
  if (range === '30d') return new Date(Date.now() - 30 * 864e5)
  return null
}

async function aggregateDashboard(range) {
  const start = rangeStart(range)
  const match = start ? { timestamp: { $gte: start } } : {}
  const [counts, topProducts, topCategories, topSources, topStores, productCounts] = await Promise.all([
    AnalyticsEvent.aggregate([{ $match: match }, { $group: { _id: '$eventType', count: { $sum: 1 } } }]),
    AnalyticsEvent.aggregate([{ $match: { ...match, eventType: 'PRODUCT_VIEW', productId: { $ne: null } } }, { $group: { _id: '$productId', views: { $sum: 1 } } }, { $sort: { views: -1 } }, { $limit: 5 }, { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'product' } }, { $unwind: '$product' }, { $project: { _id: 0, name: '$product.name', imageUrl: '$product.imageUrl', views: 1, slug: '$product.slug' } }]),
    AnalyticsEvent.aggregate([{ $match: { ...match, eventType: 'PRODUCT_VIEW', categoryId: { $ne: null } } }, { $group: { _id: '$categoryId', views: { $sum: 1 } } }, { $sort: { views: -1 } }, { $limit: 5 }, { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'category' } }, { $unwind: '$category' }, { $project: { _id: 0, name: '$category.name', views: 1 } }]),
    AnalyticsEvent.aggregate([{ $match: match }, { $group: { _id: '$source', count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 7 }, { $project: { _id: 0, source: '$_id', count: 1 } }]),
    AnalyticsEvent.aggregate([{ $match: { ...match, eventType: 'AFFILIATE_CLICK' } }, { $group: { _id: '$store', count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $project: { _id: 0, store: '$_id', count: 1 } }]),
    Promise.all([Product.countDocuments({}), Product.countDocuments({ status: 'published' }), Product.countDocuments({ status: 'draft' })])
  ])
  const map = Object.fromEntries(counts.map(x => [x._id, x.count]))
  return { visitors: map.VISIT || 0, productViews: map.PRODUCT_VIEW || 0, affiliateClicks: map.AFFILIATE_CLICK || 0, products: productCounts[0], published: productCounts[1], drafts: productCounts[2], topProducts, topCategories, topSources, topStores }
}

export async function dashboard(req, res) {
  const range = ['today', '7d', '30d', 'all'].includes(req.query.range) ? req.query.range : '30d'
  const current = await aggregateDashboard(range)
  let previous = null
  if (range !== 'all') {
    const days = range === 'today' ? 1 : range === '7d' ? 7 : 30
    const end = rangeStart(range)
    const start = new Date(end.getTime() - days * 864e5)
    const events = await AnalyticsEvent.aggregate([{ $match: { timestamp: { $gte: start, $lt: end } } }, { $group: { _id: '$eventType', count: { $sum: 1 } } }])
    previous = Object.fromEntries(events.map(x => [x._id, x.count]))
  }
  res.json({ range, ...current, previous })
}

export async function productsAnalytics(req, res) {
  const data = await Product.find({ status: 'published' }).sort({ viewsCount: -1, affiliateClickCount: -1 }).limit(20).select('name slug viewsCount affiliateClickCount store')
  res.json({ products: data })
}

export async function categoryAnalytics(req, res) {
  const data = await AnalyticsEvent.aggregate([{ $match: { eventType: 'PRODUCT_VIEW' } }, { $group: { _id: '$categoryId', views: { $sum: 1 } } }, { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'category' } }, { $unwind: '$category' }, { $project: { _id: 0, name: '$category.name', views: 1 } }, { $sort: { views: -1 } }])
  res.json({ categories: data })
}

export async function sourceAnalytics(req, res) {
  const data = await AnalyticsEvent.aggregate([{ $group: { _id: '$source', visits: { $sum: 1 }, clicks: { $sum: { $cond: [{ $eq: ['$eventType', 'AFFILIATE_CLICK'] }, 1, 0] } } } }, { $project: { _id: 0, source: '$_id', visits: 1, clicks: 1 } }, { $sort: { visits: -1 } }])
  res.json({ sources: data })
}

export async function storeAnalytics(req, res) {
  const data = await AnalyticsEvent.aggregate([{ $match: { eventType: 'AFFILIATE_CLICK' } }, { $group: { _id: '$store', clicks: { $sum: 1 } } }, { $project: { _id: 0, store: '$_id', clicks: 1 } }, { $sort: { clicks: -1 } }])
  res.json({ stores: data })
}

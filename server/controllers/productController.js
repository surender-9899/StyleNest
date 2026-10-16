import Product from '../models/Product.js'
import AnalyticsEvent from '../models/AnalyticsEvent.js'
import Category from '../models/Category.js'
import User from '../models/User.js'
import { uploadMany, removeMany } from '../services/imageService.js'
import { uniqueSlug } from '../utils/slugify.js'
import { assertHttpUrl } from '../utils/validators.js'

function parseBody(body) {
  const tags = Array.isArray(body.tags) ? body.tags : typeof body.tags === 'string' ? body.tags.split(',').map(t => t.trim()).filter(Boolean) : []
  return {
    name: body.name?.trim(), description: body.description?.trim(), price: Number(body.price), originalPrice: body.originalPrice ? Number(body.originalPrice) : undefined,
    category: body.category, brand: body.brand?.trim(), gender: ['women','men','unisex'].includes(body.gender) ? body.gender : 'unisex', store: body.store?.trim(), affiliateUrl: body.affiliateUrl?.trim(), tags,
    seoTitle: body.seoTitle?.trim(), metaDescription: body.metaDescription?.trim(), status: body.status === 'published' ? 'published' : 'draft'
  }
}

function validateProduct(data, hasImages) {
  if (!data.name || !data.description || !Number.isFinite(data.price) || data.price < 0 || !data.category || !data.store || !data.affiliateUrl || (!hasImages && !data.imageUrl)) {
    return 'Name, description, price, category, store, affiliate URL and at least one image are required.'
  }
  assertHttpUrl(data.affiliateUrl)
  if (data.originalPrice !== undefined && (!Number.isFinite(data.originalPrice) || data.originalPrice < 0)) return 'Original price must be a positive number.'
  if (!['draft', 'published'].includes(data.status)) return 'Invalid product status.'
  return null
}

export async function listPublic(req, res) {
  const { q, category, store, minPrice, maxPrice, sort = 'newest', page = 1, limit = 12 } = req.query
  const filter = { status: 'published' }
  if (category) filter.category = category
  if (store) filter.store = store
  if (minPrice || maxPrice) filter.price = { ...(minPrice ? { $gte: Number(minPrice) } : {}), ...(maxPrice ? { $lte: Number(maxPrice) } : {}) }
  if (q) filter.$text = { $search: q }
  const sortMap = { newest: { createdAt: -1 }, low: { price: 1 }, high: { price: -1 }, popular: { viewsCount: -1, affiliateClickCount: -1 } }
  const current = Math.max(1, Number(page)), perPage = Math.min(48, Math.max(1, Number(limit)))
  const [products, total] = await Promise.all([
    Product.find(filter).populate('category', 'name slug').sort(sortMap[sort] || sortMap.newest).skip((current - 1) * perPage).limit(perPage).select('-affiliateUrl'),
    Product.countDocuments(filter)
  ])
  res.json({ products, pagination: { page: current, limit: perPage, total, pages: Math.ceil(total / perPage) } })
}

export async function getPublicBySlug(req, res) {
  const product = await Product.findOne({ slug: req.params.slug, status: 'published' }).populate('category', 'name slug').select('-affiliateUrl')
  if (!product) return res.status(404).json({ message: 'Product not found' })
  res.json({ product })
}

export async function adminList(req, res) {
  const { q, status, category, store, page = 1, limit = 15 } = req.query
  const filter = {}
  if (status) filter.status = status
  if (category) filter.category = category
  if (store) filter.store = store
  if (q) filter.$text = { $search: q }
  const current = Math.max(1, Number(page)), perPage = Math.min(50, Math.max(1, Number(limit)))
  const [products, total] = await Promise.all([
    Product.find(filter).populate('category', 'name slug').sort({ createdAt: -1 }).skip((current - 1) * perPage).limit(perPage),
    Product.countDocuments(filter)
  ])
  res.json({ products, pagination: { page: current, limit: perPage, total, pages: Math.ceil(total / perPage) } })
}

export async function adminGet(req, res) {
  const product = await Product.findById(req.params.id).populate('category', 'name slug')
  if (!product) return res.status(404).json({ message: 'Product not found' })
  res.json({ product })
}

export async function create(req, res) {
  const data = parseBody(req.body)
  const error = validateProduct(data, req.files?.length > 0)
  if (error) return res.status(400).json({ message: error })
  const category = await Category.findById(data.category)
  if (!category) return res.status(400).json({ message: 'Selected category does not exist.' })
  const uploaded = await uploadMany(req.files || [])
  const images = uploaded.length ? uploaded : (data.imageUrl ? [{ url: data.imageUrl, publicId: '' }] : [])
  const slug = await uniqueSlug(Product, data.name)
  const product = await Product.create({ ...data, slug, images, imageUrl: images[0].url })
  res.status(201).json({ product, publicUrl: `${process.env.CLIENT_URL}/fashion/${category.slug}/${product.slug}` })
}

export async function update(req, res) {
  const product = await Product.findById(req.params.id)
  if (!product) return res.status(404).json({ message: 'Product not found' })
  const data = parseBody(req.body)
  const error = validateProduct(data, (req.files?.length || 0) > 0 || product.images.length > 0)
  if (error) return res.status(400).json({ message: error })
  const category = await Category.findById(data.category)
  if (!category) return res.status(400).json({ message: 'Selected category does not exist.' })
  if (data.affiliateUrl) assertHttpUrl(data.affiliateUrl)
  if (data.name && data.name !== product.name) product.slug = await uniqueSlug(Product, data.name)
  Object.assign(product, data)
  if (req.files?.length) {
    const uploaded = await uploadMany(req.files)
    await removeMany(product.images)
    product.images = uploaded
    product.imageUrl = uploaded[0].url
  }
  await product.save()
  res.json({ product, publicUrl: `${process.env.CLIENT_URL}/fashion/${category.slug}/${product.slug}` })
}

export async function remove(req, res) {
  const product = await Product.findById(req.params.id)
  if (!product) return res.status(404).json({ message: 'Product not found' })
  await removeMany(product.images)
  await Promise.all([product.deleteOne(), User.updateMany({}, { $pull: { wishlist: product._id } }), AnalyticsEvent.deleteMany({ productId: product._id })])
  res.json({ message: 'Product permanently deleted.' })
}

export async function changeStatus(req, res) {
  const status = req.params.status
  if (!['draft', 'published'].includes(status)) return res.status(400).json({ message: 'Invalid status.' })
  const product = await Product.findByIdAndUpdate(req.params.id, { status }, { new: true }).populate('category', 'slug name')
  if (!product) return res.status(404).json({ message: 'Product not found' })
  res.json({ product })
}

export async function affiliateRedirect(req, res) {
  const product = await Product.findOne({ _id: req.params.productId, status: 'published' })
  if (!product) return res.status(404).send('Product not found')
  if (!product.affiliateUrl) return res.status(400).send('Affiliate link unavailable')
  assertHttpUrl(product.affiliateUrl)
  const source = req.query.utm_source || req.get('referer')?.match(/(?:pinterest|instagram|facebook|google)/i)?.[0]?.toLowerCase() || 'direct'
  await Promise.all([
    AnalyticsEvent.create({ eventType: 'AFFILIATE_CLICK', productId: product._id, categoryId: product.category, store: product.store, source, sessionId: req.query.sessionId, path: req.originalUrl }),
    Product.updateOne({ _id: product._id }, { $inc: { affiliateClickCount: 1 } })
  ])
  res.redirect(product.affiliateUrl)
}

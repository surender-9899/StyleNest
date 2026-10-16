import 'dotenv/config'
import { connectDB } from '../config/db.js'
import Category from '../models/Category.js'
import Product from '../models/Product.js'

await connectDB()
const names = ['Women', 'Men', 'Shoes', 'Accessories', 'Shirts', 'Dresses', 'Bags']
const cats = {}
for (const name of names) cats[name] = await Category.findOneAndUpdate({ name }, { name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-') }, { upsert: true, new: true })
const demo = [
  ['Blue Floral Shirt', 'Lightweight floral shirt for everyday looks.', 899, 1299, 'women', 'Shirts', 'Demo Brand', 'Amazon', 'blue-floral-shirt'],
  ['Summer Dress', 'Easy summer dress with a relaxed silhouette.', 1299, 1899, 'women', 'Dresses', 'Demo Brand', 'Myntra', 'summer-dress'],
  ['White Sneakers', 'Clean low-top sneakers for casual outfits.', 2499, 3299, 'unisex', 'Shoes', 'Demo Brand', 'Flipkart', 'white-sneakers'],
  ['Elegant Handbag', 'Structured handbag for work and weekends.', 1799, 2399, 'women', 'Bags', 'Demo Brand', 'Amazon', 'elegant-handbag']
]
for (const [name, description, price, originalPrice, gender, category, brand, store, slug] of demo) {
  const c = cats[category]
  await Product.findOneAndUpdate({ slug }, { name, description, price, originalPrice, gender, category: c._id, brand, store, affiliateUrl: 'https://example.com/affiliate-demo', images: [{ url: `https://placehold.co/700x900/F5EFEA/1C1C1C?text=${encodeURIComponent(name)}`, publicId: '' }, { url: `https://placehold.co/700x900/EDE7E1/1C1C1C?text=${encodeURIComponent(name)}+2`, publicId: '' }], imageUrl: `https://placehold.co/700x900/F5EFEA/1C1C1C?text=${encodeURIComponent(name)}`, tags: ['demo', 'fashion'], status: 'published', seoTitle: `${name} | StyleNest`, metaDescription: description }, { upsert: true, new: true, setDefaultsOnInsert: true })
}
console.log('Demo categories and products ready.')
process.exit(0)

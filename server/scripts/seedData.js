import '../config/env.js'
import { connectDB } from '../config/db.js'
import Category from '../models/Category.js'
import Product from '../models/Product.js'

await connectDB()
const categoryImages = {
  'Accessories': 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
  'Bags': 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
  'Dresses': 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
  'Men': 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
  'Shirts': 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
  'Shoes': 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80',
  'Women': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'
}

const names = ['Women', 'Men', 'Shoes', 'Accessories', 'Shirts', 'Dresses', 'Bags']
const cats = {}
for (const name of names) {
  const imageUrl = categoryImages[name] || ''
  cats[name] = await Category.findOneAndUpdate(
    { name },
    { name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'), image: imageUrl, imageUrl },
    { upsert: true, new: true }
  )
}
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

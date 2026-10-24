import '../config/env.js'
import { connectDB } from '../config/db.js'
import Category from '../models/Category.js'

const categoryImages = {
  'Accessories': 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
  'Bags': 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
  'Dresses': 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
  'Men': 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
  'Shirts': 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
  'Shoes': 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80',
  'Women': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'
}

async function run() {
  await connectDB()
  console.log('Updating category images...')
  for (const [name, imageUrl] of Object.entries(categoryImages)) {
    const updated = await Category.findOneAndUpdate(
      { name },
      { $set: { image: imageUrl, imageUrl: imageUrl } },
      { new: true }
    )
    if (updated) {
      console.log(`Updated ${name}: ${imageUrl}`)
    } else {
      console.log(`Category "${name}" not found in DB`)
    }
  }
  console.log('Category images updated successfully.')
  process.exit(0)
}

run().catch((err) => {
  console.error('Error updating categories:', err)
  process.exit(1)
})

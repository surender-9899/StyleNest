import mongoose from 'mongoose'

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  publicId: { type: String, default: '' },
  alt: { type: String, default: '' }
}, { _id: false })

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 180 },
  slug: { type: String, required: true, unique: true, index: true },
  description: { type: String, required: true, maxlength: 5000 },
  price: { type: Number, required: true, min: 0 },
  originalPrice: { type: Number, min: 0 },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
  brand: { type: String, trim: true, maxlength: 120 },
  gender: { type: String, enum: ['women', 'men', 'unisex'], default: 'unisex', index: true },
  store: { type: String, required: true, trim: true, maxlength: 80, index: true },
  affiliateUrl: { type: String, required: true },
  images: { type: [imageSchema], required: true, validate: v => v.length > 0 },
  imageUrl: { type: String, required: true },
  tags: { type: [String], default: [] },
  status: { type: String, enum: ['draft', 'published'], default: 'draft', index: true },
  seoTitle: { type: String, maxlength: 180 },
  metaDescription: { type: String, maxlength: 320 },
  viewsCount: { type: Number, default: 0 },
  affiliateClickCount: { type: Number, default: 0 }
}, { timestamps: true })

productSchema.index({ name: 'text', description: 'text', brand: 'text', tags: 'text' })
productSchema.index({ createdAt: -1 })

export default mongoose.model('Product', productSchema)

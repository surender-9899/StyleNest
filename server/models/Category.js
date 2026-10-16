import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  slug: { type: String, required: true, unique: true, index: true },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true })

export default mongoose.model('Category', categorySchema)

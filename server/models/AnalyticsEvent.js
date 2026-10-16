import mongoose from 'mongoose'

const analyticsEventSchema = new mongoose.Schema({
  eventType: { type: String, enum: ['VISIT', 'PRODUCT_VIEW', 'AFFILIATE_CLICK'], required: true, index: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', index: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', index: true },
  store: { type: String, index: true },
  source: { type: String, default: 'direct', index: true },
  sessionId: { type: String, index: true },
  path: { type: String },
  timestamp: { type: Date, default: Date.now, index: true }
}, { versionKey: false })

analyticsEventSchema.index({ timestamp: -1 })

export default mongoose.model('AnalyticsEvent', analyticsEventSchema)

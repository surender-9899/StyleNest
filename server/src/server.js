

import '../config/env.js'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'
import { connectDB } from '../config/db.js'
import authRoutes from '../routes/authRoutes.js'
import productRoutes from '../routes/productRoutes.js'
import categoryRoutes from '../routes/categoryRoutes.js'
import wishlistRoutes from '../routes/wishlistRoutes.js'
import analyticsRoutes from '../routes/analyticsRoutes.js'
import { affiliateRedirect } from '../controllers/productController.js'
import { adminLogin, adminLogout, adminMe } from '../controllers/authController.js'
import { requireAdmin } from '../middleware/auth.js'
import Product from '../models/Product.js'
import { notFound, errorHandler } from '../middleware/errorHandler.js'




const app = express()
const port = process.env.PORT || 5000
app.set('trust proxy', 1)
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }))
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true, limit: '1mb' }))
app.use(cookieParser())
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, max: 30, standardHeaders: true, legacyHeaders: false }))
app.get('/api/health', (req, res) => res.json({ ok: true, service: 'stylenest-api' }))
app.get('/go/:productId', affiliateRedirect)
app.get('/sitemap.xml', async (req, res) => {
  const base = process.env.CLIENT_URL || 'http://localhost:5173'
  const products = await Product.find({ status: 'published' }).populate('category', 'slug').select('slug category updatedAt')
  const urls = products.map(p => `<url><loc>${base}/fashion/${p.category?.slug || 'fashion'}/${p.slug}</loc><lastmod>${p.updatedAt.toISOString()}</lastmod></url>`).join('')
  res.type('application/xml').send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${base}/</loc></url><url><loc>${base}/products</loc></url>${urls}</urlset>`)
})
app.use('/api/auth', authRoutes)
app.post('/api/admin/login', adminLogin)
app.post('/api/admin/logout', requireAdmin, adminLogout)
app.get('/api/admin/me', requireAdmin, adminMe)
app.use('/api', productRoutes)
app.use('/api', categoryRoutes)
app.use('/api', wishlistRoutes)
app.use('/api', analyticsRoutes)
app.use(notFound)
app.use(errorHandler)
connectDB().then(() => app.listen(port, () => console.log(`StyleNest API running on port ${port}`))).catch(err => {
  console.error('Failed to start server:', err.message)
  process.exit(1)
})

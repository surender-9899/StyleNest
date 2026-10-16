import { Router } from 'express'
import { listPublic, getPublicBySlug, adminList, adminGet, create, update, remove, changeStatus, affiliateRedirect } from '../controllers/productController.js'
import { requireAdmin } from '../middleware/auth.js'
import { uploadImages } from '../middleware/upload.js'

const router = Router()
router.get('/products', listPublic)
router.get('/products/search', listPublic)
router.get('/products/:slug', getPublicBySlug)
router.get('/go/:productId', affiliateRedirect)
router.get('/admin/products', requireAdmin, adminList)
router.post('/admin/products', requireAdmin, uploadImages, create)
router.get('/admin/products/:id', requireAdmin, adminGet)
router.put('/admin/products/:id', requireAdmin, uploadImages, update)
router.delete('/admin/products/:id', requireAdmin, remove)
router.patch('/admin/products/:id/status/:status', requireAdmin, changeStatus)
export default router

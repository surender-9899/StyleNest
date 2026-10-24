import { Router } from 'express'
import { listPublic, productsByCategory, adminList, create, update, remove } from '../controllers/categoryController.js'
import { requireAdmin } from '../middleware/auth.js'
import { uploadSingleImage } from '../middleware/upload.js'

const router = Router()
router.get('/categories', listPublic)
router.get('/categories/:slug', productsByCategory)
router.get('/admin/categories', requireAdmin, adminList)
router.post('/admin/categories', requireAdmin, uploadSingleImage, create)
router.put('/admin/categories/:id', requireAdmin, uploadSingleImage, update)
router.delete('/admin/categories/:id', requireAdmin, remove)
export default router

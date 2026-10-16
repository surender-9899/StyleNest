import { Router } from 'express'
import { register, login, logout, me, adminLogin, adminLogout, adminMe } from '../controllers/authController.js'
import { requireAdmin, requireUser } from '../middleware/auth.js'

const router = Router()
router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)
router.get('/me', requireUser, me)
router.post('/admin/login', adminLogin)
router.post('/admin/logout', requireAdmin, adminLogout)
router.get('/admin/me', requireAdmin, adminMe)
export default router

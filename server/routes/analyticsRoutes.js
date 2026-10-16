import { Router } from 'express'
import { trackVisit, trackProductView, dashboard, productsAnalytics, categoryAnalytics, sourceAnalytics, storeAnalytics } from '../controllers/analyticsController.js'
import { requireAdmin } from '../middleware/auth.js'
const router = Router()
router.post('/analytics/visit', trackVisit)
router.post('/analytics/product-view', trackProductView)
router.get('/admin/analytics', requireAdmin, dashboard)
router.get('/admin/analytics/products', requireAdmin, productsAnalytics)
router.get('/admin/analytics/categories', requireAdmin, categoryAnalytics)
router.get('/admin/analytics/sources', requireAdmin, sourceAnalytics)
router.get('/admin/analytics/stores', requireAdmin, storeAnalytics)
export default router

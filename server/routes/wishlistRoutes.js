import { Router } from 'express'
import { getWishlist, toggleWishlist, removeWishlist } from '../controllers/wishlistController.js'
import { requireUser } from '../middleware/auth.js'
const router = Router()
router.get('/wishlist', requireUser, getWishlist)
router.post('/wishlist/:productId', requireUser, toggleWishlist)
router.delete('/wishlist/:productId', requireUser, removeWishlist)
export default router

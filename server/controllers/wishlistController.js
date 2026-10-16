import User from '../models/User.js'
import Product from '../models/Product.js'

export async function getWishlist(req, res) {
  const user = await User.findById(req.user.id).populate({ path: 'wishlist', populate: { path: 'category', select: 'name slug' }, select: 'name slug price originalPrice imageUrl images store category status' })
  if (!user) return res.status(401).json({ message: 'Not authenticated' })
  res.json({ wishlist: user.wishlist.filter(p => p && p.status === 'published') })
}

export async function toggleWishlist(req, res) {
  const product = await Product.findOne({ _id: req.params.productId, status: 'published' })
  if (!product) return res.status(404).json({ message: 'Product not found' })
  const user = await User.findById(req.user.id)
  const exists = user.wishlist.some(id => id.toString() === product._id.toString())
  user.wishlist = exists ? user.wishlist.filter(id => id.toString() !== product._id.toString()) : [...user.wishlist, product._id]
  await user.save()
  res.json({ saved: !exists })
}

export async function removeWishlist(req, res) {
  const user = await User.findByIdAndUpdate(req.user.id, { $pull: { wishlist: req.params.productId } }, { new: true })
  if (!user) return res.status(401).json({ message: 'Not authenticated' })
  res.json({ message: 'Removed from wishlist' })
}

import { verifyToken } from '../utils/jwt.js'

export function requireUser(req, res, next) {
  try {
    const token = req.cookies.user_token
    if (!token) return res.status(401).json({ message: 'Not authenticated' })
    req.user = verifyToken(token)
    next()
  } catch {
    return res.status(401).json({ message: 'Not authenticated' })
  }
}

export function requireAdmin(req, res, next) {
  try {
    const token = req.cookies.admin_token
    if (!token) return res.status(401).json({ message: 'Not authenticated as admin' })
    const decoded = verifyToken(token)
    if (decoded.type !== 'admin') return res.status(403).json({ message: 'Not authorized' })
    req.admin = decoded
    next()
  } catch {
    return res.status(401).json({ message: 'Not authenticated as admin' })
  }
}

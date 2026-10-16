import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import Admin from '../models/Admin.js'
import { cookieOptions, signToken } from '../utils/jwt.js'

export async function register(req, res) {
  const { name, email, password, confirmPassword } = req.body
  if (!name || !email || !password || password !== confirmPassword) return res.status(400).json({ message: 'Please complete all fields and make sure passwords match.' })
  if (password.length < 8) return res.status(400).json({ message: 'Password must be at least 8 characters.' })
  const exists = await User.findOne({ email: email.toLowerCase() })
  if (exists) return res.status(409).json({ message: 'An account with this email already exists.' })
  const passwordHash = await bcrypt.hash(password, 12)
  const user = await User.create({ name, email: email.toLowerCase(), passwordHash })
  res.cookie('user_token', signToken({ id: user._id.toString(), type: 'user' }), cookieOptions())
  res.status(201).json({ user: { id: user._id, name: user.name, email: user.email } })
}

export async function login(req, res) {
  const { email, password } = req.body
  const user = await User.findOne({ email: email?.toLowerCase() })
  if (!user || !(await bcrypt.compare(password || '', user.passwordHash))) return res.status(401).json({ message: 'Invalid email or password.' })
  res.cookie('user_token', signToken({ id: user._id.toString(), type: 'user' }), cookieOptions())
  res.json({ user: { id: user._id, name: user.name, email: user.email } })
}

export async function me(req, res) {
  const user = await User.findById(req.user.id).select('name email wishlist')
  if (!user) return res.status(401).json({ message: 'Not authenticated' })
  res.json({ user })
}

export function logout(req, res) {
  res.clearCookie('user_token', cookieOptions())
  res.json({ message: 'Logged out' })
}

export async function adminLogin(req, res) {
  const { email, password } = req.body
  const admin = await Admin.findOne({ email: email?.toLowerCase() })
  if (!admin || !(await bcrypt.compare(password || '', admin.passwordHash))) return res.status(401).json({ message: 'Invalid admin email or password.' })
  res.cookie('admin_token', signToken({ id: admin._id.toString(), type: 'admin', email: admin.email }), cookieOptions())
  res.json({ admin: { id: admin._id, email: admin.email } })
}

export function adminLogout(req, res) {
  res.clearCookie('admin_token', cookieOptions())
  res.json({ message: 'Admin logged out' })
}

export async function adminMe(req, res) {
  const admin = await Admin.findById(req.admin.id).select('email')
  if (!admin) return res.status(401).json({ message: 'Not authenticated as admin' })
  res.json({ admin })
}

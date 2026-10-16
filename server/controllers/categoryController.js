import Category from '../models/Category.js'
import Product from '../models/Product.js'
import { slugify, uniqueSlug } from '../utils/slugify.js'

export async function listPublic(req, res) {
  res.json({ categories: await Category.find().sort({ name: 1 }) })
}

export async function productsByCategory(req, res) {
  const category = await Category.findOne({ slug: req.params.slug })
  if (!category) return res.status(404).json({ message: 'Category not found' })
  const products = await Product.find({ category: category._id, status: 'published' }).populate('category', 'name slug').sort({ createdAt: -1 })
  res.json({ category, products })
}

export async function adminList(req, res) { res.json({ categories: await Category.find().sort({ name: 1 }) }) }

export async function create(req, res) {
  const { name } = req.body
  if (!name?.trim()) return res.status(400).json({ message: 'Category name is required.' })
  if (await Category.findOne({ name: name.trim() })) return res.status(409).json({ message: 'Category already exists.' })
  const slug = await uniqueSlug(Category, name)
  res.status(201).json({ category: await Category.create({ name: name.trim(), slug }) })
}

export async function update(req, res) {
  const cat = await Category.findById(req.params.id)
  if (!cat) return res.status(404).json({ message: 'Category not found' })
  if (!req.body.name?.trim()) return res.status(400).json({ message: 'Category name is required.' })
  const nextName = req.body.name.trim()
  if (nextName === cat.name) { cat.name = nextName }
  else { cat.name = nextName; cat.slug = await uniqueSlug(Category, nextName) }
  await cat.save()
  res.json({ category: cat })
}

export async function remove(req, res) {
  const cat = await Category.findById(req.params.id)
  if (!cat) return res.status(404).json({ message: 'Category not found' })
  const count = await Product.countDocuments({ category: cat._id })
  if (count) return res.status(409).json({ message: 'Cannot delete a category that is used by products. Reassign those products first.' })
  await cat.deleteOne()
  res.json({ message: 'Category deleted' })
}

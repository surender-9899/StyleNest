

import '../config/env.js'
import bcrypt from 'bcryptjs'
import { connectDB } from '../config/db.js'
import Admin from '../models/Admin.js'



await connectDB()
const email = process.env.ADMIN_EMAIL
const password = process.env.ADMIN_PASSWORD
if (!email || !password) throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD in .env')
const passwordHash = await bcrypt.hash(password, 12)
await Admin.findOneAndUpdate({ email: email.toLowerCase() }, { email: email.toLowerCase(), passwordHash }, { upsert: true, new: true, setDefaultsOnInsert: true })
console.log(`Admin ready: ${email}`)
process.exit(0)

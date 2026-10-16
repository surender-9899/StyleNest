import multer from 'multer'

const storage = multer.memoryStorage()
const allowed = ['image/jpeg', 'image/png', 'image/webp']

export const uploadImages = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 10 },
  fileFilter: (req, file, cb) => cb(null, allowed.includes(file.mimetype))
}).array('images', 10)

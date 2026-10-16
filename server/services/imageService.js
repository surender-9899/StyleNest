import { Readable } from 'stream'
import cloudinary from '../config/cloudinary.js'

function uploadBuffer(buffer, folder = 'stylenest/products') {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder, resource_type: 'image' }, (error, result) => {
      if (error) return reject(error)
      resolve({ url: result.secure_url, publicId: result.public_id })
    })
    Readable.from(buffer).pipe(stream)
  })
}

export async function uploadMany(files) {
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    const err = new Error('Cloudinary is not configured. Add Cloudinary credentials to .env')
    err.status = 500
    throw err
  }
  return Promise.all(files.map(file => uploadBuffer(file.buffer)))
}

export async function removeMany(images = []) {
  if (!process.env.CLOUDINARY_CLOUD_NAME) return
  await Promise.allSettled(images.filter(x => x?.publicId).map(x => cloudinary.uploader.destroy(x.publicId, { resource_type: 'image' })))
}

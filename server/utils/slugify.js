export function slugify(value) {
  return value.toString().toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export async function uniqueSlug(Product, base) {
  const root = slugify(base) || 'product'
  let slug = root
  let i = 2
  while (await Product.exists({ slug })) slug = `${root}-${i++}`
  return slug
}

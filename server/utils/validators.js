import validator from 'validator'

export function assertHttpUrl(value) {
  if (!validator.isURL(value, { protocols: ['http', 'https'], require_protocol: true })) {
    const err = new Error('Affiliate URL must be a valid HTTP or HTTPS URL')
    err.status = 400
    throw err
  }
}

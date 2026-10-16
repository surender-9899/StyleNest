import api from '../services/api'

const KEY = 'stylenest_session'
export function getSessionId() {
  let id = localStorage.getItem(KEY)
  if (!id) { id = crypto.randomUUID(); localStorage.setItem(KEY, id) }
  return id
}

export async function trackVisit(path = location.pathname) {
  try { await api.post('/analytics/visit', { sessionId: getSessionId(), path, source: new URLSearchParams(location.search).get('utm_source') }) } catch {}
}
export async function trackProductView(productId, path = location.pathname) {
  try { await api.post('/analytics/product-view', { productId, sessionId: getSessionId(), path, source: new URLSearchParams(location.search).get('utm_source') }) } catch {}
}

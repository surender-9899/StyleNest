import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    Promise.allSettled([api.get('/auth/me'), api.get('/auth/admin/me')]).then(results => {
      if (results[0].status === 'fulfilled') setUser(results[0].value.data.user)
      if (results[1].status === 'fulfilled') setAdmin(results[1].value.data.admin)
    }).finally(() => setLoading(false))
  }, [])
  const value = useMemo(() => ({
    user, admin, loading,
    async userLogin(email, password) { const r = await api.post('/auth/login', { email, password }); setUser(r.data.user); return r.data },
    async register(payload) { const r = await api.post('/auth/register', payload); setUser(r.data.user); return r.data },
    async userLogout() { await api.post('/auth/logout'); setUser(null) },
    async adminLogin(email, password) { const r = await api.post('/auth/admin/login', { email, password }); setAdmin(r.data.admin); return r.data },
    async adminLogout() { await api.post('/auth/admin/logout'); setAdmin(null) }
  }), [user, admin, loading])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
export const useAuth = () => useContext(AuthContext)

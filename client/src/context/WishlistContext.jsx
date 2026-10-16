import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import api from '../services/api'
import { useAuth } from './AuthContext'

const WishlistContext = createContext(null)
export function WishlistProvider({ children }) {
  const { user } = useAuth()
  const [wishlist, setWishlist] = useState([])
  useEffect(() => {
    if (!user) { setWishlist([]); return }
    api.get('/wishlist').then(r => setWishlist(r.data.wishlist)).catch(() => setWishlist([]))
  }, [user])
  const ids = useMemo(() => new Set(wishlist.map(p => p._id)), [wishlist])
  async function toggle(product) {
    const r = await api.post(`/wishlist/${product._id}`)
    setWishlist(prev => r.data.saved ? [...prev, product] : prev.filter(x => x._id !== product._id))
    return r.data.saved
  }
  async function remove(id) { await api.delete(`/wishlist/${id}`); setWishlist(prev => prev.filter(p => p._id !== id)) }
  return <WishlistContext.Provider value={{ wishlist, isSaved: id => ids.has(id), toggle, remove }}>{children}</WishlistContext.Provider>
}
export const useWishlist = () => useContext(WishlistContext)

import { Heart } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useWishlist } from '../context/WishlistContext'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function WishlistButton({ product, iconOnly=false }) {
  const { user } = useAuth(); const { isSaved, toggle } = useWishlist(); const navigate = useNavigate(); const [busy, setBusy] = useState(false); const saved = isSaved(product._id)
  async function onClick(e) { e.preventDefault(); e.stopPropagation(); if (!user) { navigate('/login?from=wishlist'); return } setBusy(true); try { await toggle(product) } finally { setBusy(false) } }
  return <button aria-label={saved?'Remove from wishlist':'Add to wishlist'} disabled={busy} onClick={onClick} className={`${iconOnly?'h-10 w-10':'rounded-xl px-4 py-2'} inline-flex items-center justify-center gap-2 border border-neutral-200 bg-white text-sm font-semibold hover:border-neutral-300 ${saved?'text-blush':'text-ink'}`}><Heart size={17} fill={saved?'currentColor':'none'} />{!iconOnly && (saved?'Saved':'Wishlist')}</button>
}

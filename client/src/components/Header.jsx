import { Search, Heart, UserRound, Menu, X, ChevronDown } from 'lucide-react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useWishlist } from '../context/WishlistContext'

export default function Header() {
  const [open, setOpen] = useState(false); const [cats, setCats] = useState([]); const [q, setQ] = useState(''); const nav = useNavigate(); const { user } = useAuth(); const { wishlist } = useWishlist()
  useEffect(() => { api.get('/categories').then(r => setCats(r.data.categories)).catch(() => { }) }, [])
  function submit(e) { e.preventDefault(); if (q.trim()) nav(`/search?q=${encodeURIComponent(q.trim())}`); }
  const link = ({ isActive }) => `text-sm font-medium ${isActive ? 'text-ink' : 'text-neutral-500 hover:text-ink'}`
  return <header className="sticky top-0 z-50 border-b border-neutral-200/70 bg-cream/95 backdrop-blur">
    <div className="container-page flex h-20 items-center justify-between gap-5">
      <Link to="/" className="flex shrink-0 items-center gap-2"><span className="grid h-9 w-9 place-items-center rounded-full bg-ink text-xs font-bold text-white">SN</span><span className="text-lg font-bold tracking-tight">StyleNest</span></Link>
      <nav className="hidden items-center gap-5 lg:flex">
        <NavLink to="/" className={link}>Home</NavLink>
        <div className="group relative"><button className="flex items-center gap-1 text-sm font-medium text-neutral-500 hover:text-ink">Shop <ChevronDown size={14} /></button><div className="invisible absolute left-0 top-full mt-3 w-48 rounded-2xl border border-neutral-200 bg-white p-2 opacity-0 shadow-soft transition group-hover:visible group-hover:opacity-100">{cats.map(c => <Link key={c._id} to={`/category/${c.slug}`} className="block rounded-lg px-3 py-2 text-sm hover:bg-neutral-50">{c.name}</Link>)}</div></div>
        <NavLink to="/about" className={link}>About Us</NavLink><NavLink to="/contact" className={link}>Contact</NavLink>
      </nav>
      <form onSubmit={submit} className="ml-auto hidden max-w-xs flex-1 items-center rounded-xl border border-neutral-200 bg-white px-3 md:flex"><Search size={17} className="text-neutral-400" /><input aria-label="Search products" className="w-full bg-transparent px-2.5 py-2.5 text-sm outline-none" placeholder="Search fashion..." value={q} onChange={e => setQ(e.target.value)} /></form>
      <div className="ml-auto flex items-center gap-2 md:ml-0"><Link to="/wishlist" aria-label="Wishlist" className="relative grid h-10 w-10 place-items-center rounded-xl hover:bg-white"><Heart size={19} />{wishlist.length > 0 && <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-blush px-1 text-[9px] font-bold text-white">{wishlist.length}</span>}</Link><Link to={user ? '/account' : '/login'} aria-label="Account" className="grid h-10 w-10 place-items-center rounded-xl hover:bg-white"><UserRound size={19} /></Link><button className="grid h-10 w-10 place-items-center rounded-xl hover:bg-white lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu">{open ? <X /> : <Menu />}</button></div>
    </div>
    {open && <div className="border-t border-neutral-200 bg-cream lg:hidden"><div className="container-page flex flex-col gap-4 py-5"><form onSubmit={submit} className="flex items-center rounded-xl border border-neutral-200 bg-white px-3"><Search size={17} /><input className="w-full bg-transparent px-2.5 py-3 text-sm outline-none" placeholder="Search fashion..." value={q} onChange={e => setQ(e.target.value)} /></form><NavLink onClick={() => setOpen(false)} to="/" className={link}>Home</NavLink>{cats.map(c => <NavLink onClick={() => setOpen(false)} key={c._id} to={`/category/${c.slug}`} className={link}>{c.name}</NavLink>)}<NavLink onClick={() => setOpen(false)} to="/about" className={link}>About Us</NavLink><NavLink onClick={() => setOpen(false)} to="/contact" className={link}>Contact</NavLink></div></div>}
  </header>
}

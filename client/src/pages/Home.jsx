import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, Star, ShoppingBag } from 'lucide-react'
import { useEffect, useState } from 'react'
import api from '../services/api'
import ProductCard from '../components/ProductCard'
import Spinner from '../components/Spinner'

const DEFAULT_CATEGORY_IMAGES = {
  accessories: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
  bags: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
  dresses: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
  men: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
  shirts: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
  shoes: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80',
  women: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'
}

export default function Home() {
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [latest, setLatest] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/categories'),
      api.get('/products?sort=popular&limit=4'),
      api.get('/products?sort=newest&limit=4')
    ])
      .then(([a, b, c]) => {
        setCategories(a.data.categories)
        setProducts(b.data.products)
        setLatest(c.data.products)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      {/* =========================================================================
          LUXURY EDITORIAL HERO SECTION (100% RESPONSIVE: MOBILE & DESKTOP)
          ========================================================================= */}
      <section className="container-page pt-2 sm:pt-6 pb-8 sm:pb-12">
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl lg:rounded-[2.5rem] bg-[#f8f6f0] border border-neutral-200/80 shadow-soft">
          
          {/* ==================== DESKTOP SHOWCASE (lg: screens & up) ==================== */}
          <div className="hidden lg:grid lg:grid-cols-12 items-stretch min-h-[580px] xl:min-h-[620px]">
            {/* Left Content Column */}
            <div className="lg:col-span-7 p-10 xl:p-14 flex flex-col justify-between z-10">
              <div>
                {/* Seasonal Pill Tag */}
                <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3.5 py-1.5 border border-neutral-200/80 shadow-xs backdrop-blur-sm">
                  <span className="flex h-2 w-2 rounded-full bg-[#ef476f] animate-pulse" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#0f1e2e]">
                    Spring / Summer '26 Edit
                  </span>
                </div>

                {/* Main Headline */}
                <h1 className="mt-6 font-display font-bold text-5xl xl:text-[62px] leading-[1.06] text-[#0f1e2e] tracking-tight">
                  Redefine Your <br />
                  <span className="italic font-normal font-serif text-[#b56b64]">Everyday</span> Elegance.
                </h1>

                {/* Subtitle */}
                <p className="mt-5 text-base text-neutral-600 leading-relaxed max-w-lg">
                  Explore hand-selected fashion finds from the world’s most coveted stores.
                  Thoughtfully curated looks, verified quality, and seamless direct shopping.
                </p>

                {/* CTA Buttons */}
                <div className="mt-8 flex items-center gap-4">
                  <Link
                    to="/products"
                    className="inline-flex items-center gap-3 rounded-xl bg-[#0f1e2e] px-7 py-4 text-sm font-semibold text-white shadow-md hover:bg-[#1a2d42] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                  >
                    <span>Explore Collection</span>
                    <ArrowRight size={17} />
                  </Link>

                  <Link
                    to="/products?sort=popular"
                    className="inline-flex items-center gap-2 rounded-xl border border-neutral-300/80 bg-white px-6 py-4 text-sm font-semibold text-neutral-800 shadow-xs hover:border-neutral-400 hover:bg-neutral-50 hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <Sparkles size={16} className="text-[#ef476f]" />
                    <span>Trending Picks</span>
                  </Link>
                </div>
              </div>

              {/* Bottom Trust Metrics */}
              <div className="mt-10 pt-8 border-t border-neutral-200/70 grid grid-cols-3 gap-6 max-w-lg">
                <div>
                  <p className="font-display text-2xl font-bold text-[#0f1e2e]">500+</p>
                  <p className="text-xs text-neutral-500 mt-0.5">Curated Brands</p>
                </div>
                <div>
                  <p className="font-display text-2xl font-bold text-[#0f1e2e]">100%</p>
                  <p className="text-xs text-neutral-500 mt-0.5">Verified Retailers</p>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-display text-2xl font-bold text-[#0f1e2e]">4.9</span>
                    <Star size={16} className="fill-[#f59e0b] text-[#f59e0b]" />
                  </div>
                  <p className="text-xs text-neutral-500 mt-0.5">Community Rating</p>
                </div>
              </div>
            </div>

            {/* Right Editorial Visual Showcase */}
            <div className="lg:col-span-5 relative overflow-hidden bg-neutral-200">
              <img
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=85"
                alt="StyleNest High Fashion"
                className="absolute inset-0 h-full w-full object-cover object-[center_top] transition-transform duration-700 ease-out hover:scale-105"
                loading="eager"
              />

              {/* Subtle Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#f8f6f0]/30 via-transparent to-transparent pointer-events-none" />

              {/* Floating Shoppers Badge: Top Right */}
              <div className="absolute top-6 right-6 rounded-2xl bg-white/90 backdrop-blur-md border border-white/60 p-3 shadow-lg shadow-black/10 flex items-center gap-3">
                <div className="flex -space-x-2 overflow-hidden">
                  <img
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                    alt="Shopper"
                  />
                  <img
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                    src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80"
                    alt="Shopper"
                  />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-[#0f1e2e]">12k+ Shoppers</p>
                  <p className="text-[10px] text-neutral-500">Loving our moodboards</p>
                </div>
              </div>

              {/* Floating Product Highlight: Bottom Left */}
              <Link
                to="/products?sort=popular"
                className="group absolute bottom-6 left-6 right-6 rounded-2xl bg-white/95 backdrop-blur-md border border-white/70 p-4 shadow-xl shadow-black/10 flex items-center justify-between hover:bg-white transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=200&q=80"
                    alt="Trending Piece"
                    className="h-12 w-12 rounded-xl object-cover shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="rounded bg-[#ef476f]/10 px-1.5 py-0.5 text-[9px] font-bold uppercase text-[#ef476f]">
                        HOT PICK
                      </span>
                      <p className="text-xs font-semibold text-[#0f1e2e] truncate max-w-[150px]">
                        Floral Silk Silhouette
                      </p>
                    </div>
                    <p className="text-[11px] text-neutral-500 mt-0.5">Explore matching looks</p>
                  </div>
                </div>
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#0f1e2e] text-white group-hover:scale-105 transition-transform">
                  <ArrowRight size={14} />
                </span>
              </Link>
            </div>
          </div>


          {/* ==================== MOBILE & TABLET SHOWCASE (< lg) ==================== */}
          {/* Magazine Cover Hero designed specifically for mobile touch & visual wow factor */}
          <div className="lg:hidden relative min-h-[500px] h-[520px] xs:h-[560px] sm:h-[600px] w-full overflow-hidden flex flex-col justify-between p-5 xs:p-6 sm:p-8">
            
            {/* Background Editorial Image */}
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=85"
              alt="StyleNest Fashion"
              className="absolute inset-0 h-full w-full object-cover object-[center_20%] select-none pointer-events-none"
              loading="eager"
            />

            {/* Cinematic Gradient Overlays: Keeps text ultra crisp while maintaining beauty */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-black/35 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/30 pointer-events-none" />

            {/* TOP BAR: Floating Pill + Rating */}
            <div className="relative z-10 flex items-center justify-between gap-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-md px-3.5 py-1.5 border border-white/25 shadow-sm">
                <span className="flex h-2 w-2 rounded-full bg-[#ef476f] animate-ping" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white">
                  Spring '26 Collection
                </span>
              </div>

              <div className="inline-flex items-center gap-1 rounded-full bg-black/40 backdrop-blur-md px-2.5 py-1 text-[11px] font-semibold text-white border border-white/10">
                <Star size={12} className="fill-[#f59e0b] text-[#f59e0b]" />
                <span>4.9</span>
              </div>
            </div>

            {/* BOTTOM CONTENT AREA: High-Impact Typography & Thumb-Friendly Actions */}
            <div className="relative z-10">
              {/* Eyebrow */}
              <div className="flex items-center gap-2">
                <span className="h-[2px] w-6 bg-[#ef476f]" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#ef476f]">
                  Style Elevated
                </span>
              </div>

              {/* Big Editorial Headline */}
              <h1 className="mt-2.5 font-display font-bold text-3xl xs:text-4xl sm:text-5xl text-white leading-[1.08] tracking-tight drop-shadow-md">
                Redefine Your <br />
                <span className="italic font-normal font-serif text-[#f4d1c9]">Everyday</span> Elegance.
              </h1>

              {/* Subtitle */}
              <p className="mt-2 text-xs xs:text-sm text-white/85 leading-relaxed max-w-sm drop-shadow-xs line-clamp-2">
                Curated designer looks & verified fashion finds from top international stores.
              </p>

              {/* Action Buttons: Thumb-friendly tap targets */}
              <div className="mt-5 flex items-center gap-2.5">
                <Link
                  to="/products"
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-xs xs:text-sm font-bold text-[#0f1e2e] shadow-lg hover:bg-neutral-100 active:scale-[0.98] transition-all duration-150"
                >
                  <ShoppingBag size={15} />
                  <span>Shop Now</span>
                  <ArrowRight size={14} />
                </Link>

                <Link
                  to="/products?sort=popular"
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-white/15 backdrop-blur-md px-4 py-3 text-xs xs:text-sm font-semibold text-white border border-white/25 hover:bg-white/25 active:scale-[0.98] transition-all duration-150"
                >
                  <Sparkles size={14} className="text-[#ef476f]" />
                  <span>Trending</span>
                </Link>
              </div>

              {/* Quick Category Chips for Instant Mobile Navigation */}
              {categories.length > 0 && (
                <div className="mt-4 pt-3 border-t border-white/15 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-[11px]">
                  <span className="text-white/60 shrink-0 font-medium text-[10px] uppercase tracking-wider">Quick:</span>
                  {categories.slice(0, 5).map(c => (
                    <Link
                      key={c._id}
                      to={`/category/${c.slug}`}
                      className="shrink-0 rounded-full bg-white/15 backdrop-blur-sm px-3 py-1 text-white hover:bg-white/30 border border-white/15 transition-colors font-medium"
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="container-page grid grid-cols-2 gap-3 pb-14 pt-1 sm:grid-cols-4">
        <div className="rounded-2xl border border-neutral-200 bg-white p-4">
          <p className="text-xs font-semibold">Curated Picks</p>
          <p className="mt-1 text-xs text-neutral-500">Hand-selected fashion</p>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-4">
          <p className="text-xs font-semibold">Fresh Discoveries</p>
          <p className="mt-1 text-xs text-neutral-500">New products weekly</p>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-4">
          <p className="text-xs font-semibold">Trusted Retailers</p>
          <p className="mt-1 text-xs text-neutral-500">Shop on the original site</p>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-4">
          <p className="text-xs font-semibold">Made to Share</p>
          <p className="mt-1 text-xs text-neutral-500">Clean product links</p>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="container-page pb-16">
        <div className="flex items-end justify-between">
          <div>
            <span className="eyebrow">Shop by mood</span>
            <h2 className="section-title mt-2">Featured categories</h2>
          </div>
          <Link
            className="hidden text-sm font-semibold sm:inline-flex sm:items-center sm:gap-2"
            to="/products"
          >
            View all <ArrowRight size={15} />
          </Link>
        </div>
        <div className="mt-7 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {categories.slice(0, 8).map((c) => {
            const coverImage =
              c.image ||
              c.imageUrl ||
              DEFAULT_CATEGORY_IMAGES[c.slug?.toLowerCase()] ||
              DEFAULT_CATEGORY_IMAGES[c.name?.toLowerCase()]
            return (
              <Link
                key={c._id}
                to={`/category/${c.slug}`}
                className="group relative flex aspect-[4/3] min-h-[160px] flex-col justify-between overflow-hidden rounded-2xl bg-neutral-800 p-6 sm:p-7 shadow-sm transition-all duration-300 hover:shadow-md"
              >
                {coverImage ? (
                  <img
                    src={coverImage}
                    alt={c.name}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-neutral-700 to-neutral-900" />
                )}

                {/* Gradient overlay for perfect contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/30 transition-colors duration-300 group-hover:from-black/85 group-hover:via-black/40" />

                {/* Content */}
                <div className="relative z-10 flex h-full flex-col justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/80">
                    StyleNest
                  </span>
                  <p className="mt-8 text-lg font-semibold text-white drop-shadow-sm sm:text-xl">
                    {c.name}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Trending Products */}
      <section className="container-page pb-16">
        <div className="flex items-end justify-between">
          <div>
            <span className="eyebrow">Most loved</span>
            <h2 className="section-title mt-2">Trending now</h2>
          </div>
          <Link className="text-sm font-semibold" to="/products?sort=popular">
            View all →
          </Link>
        </div>
        {loading ? (
          <div className="py-14 text-center">
            <Spinner />
          </div>
        ) : (
          <div className="mt-7 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Latest Finds */}
      <section className="bg-white">
        <div className="container-page py-16">
          <div className="flex items-end justify-between">
            <div>
              <span className="eyebrow">Just added</span>
              <h2 className="section-title mt-2">Latest finds</h2>
            </div>
            <Sparkles size={22} className="text-neutral-400" />
          </div>
          <div className="mt-7 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
            {latest.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}


import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'
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
      {/* Hero Section */}
      <section
        className="w-full mt-0 pt-0 pb-8 sm:pb-12 overflow-hidden"
        style={{ marginTop: '0px', paddingTop: '0px', borderRadius: '0px' }}
      >
        <div className="relative w-full aspect-[1024/409] min-h-[360px] sm:min-h-[420px] md:min-h-[460px] lg:min-h-[500px] bg-[#faede7] flex items-center overflow-hidden">
          {/* Hero Background Image */}
          <img
            src="/hero-bg.png"
            alt="Discover Trendy Styles"
            className="absolute inset-0 h-full w-full object-cover object-[68%_center] sm:object-center select-none pointer-events-none"
            loading="eager"
            fetchPriority="high"
          />

          {/* Foreground Content */}
          <div className="relative z-10 w-full max-w-[100rem] mx-auto  pl-[8rem] pr-[4rem] flex items-center justify-between">
            {/* Left Content Column */}
            <div className="max-w-sm sm:max-w-md lg:max-w-lg py-6 sm:py-0 pl-[1rem]">
              {/* Eyebrow */}
              <div className="flex items-center gap-2.5">
                <span className="h-[2px] w-6 sm:w-8 bg-[#b56b64]" />
                <span className="text-[10px] sm:text-xs font-semibold tracking-[0.25em] text-[#b56b64] uppercase">
                  Fashion for a better you
                </span>
              </div>

              {/* Headline */}
              <h1 className="mt-3 sm:mt-4 font-display font-bold text-3xl sm:text-5xl md:text-6xl lg:text-[64px] leading-[1.02] text-[#0f1e2e]">
                Discover<br />Trendy Styles
              </h1>

              {/* Subtitle */}
              <p className="mt-3 sm:mt-4 text-xs sm:text-sm md:text-base text-[#374859] leading-relaxed max-w-xs sm:max-w-md">
                Curated fashion finds from top brands.<br className="hidden sm:inline" />
                Shop your favorite looks with ease.
              </p>

              {/* CTA Button */}
              <div className="mt-5 sm:mt-7">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2.5 rounded-lg bg-[#0f1e2e] px-5 py-3 sm:px-6 sm:py-3.5 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-[#1a2d42] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                >
                  Explore Collection <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            {/* Right Script: Good Outfits Brighter Days */}
            <div className="hidden lg:block select-none pointer-events-none text-right -rotate-6 xl:pr-6 pr-[2rem]">
              <p className="font-script text-[#cf867d] text-4xl xl:text-5xl !leading-[1.3] opacity-90">
                Good<br />
                Outfits<br />
                Brighter<br />
                Days
              </p>
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


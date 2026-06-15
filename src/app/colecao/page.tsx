'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import ProductCard from '@/components/ProductCard'
import type { Product } from '@/lib/types'

const CATEGORIES = [
  { slug: '', label: 'Todos' },
  { slug: 'scarpin', label: 'Scarpin' },
  { slug: 'bota', label: 'Botas' },
  { slug: 'sandalia', label: 'Sandálias' },
  { slug: 'mule', label: 'Mules' },
  { slug: 'loafer', label: 'Loafers' },
  { slug: 'sapatilha', label: 'Sapatilhas' },
  { slug: 'plataforma', label: 'Plataformas' },
]

function ColecaoContent() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get('category') || ''
  const promoParam = searchParams.get('promo') === 'true'

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState(categoryParam)
  const [soPromo, setSoPromo] = useState(promoParam)
  const [maxPrice, setMaxPrice] = useState(1000)

  useEffect(() => {
    setCategory(categoryParam)
    setSoPromo(promoParam)
  }, [categoryParam, promoParam])

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (category) params.set('category', category)
        if (soPromo) params.set('promo', 'true')
        const res = await fetch(`/api/products?${params}`)
        const json = await res.json()
        setProducts(json.data || [])
      } catch {
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [category, soPromo])

  const filtered = products.filter((p) => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase())
    const matchPrice = p.price <= maxPrice
    return matchSearch && matchPrice
  })

  return (
    <div className="min-h-screen pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-10">
          <p className="text-gold/60 text-xs tracking-widest uppercase mb-2">Nossa loja</p>
          <h1 className="font-display text-5xl text-fg">Coleção Completa</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-60 shrink-0 space-y-8" id="filters-sidebar">
            {/* Search */}
            <div>
              <label className="text-muted text-xs tracking-widest uppercase block mb-3">
                Buscar
              </label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Nome do produto..."
                id="search-input"
                className="w-full bg-card border border-border text-fg text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-gold/40 placeholder-fg/20 transition-colors"
              />
            </div>

            {/* Categories */}
            <div>
              <label className="text-muted text-xs tracking-widest uppercase block mb-3">
                Categoria
              </label>
              <div className="space-y-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => setCategory(cat.slug)}
                    id={`filter-cat-${cat.slug || 'todos'}`}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                      category === cat.slug
                        ? 'bg-gold/20 text-gold border border-gold/30'
                        : 'text-fg/50 hover:text-fg hover:bg-fg/5'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className="text-muted text-xs tracking-widest uppercase block mb-3">
                Preço até R$ {maxPrice}
              </label>
              <input
                type="range"
                min={100}
                max={1000}
                step={50}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                id="price-range"
                className="w-full accent-gold cursor-pointer"
              />
              <div className="flex justify-between text-fg/30 text-xs mt-1">
                <span>R$ 100</span>
                <span>R$ 1.000</span>
              </div>
            </div>

            {/* Promo toggle */}
            <div>
              <label className="flex items-center gap-3 cursor-pointer" id="promo-toggle-label">
                <div
                  onClick={() => setSoPromo((v) => !v)}
                  className={`w-11 h-6 rounded-full transition-colors cursor-pointer relative ${
                    soPromo ? 'bg-gold' : 'bg-fg/15'
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                      soPromo ? 'left-6' : 'left-1'
                    }`}
                  />
                </div>
                <span className="text-fg/50 text-sm">Só promoções</span>
              </label>
            </div>
          </aside>

          {/* Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-5">
              <p className="text-muted text-sm">
                {loading ? 'Carregando...' : `${filtered.length} produtos`}
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-card rounded-2xl aspect-[3/4] animate-pulse" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-24">
                <span className="text-5xl opacity-20 block mb-4">🔍</span>
                <p className="text-fg/30">Nenhum produto encontrado.</p>
                <button
                  onClick={() => { setSearch(''); setCategory(''); setSoPromo(false); setMaxPrice(1000) }}
                  className="text-gold text-sm mt-4 hover:underline"
                >
                  Limpar filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ColecaoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-28 flex items-center justify-center">
        <div className="text-fg/30">Carregando coleção...</div>
      </div>
    }>
      <ColecaoContent />
    </Suspense>
  )
}

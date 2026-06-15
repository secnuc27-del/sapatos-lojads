'use client'

import { useState, useEffect } from 'react'
import { useParams, notFound } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import type { Product } from '@/lib/types'

export default function ProdutoPage() {
  const params = useParams()
  const id = params.id as string
  const { addItem, openCart } = useCart()

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImg, setSelectedImg] = useState(0)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/products/${id}`)
        if (!res.ok) return notFound()
        const json = await res.json()
        setProduct(json.data)
        if (json.data?.sizes?.[0]) setSelectedSize(json.data.sizes[0])
        if (json.data?.colors?.[0]) setSelectedColor(json.data.colors[0])
      } catch {
        notFound()
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const handleAdd = () => {
    if (!product) return
    addItem(product, qty, selectedSize, selectedColor)
    openCart()
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP || '5599999999999'
  const waText = product
    ? encodeURIComponent(`Olá! Tenho interesse no produto:\n*${product.name}*\nTamanho: ${selectedSize}\nCor: ${selectedColor}\nPreço: R$ ${product.price.toFixed(2).replace('.', ',')}\n\nPoderia me dar mais informações?`)
    : ''

  if (loading) {
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center">
        <div className="text-fg/30 text-sm">Carregando produto...</div>
      </div>
    )
  }

  if (!product) return null

  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : null

  return (
    <div className="min-h-screen pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-fg/30 mb-10" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gold transition-colors">Home</Link>
          <span>/</span>
          <Link href="/colecao" className="hover:text-gold transition-colors">Coleção</Link>
          <span>/</span>
          <span className="text-fg/60">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-card rounded-3xl overflow-hidden border border-border">
              {product.images[selectedImg] && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.images[selectedImg]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImg(i)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImg === i ? 'border-gold' : 'border-border opacity-50 hover:opacity-80'
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            {product.promo && discount && (
              <span className="inline-block bg-gold text-bg text-xs font-black px-3 py-1 rounded-full uppercase">
                -{discount}% OFF
              </span>
            )}

            <div>
              <h1 className="font-display text-4xl text-fg mb-1">{product.name}</h1>
              <p className="text-muted text-sm capitalize">{product.category}</p>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-gold text-4xl font-bold">
                R$ {product.price.toFixed(2).replace('.', ',')}
              </span>
              {product.oldPrice && (
                <span className="text-fg/30 text-xl line-through">
                  R$ {product.oldPrice.toFixed(2).replace('.', ',')}
                </span>
              )}
            </div>

            <p className="text-fg/60 text-sm leading-relaxed">{product.description}</p>

            {/* Sizes */}
            {product.sizes.length > 0 && (
              <div>
                <p className="text-muted text-xs tracking-widest uppercase mb-3">
                  Tamanho: <span className="text-gold">{selectedSize}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      id={`size-${size}`}
                      className={`w-12 h-12 rounded-xl border text-sm font-medium transition-all ${
                        selectedSize === size
                          ? 'border-gold bg-gold/15 text-gold'
                          : 'border-border2 text-fg/50 hover:border-border hover:text-fg'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Colors */}
            {product.colors.length > 0 && (
              <div>
                <p className="text-muted text-xs tracking-widest uppercase mb-3">
                  Cor: <span className="text-gold">{selectedColor}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      id={`color-${color.toLowerCase()}`}
                      className={`px-4 py-2 rounded-xl border text-sm transition-all ${
                        selectedColor === color
                          ? 'border-gold bg-gold/15 text-gold'
                          : 'border-border2 text-fg/50 hover:border-border hover:text-fg'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <p className="text-muted text-xs tracking-widest uppercase">Quantidade</p>
              <div className="flex items-center gap-3 bg-card rounded-xl border border-border px-4 py-2">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-7 h-7 flex items-center justify-center text-fg/60 hover:text-gold transition-colors text-lg"
                >
                  −
                </button>
                <span className="w-6 text-center text-fg font-medium">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="w-7 h-7 flex items-center justify-center text-fg/60 hover:text-gold transition-colors text-lg"
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleAdd}
                id="add-to-cart-btn"
                className={`flex-1 py-4 rounded-2xl font-bold text-base transition-all duration-200 ${
                  added
                    ? 'bg-green text-white'
                    : 'btn-gold'
                }`}
              >
                {added ? '✓ Adicionado ao Carrinho!' : 'Adicionar ao Carrinho'}
              </button>
              <a
                href={`https://wa.me/${whatsapp}?text=${waText}`}
                target="_blank"
                rel="noopener noreferrer"
                id="product-whatsapp-btn"
                className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold px-6 py-4 rounded-2xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-500/30"
              >
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Comprar via WhatsApp
              </a>
            </div>

            {/* Trust */}
            <div className="flex flex-wrap gap-4 pt-4 border-t border-border">
              {['🔒 Compra Segura', '🚚 Frete Grátis acima de R$299', '🔄 Troca em 30 dias'].map((t) => (
                <span key={t} className="text-fg/30 text-xs">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useCart } from '@/context/CartContext'
import type { Product } from '@/lib/types'

interface ProductCardProps {
  product: Product
  variant?: 'default' | 'small'
}

export default function ProductCard({ product, variant = 'default' }: ProductCardProps) {
  const { addItem, openCart } = useCart()
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [added, setAdded] = useState(false)
  const [imgError, setImgError] = useState(false)

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product, 1, selectedSize || product.sizes[0], selectedColor || product.colors[0])
    openCart()
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : null

  if (variant === 'small') {
    return (
      <Link
        href={`/produto/${product.id}`}
        className="group relative bg-card rounded-2xl overflow-hidden border border-border hover:border-gold/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50 flex flex-col"
        id={`product-card-${product.id}`}
      >
        <div className="relative overflow-hidden aspect-square bg-fg/5">
          {!imgError ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl opacity-20">👟</div>
          )}
          {product.promo && (
            <span className="absolute top-2 left-2 bg-gold text-bg text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide">
              {discount ? `-${discount}%` : 'Promo'}
            </span>
          )}
        </div>
        <div className="p-4 flex-1 flex flex-col gap-1">
          <p className="text-fg text-sm font-medium truncate">{product.name}</p>
          <p className="text-muted text-xs capitalize">{product.category}</p>
          <div className="flex items-center gap-2 mt-auto pt-2">
            <span className="text-gold font-bold text-sm">
              R$ {product.price.toFixed(2).replace('.', ',')}
            </span>
            {product.oldPrice && (
              <span className="text-fg/30 text-xs line-through">
                R$ {product.oldPrice.toFixed(2).replace('.', ',')}
              </span>
            )}
          </div>
        </div>
      </Link>
    )
  }

  return (
    <div
      className="group relative bg-card rounded-2xl overflow-hidden border border-border hover:border-gold/40 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-black/60 flex flex-col"
      id={`product-card-${product.id}`}
    >
      {/* Image */}
      <Link href={`/produto/${product.id}`} className="block relative overflow-hidden aspect-[3/4] bg-fg/5">
        {!imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl opacity-10">👟</div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.promo && (
            <span className="bg-gold text-bg text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wide">
              {discount ? `-${discount}%` : 'Promoção'}
            </span>
          )}
          {product.featured && !product.promo && (
            <span className="bg-fg/10 backdrop-blur text-fg text-[10px] px-2 py-1 rounded-full uppercase tracking-wide border border-border2">
              Destaque
            </span>
          )}
        </div>

        {/* Quick view overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="text-white text-xs tracking-widest uppercase border border-white/40 px-4 py-2 rounded-full backdrop-blur">
            Ver detalhes
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col gap-3">
        <div>
          <Link href={`/produto/${product.id}`}>
            <h3 className="text-fg font-medium hover:text-gold transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <p className="text-muted text-xs capitalize mt-0.5">{product.category}</p>
        </div>

        {/* Price */}
        <div className="flex items-center gap-3">
          <span className="text-gold font-bold text-lg">
            R$ {product.price.toFixed(2).replace('.', ',')}
          </span>
          {product.oldPrice && (
            <span className="text-fg/30 text-sm line-through">
              R$ {product.oldPrice.toFixed(2).replace('.', ',')}
            </span>
          )}
        </div>

        {/* Sizes */}
        {product.sizes.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {product.sizes.slice(0, 6).map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`text-xs px-2 py-1 rounded border transition-all ${
                  selectedSize === size
                    ? 'border-gold text-gold bg-gold/10'
                    : 'border-border2 text-fg/50 hover:border-border hover:text-fg'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        )}

        {/* Colors */}
        {product.colors.length > 0 && (
          <div className="flex gap-2">
            {product.colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                title={color}
                className={`text-xs px-2 py-1 rounded border transition-all ${
                  selectedColor === color
                    ? 'border-gold text-gold'
                    : 'border-border2 text-fg/50 hover:border-border hover:text-fg'
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        )}

        {/* Add to cart */}
        <button
          onClick={handleAdd}
          id={`add-to-cart-${product.id}`}
          className={`mt-auto w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200
            ${added
              ? 'bg-green text-white'
              : 'bg-gold hover:bg-gold2 text-bg hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gold/30'
            }`}
        >
          {added ? '✓ Adicionado!' : 'Adicionar ao Carrinho'}
        </button>
      </div>
    </div>
  )
}

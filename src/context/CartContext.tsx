'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { CartItem, Product } from '@/lib/types'

interface CartContextType {
  items: CartItem[]
  total: number
  count: number
  addItem: (product: Product, quantity?: number, size?: string, color?: string) => void
  removeItem: (productId: string, size?: string, color?: string) => void
  updateQuantity: (productId: string, quantity: number, size?: string, color?: string) => void
  clearCart: () => void
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)

  // Carregar carrinho do localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('lumiere_cart')
      if (stored) setItems(JSON.parse(stored))
    } catch {}
  }, [])

  // Salvar no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem('lumiere_cart', JSON.stringify(items))
  }, [items])

  const addItem = useCallback(
    (product: Product, quantity = 1, size?: string, color?: string) => {
      setItems((prev) => {
        const key = `${product.id}-${size}-${color}`
        const existing = prev.find(
          (i) => `${i.product.id}-${i.size}-${i.color}` === key
        )
        if (existing) {
          return prev.map((i) =>
            `${i.product.id}-${i.size}-${i.color}` === key
              ? { ...i, quantity: i.quantity + quantity }
              : i
          )
        }
        return [...prev, { product, quantity, size, color }]
      })
      setIsOpen(true)
    },
    []
  )

  const removeItem = useCallback((productId: string, size?: string, color?: string) => {
    setItems((prev) =>
      prev.filter((i) => !(i.product.id === productId && i.size === size && i.color === color))
    )
  }, [])

  const updateQuantity = useCallback(
    (productId: string, quantity: number, size?: string, color?: string) => {
      if (quantity <= 0) {
        removeItem(productId, size, color)
        return
      }
      setItems((prev) =>
        prev.map((i) =>
          i.product.id === productId && i.size === size && i.color === color
            ? { ...i, quantity }
            : i
        )
      )
    },
    [removeItem]
  )

  const clearCart = useCallback(() => setItems([]), [])
  const openCart = useCallback(() => setIsOpen(true), [])
  const closeCart = useCallback(() => setIsOpen(false), [])
  const toggleCart = useCallback(() => setIsOpen((v) => !v), [])

  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
  const count = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider
      value={{ items, total, count, addItem, removeItem, updateQuantity, clearCart, isOpen, openCart, closeCart, toggleCart }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

'use client'

import { useEffect, useRef, useState } from 'react'
import { useCart } from '@/context/CartContext'
import Loader from '@/components/Loader'

export default function CartDrawer() {
  const { items, total, count, removeItem, updateQuantity, clearCart, isOpen, closeCart } = useCart()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const drawerRef = useRef<HTMLDivElement>(null)
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP || '5599999999999'

  // Fechar com ESC
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [closeCart])

  // Bloquear scroll quando aberto
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const handleWhatsApp = () => {
    if (!items.length) return

    setIsCheckingOut(true)

    const msg = items
      .map((i) => `• ${i.product.name} (${i.size || ''} ${i.color || ''}) x${i.quantity} — R$ ${(i.product.price * i.quantity).toFixed(2).replace('.', ',')}`)
      .join('\n')

    const text = encodeURIComponent(
      `Olá! Gostaria de finalizar meu pedido:\n\n${msg}\n\n*Total: R$ ${total.toFixed(2).replace('.', ',')}*`
    )
    
    setTimeout(() => {
      window.open(`https://wa.me/${whatsapp}?text=${text}`, '_blank')
      setIsCheckingOut(false)
      closeCart()
    }, 1500)
  }

  return (
    <>
      {isCheckingOut && <Loader fullScreen={true} />}
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
          onClick={closeCart}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <aside
        ref={drawerRef}
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-sm flex flex-col
          bg-bg2 border-l border-border
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        aria-label="Carrinho de compras"
        id="cart-drawer"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div className="flex items-center gap-3">
            <span className="text-xl">🛍️</span>
            <h2 className="font-display text-lg text-fg">Carrinho</h2>
            {count > 0 && (
              <span className="text-xs bg-gold text-bg rounded-full px-2 py-0.5 font-bold">
                {count}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="w-9 h-9 flex items-center justify-center rounded-full text-fg/50 hover:text-fg hover:bg-fg/10 transition-colors"
            aria-label="Fechar carrinho"
            id="close-cart-btn"
          >
            ✕
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-16">
              <span className="text-5xl opacity-30">👟</span>
              <p className="text-muted text-sm">Seu carrinho está vazio</p>
              <button
                onClick={closeCart}
                className="text-gold text-sm hover:underline"
              >
                Continuar comprando
              </button>
            </div>
          ) : (
            items.map((item, idx) => (
              <div
                key={`${item.product.id}-${item.size}-${item.color}-${idx}`}
                className="flex gap-3 bg-fg/5 rounded-xl p-3 border border-border hover:border-gold/20 transition-colors"
              >
                {/* Imagem */}
                <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-fg/5">
                  {item.product.images[0] && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-fg text-sm font-medium truncate">{item.product.name}</p>
                  <p className="text-muted text-xs mt-0.5">
                    {[item.size, item.color].filter(Boolean).join(' · ')}
                  </p>
                  <p className="text-gold font-semibold text-sm mt-1">
                    R$ {item.product.price.toFixed(2).replace('.', ',')}
                  </p>

                  {/* Quantidade */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.size, item.color)}
                      className="w-6 h-6 rounded-full border border-border2 text-fg/60 hover:border-gold hover:text-gold text-sm flex items-center justify-center transition-colors"
                    >
                      −
                    </button>
                    <span className="text-fg text-sm w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.size, item.color)}
                      className="w-6 h-6 rounded-full border border-border2 text-fg/60 hover:border-gold hover:text-gold text-sm flex items-center justify-center transition-colors"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeItem(item.product.id, item.size, item.color)}
                      className="ml-auto text-muted/50 hover:text-red-400 transition-colors text-xs"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-border space-y-3">
            <div className="flex justify-between text-fg">
              <span className="text-sm opacity-60">Total</span>
              <span className="font-semibold text-gold">
                R$ {total.toFixed(2).replace('.', ',')}
              </span>
            </div>

            {/* Checkout WhatsApp */}
            <button
              onClick={handleWhatsApp}
              id="checkout-whatsapp-btn"
              className="w-full flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-green-500/30 hover:-translate-y-0.5 active:translate-y-0"
            >
              <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Finalizar pelo WhatsApp
            </button>

            <button
              onClick={clearCart}
              className="w-full text-center text-muted/50 hover:text-muted/80 text-xs transition-colors"
            >
              Limpar carrinho
            </button>
          </div>
        )}
      </aside>
    </>
  )
}

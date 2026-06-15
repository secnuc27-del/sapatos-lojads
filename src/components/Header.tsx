'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useCart } from '@/context/CartContext'
import { ThemeToggle } from './ThemeToggle'
import { AnimatedTabs } from './AnimatedTabs'

const TABS_LINKS = [
  { href: '/', label: 'Início' },
  { href: '/colecao', label: 'Coleção' },
  { href: '/contato', label: 'Contato' },
]

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/colecao', label: 'Coleção' },
  { href: '/colecao?category=scarpin', label: 'Scarpin' },
  { href: '/colecao?category=bota', label: 'Botas' },
  { href: '/colecao?category=sandalia', label: 'Sandálias' },
  { href: '/contato', label: 'Contato' },
]

export default function Header() {
  const pathname = usePathname()
  const { count, toggleCart } = useCart()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${
        scrolled
          ? 'bg-bg/95 backdrop-blur-xl border-b border-border py-3 shadow-xl'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex flex-col leading-none group" id="header-logo">
          <span className="font-black text-2xl tracking-widest text-gold group-hover:text-gold2 transition-colors">
            LUMIÈRE
          </span>
          <span className="text-[9px] tracking-[0.4em] text-muted uppercase">
            Maison de Chaussures
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center" aria-label="Navegação principal">
          <AnimatedTabs tabs={TABS_LINKS} />
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Cart Button */}
          <button
            onClick={toggleCart}
            id="cart-toggle-btn"
            className="relative w-10 h-10 flex items-center justify-center rounded-full text-fg/70 hover:text-gold hover:bg-gold/10 transition-all duration-200"
            aria-label={`Carrinho (${count} itens)`}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            {count > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-gold text-bg text-[10px] font-black rounded-full flex items-center justify-center">
                {count > 9 ? '9+' : count}
              </span>
            )}
          </button>

          {/* WhatsApp */}
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP || '5599999999999'}`}
            target="_blank"
            rel="noopener noreferrer"
            id="header-whatsapp"
            className="hidden sm:flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white text-sm font-semibold px-4 py-2 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-green-500/30 hover:-translate-y-0.5"
          >
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Fale Conosco
          </a>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5"
            aria-label="Menu"
            id="mobile-menu-btn"
          >
            <span className={`block h-px w-6 bg-fg transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block h-px w-6 bg-fg transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-px w-6 bg-fg transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-bg/98 backdrop-blur-xl border-b border-border py-4 px-6 space-y-1 animate-slide-down">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block py-3 text-fg/70 hover:text-gold text-sm border-b border-white/5 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}

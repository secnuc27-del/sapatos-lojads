import type { Metadata } from 'next'
import './globals.css'
import { CartProvider } from '@/context/CartContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CartDrawer from '@/components/CartDrawer'
import AntiInspect from '@/components/AntiInspect'

export const metadata: Metadata = {
  title: {
    default: 'Lumière — Maison de Chaussures',
    template: '%s | Lumière',
  },
  description: 'Calçados de luxo com design exclusivo. Descubra a coleção Lumière — onde a elegância encontra o conforto.',
  keywords: ['sapatos de luxo', 'calçados femininos', 'scarpin', 'sandália', 'bota', 'mule', 'loafer'],
  authors: [{ name: 'Lumière' }],
  creator: 'Lumière',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    title: 'Lumière — Maison de Chaussures',
    description: 'Calçados de luxo com design exclusivo.',
    siteName: 'Lumière',
  },
  robots: {
    index: true,
    follow: true,
  },
  themeColor: '#08070a',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="bg-bg text-fg antialiased">
        <AntiInspect />
        <CartProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  )
}

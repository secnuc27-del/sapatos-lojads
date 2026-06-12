import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/db'
import ProductCard from '@/components/ProductCard'
import type { Product } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Lumière — Maison de Chaussures',
  description: 'Descubra nossa coleção exclusiva de calçados de luxo. Elegância e sofisticação em cada detalhe.',
}

export const revalidate = 60

async function getProducts() {
  try {
    return await prisma.product.findMany({ orderBy: { createdAt: 'desc' } }) as unknown as Product[]
  } catch {
    return []
  }
}

const MARQUEE_ITEMS = [
  'Frete Grátis acima de R$299',
  'Couro Legítimo Italiano',
  'Troca Garantida em 30 dias',
  'Parcele em 12x sem juros',
  'Certificado SSL',
  'Pagamento Seguro',
]

export default async function HomePage() {
  const allProducts = await getProducts()
  const featured = allProducts.filter((p) => p.featured).slice(0, 4)
  const promos = allProducts.filter((p) => p.promo).slice(0, 4)

  return (
    <>
      {/* ── HERO ───────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden" id="hero">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-bg via-bg2 to-bg3" />
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle at 30% 50%, #c9a84c22 0%, transparent 60%), radial-gradient(circle at 70% 50%, #8b6914aa 0%, transparent 60%)',
          }}
        />
        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full blur-3xl opacity-10 bg-gold animate-float1 pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full blur-3xl opacity-10 bg-gold/80 animate-float2 pointer-events-none" />

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(201,168,76,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-gold text-xs tracking-[0.5em] uppercase mb-6 opacity-80">
            ✦ Coleção Exclusiva 2025 ✦
          </p>
          <h1 className="font-display text-6xl sm:text-8xl md:text-9xl text-fg leading-none mb-4">
            Cada passo,<br />
            <span className="gold-gradient italic">uma obra</span><br />
            <span className="text-fg/60 text-5xl sm:text-7xl">de arte.</span>
          </h1>
          <p className="text-fg/50 text-lg max-w-xl mx-auto mt-8 leading-relaxed">
            Calçados de luxo criados para mulheres que expressam elegância em cada detalhe.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
            <Link href="/colecao" id="hero-cta-primary" className="btn-gold text-base">
              Explorar Coleção
            </Link>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP || '5599999999999'}`}
              target="_blank"
              rel="noopener noreferrer"
              id="hero-cta-whatsapp"
              className="flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold px-8 py-4 rounded-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-500/30"
            >
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Comprar pelo WhatsApp
            </a>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-10 mt-20 flex-wrap">
            {[
              { value: '+2.500', label: 'Clientes felizes' },
              { value: '100%', label: 'Couro legítimo' },
              { value: '30 dias', label: 'Troca garantida' },
              { value: '12x', label: 'Sem juros' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-black text-2xl text-gold">{stat.value}</p>
                <p className="text-fg/30 text-xs mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <span className="text-[10px] tracking-widest uppercase text-fg">scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-gold to-transparent" />
        </div>
      </section>

      {/* ── MARQUEE ─────────────────────────────────────── */}
      <div className="overflow-hidden border-y border-gold/20 py-4 bg-bg2">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-6 mx-8 text-gold/60 text-xs tracking-widest uppercase">
              <span className="text-gold">✦</span>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── CATEGORIAS ──────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-24" id="categorias">
        <div className="text-center mb-14">
          <p className="text-gold/60 text-xs tracking-widest uppercase mb-3">Navegue por</p>
          <h2 className="section-title">Categorias</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { slug: 'scarpin', label: 'Scarpin', emoji: '👠' },
            { slug: 'bota', label: 'Botas', emoji: '👢' },
            { slug: 'sandalia', label: 'Sandálias', emoji: '🩴' },
            { slug: 'mule', label: 'Mules', emoji: '✨' },
            { slug: 'loafer', label: 'Loafers', emoji: '🥿' },
            { slug: 'sapatilha', label: 'Sapatilhas', emoji: '🎀' },
          ].map((cat) => (
            <Link
              key={cat.slug}
              href={`/colecao?category=${cat.slug}`}
              id={`cat-${cat.slug}`}
              className="group flex flex-col items-center gap-3 p-6 bg-card rounded-2xl border border-border hover:border-gold/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20"
            >
              <span className="text-3xl group-hover:scale-110 transition-transform duration-300">
                {cat.emoji}
              </span>
              <span className="text-fg/60 text-xs group-hover:text-gold transition-colors tracking-wide">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── DESTAQUES ───────────────────────────────────── */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-24" id="destaques">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-gold/60 text-xs tracking-widest uppercase mb-2">Escolhas da semana</p>
              <h2 className="section-title text-4xl">Em Destaque</h2>
            </div>
            <Link href="/colecao" className="text-gold text-sm hover:underline hidden sm:block">
              Ver tudo →
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* ── BANNER LUXO ─────────────────────────────────── */}
      <section className="mx-4 sm:mx-6 max-w-7xl lg:mx-auto rounded-3xl overflow-hidden mb-24">
        <div className="relative min-h-[400px] flex items-center"
          style={{ background: 'linear-gradient(135deg, var(--bg2) 0%, var(--bg3) 100%)' }}
        >
          {/* Border gold animated */}
          <div className="absolute inset-0 rounded-3xl border border-gold/30" />
          <div className="absolute inset-0 rounded-3xl opacity-30"
            style={{ background: 'radial-gradient(ellipse at center, #c9a84c22 0%, transparent 70%)' }}
          />

          <div className="relative px-8 sm:px-16 py-16 text-center w-full">
            <p className="text-gold/60 text-xs tracking-widest uppercase mb-4">✦ Exclusividade ✦</p>
            <h2 className="font-display text-4xl sm:text-6xl text-fg italic mb-6">
              &ldquo;O luxo não é superficialidade.<br />
              <span className="text-gold">É atenção ao detalhe.&rdquo;</span>
            </h2>
            <p className="text-muted text-base max-w-lg mx-auto mb-10">
              Cada par é confeccionado com couro legítimo e acabamento artesanal italiano.
            </p>
            <Link href="/colecao" id="banner-cta" className="btn-gold inline-block">
              Descobrir a Coleção
            </Link>
          </div>
        </div>
      </section>

      {/* ── PROMOÇÕES ───────────────────────────────────── */}
      {promos.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-24" id="promocoes">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-gold/60 text-xs tracking-widest uppercase mb-2">Ofertas especiais</p>
              <h2 className="section-title text-4xl">Promoções</h2>
            </div>
            <Link href="/colecao?promo=true" className="text-gold text-sm hover:underline hidden sm:block">
              Ver todas →
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {promos.map((product) => (
              <ProductCard key={product.id} product={product} variant="small" />
            ))}
          </div>
        </section>
      )}

      {/* ── VANTAGENS ───────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-24" id="vantagens">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { icon: '🚚', title: 'Frete Grátis', desc: 'Compras acima de R$299' },
            { icon: '🔒', title: 'Pagamento Seguro', desc: 'SSL + Cloudflare protegido' },
            { icon: '🔄', title: 'Troca Garantida', desc: 'Até 30 dias após a compra' },
            { icon: '💳', title: 'Parcele em 12x', desc: 'Sem juros no cartão' },
          ].map((v) => (
            <div
              key={v.title}
              className="glass rounded-2xl p-6 flex gap-4 items-start hover:border-gold/20 transition-colors"
            >
              <span className="text-3xl">{v.icon}</span>
              <div>
                <h3 className="text-fg font-semibold text-sm">{v.title}</h3>
                <p className="text-muted text-xs mt-1">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA FINAL ───────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-24 text-center" id="cta-final">
        <h2 className="section-title mb-6">
          Encontrou algo que<br />
          <span className="gold-gradient italic">amou?</span>
        </h2>
        <p className="text-muted mb-10">
          Fale diretamente pelo WhatsApp e finalize seu pedido com atendimento personalizado.
        </p>
        <a
          href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP || '5599999999999'}`}
          target="_blank"
          rel="noopener noreferrer"
          id="cta-final-whatsapp"
          className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold px-10 py-5 rounded-full transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-green-500/30 text-base animate-wa-pulse"
        >
          <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Falar com Atendente
        </a>
      </section>
    </>
  )
}

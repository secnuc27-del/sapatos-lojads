'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Product } from '@/lib/types'

export default function AdminProdutosPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: '', category: 'scarpin', price: '', oldPrice: '',
    description: '', images: '', sizes: '', colors: '',
    featured: false, promo: false, stock: '0',
  })

  const loadProducts = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/products')
      const json = await res.json()
      setProducts(json.data || [])
    } catch {
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadProducts() }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return
    setDeleting(id)
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' })
      setProducts((prev) => prev.filter((p) => p.id !== id))
    } catch {
      alert('Erro ao excluir produto')
    } finally {
      setDeleting(null)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const body = {
        ...form,
        price: Number(form.price),
        oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
        stock: Number(form.stock),
        images: form.images.split(',').map((s) => s.trim()).filter(Boolean),
        sizes: form.sizes.split(',').map((s) => s.trim()).filter(Boolean),
        colors: form.colors.split(',').map((s) => s.trim()).filter(Boolean),
      }
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error('Erro ao salvar')
      setShowForm(false)
      setForm({ name: '', category: 'scarpin', price: '', oldPrice: '', description: '', images: '', sizes: '', colors: '', featured: false, promo: false, stock: '0' })
      await loadProducts()
    } catch {
      alert('Erro ao salvar produto')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Admin Header */}
      <header className="bg-[#0f0e13] border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="font-black text-xl tracking-widest text-[#c9a84c]">LUMIÈRE</span>
          <span className="text-[#f0ede8]/30 text-xs">Admin</span>
          <nav className="flex items-center gap-4">
            <Link href="/admin/produtos" className="text-sm text-[#c9a84c]">Produtos</Link>
            <Link href="/admin/pedidos" className="text-sm text-[#f0ede8]/50 hover:text-[#f0ede8] transition-colors">Pedidos</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" target="_blank" className="text-[#f0ede8]/30 hover:text-[#f0ede8] text-xs transition-colors">
            Ver loja ↗
          </Link>
          <button
            onClick={handleLogout}
            id="admin-logout-btn"
            className="text-[#f0ede8]/30 hover:text-red-400 text-xs transition-colors"
          >
            Sair
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-[#f0ede8] text-2xl font-semibold">Produtos</h1>
            <p className="text-[#f0ede8]/30 text-sm mt-1">{products.length} produtos cadastrados</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            id="add-product-btn"
            className="bg-[#c9a84c] hover:bg-[#e8c96b] text-[#08070a] font-bold px-6 py-3 rounded-xl transition-all hover:-translate-y-0.5 text-sm"
          >
            + Novo Produto
          </button>
        </div>

        {/* Add Product Form Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur">
            <div className="bg-[#111018] rounded-3xl border border-white/10 p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[#f0ede8] font-semibold text-lg">Novo Produto</h2>
                <button onClick={() => setShowForm(false)} className="text-[#f0ede8]/40 hover:text-[#f0ede8]">✕</button>
              </div>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-[#f0ede8]/40 text-xs uppercase tracking-widest block mb-1.5">Nome *</label>
                    <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-[#0f0e13] border border-white/10 text-[#f0ede8] text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-[#c9a84c]/40"
                      placeholder="Nome do produto"
                    />
                  </div>
                  <div>
                    <label className="text-[#f0ede8]/40 text-xs uppercase tracking-widest block mb-1.5">Categoria *</label>
                    <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full bg-[#0f0e13] border border-white/10 text-[#f0ede8] text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-[#c9a84c]/40"
                    >
                      {['scarpin', 'bota', 'sandalia', 'mule', 'loafer', 'sapatilha', 'plataforma'].map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[#f0ede8]/40 text-xs uppercase tracking-widest block mb-1.5">Estoque</label>
                    <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })}
                      className="w-full bg-[#0f0e13] border border-white/10 text-[#f0ede8] text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-[#c9a84c]/40"
                    />
                  </div>
                  <div>
                    <label className="text-[#f0ede8]/40 text-xs uppercase tracking-widest block mb-1.5">Preço *</label>
                    <input required type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                      className="w-full bg-[#0f0e13] border border-white/10 text-[#f0ede8] text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-[#c9a84c]/40"
                      placeholder="299.90"
                    />
                  </div>
                  <div>
                    <label className="text-[#f0ede8]/40 text-xs uppercase tracking-widest block mb-1.5">Preço Antigo</label>
                    <input type="number" step="0.01" value={form.oldPrice} onChange={(e) => setForm({ ...form, oldPrice: e.target.value })}
                      className="w-full bg-[#0f0e13] border border-white/10 text-[#f0ede8] text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-[#c9a84c]/40"
                      placeholder="399.90"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-[#f0ede8]/40 text-xs uppercase tracking-widest block mb-1.5">Descrição *</label>
                    <textarea required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                      rows={3}
                      className="w-full bg-[#0f0e13] border border-white/10 text-[#f0ede8] text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-[#c9a84c]/40 resize-none"
                      placeholder="Descrição do produto..."
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-[#f0ede8]/40 text-xs uppercase tracking-widest block mb-1.5">URLs das Imagens (separadas por vírgula)</label>
                    <input value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })}
                      className="w-full bg-[#0f0e13] border border-white/10 text-[#f0ede8] text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-[#c9a84c]/40"
                      placeholder="https://..., https://..."
                    />
                  </div>
                  <div>
                    <label className="text-[#f0ede8]/40 text-xs uppercase tracking-widest block mb-1.5">Tamanhos (separados por vírgula)</label>
                    <input value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })}
                      className="w-full bg-[#0f0e13] border border-white/10 text-[#f0ede8] text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-[#c9a84c]/40"
                      placeholder="34, 35, 36, 37, 38"
                    />
                  </div>
                  <div>
                    <label className="text-[#f0ede8]/40 text-xs uppercase tracking-widest block mb-1.5">Cores (separadas por vírgula)</label>
                    <input value={form.colors} onChange={(e) => setForm({ ...form, colors: e.target.value })}
                      className="w-full bg-[#0f0e13] border border-white/10 text-[#f0ede8] text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-[#c9a84c]/40"
                      placeholder="Preto, Nude, Marsala"
                    />
                  </div>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                        className="accent-[#c9a84c]"
                      />
                      <span className="text-[#f0ede8]/60 text-sm">Destaque</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={form.promo} onChange={(e) => setForm({ ...form, promo: e.target.checked })}
                        className="accent-[#c9a84c]"
                      />
                      <span className="text-[#f0ede8]/60 text-sm">Promoção</span>
                    </label>
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowForm(false)}
                    className="flex-1 border border-white/15 text-[#f0ede8]/50 hover:text-[#f0ede8] py-3 rounded-xl text-sm transition-colors"
                  >
                    Cancelar
                  </button>
                  <button type="submit" disabled={saving}
                    id="save-product-btn"
                    className="flex-1 bg-[#c9a84c] hover:bg-[#e8c96b] text-[#08070a] font-bold py-3 rounded-xl text-sm transition-all disabled:opacity-50"
                  >
                    {saving ? 'Salvando...' : 'Salvar Produto'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Products Table */}
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 bg-[#111018] rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="bg-[#111018] rounded-2xl border border-white/8 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/8">
                  <th className="text-left px-5 py-4 text-[#f0ede8]/40 text-xs uppercase tracking-widest font-medium">Produto</th>
                  <th className="text-left px-5 py-4 text-[#f0ede8]/40 text-xs uppercase tracking-widest font-medium hidden md:table-cell">Categoria</th>
                  <th className="text-left px-5 py-4 text-[#f0ede8]/40 text-xs uppercase tracking-widest font-medium">Preço</th>
                  <th className="text-left px-5 py-4 text-[#f0ede8]/40 text-xs uppercase tracking-widest font-medium hidden sm:table-cell">Estoque</th>
                  <th className="text-right px-5 py-4 text-[#f0ede8]/40 text-xs uppercase tracking-widest font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/5 overflow-hidden shrink-0">
                          {p.images[0] && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div>
                          <p className="text-[#f0ede8] text-sm font-medium">{p.name}</p>
                          <div className="flex gap-1.5 mt-0.5">
                            {p.featured && <span className="text-[10px] bg-[#c9a84c]/20 text-[#c9a84c] px-1.5 py-0.5 rounded">Destaque</span>}
                            {p.promo && <span className="text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded">Promo</span>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <span className="text-[#f0ede8]/50 text-sm capitalize">{p.category}</span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-[#c9a84c] text-sm font-medium">
                        R$ {p.price.toFixed(2).replace('.', ',')}
                      </p>
                      {p.oldPrice && (
                        <p className="text-[#f0ede8]/25 text-xs line-through">
                          R$ {p.oldPrice.toFixed(2).replace('.', ',')}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-4 hidden sm:table-cell">
                      <span className={`text-sm ${p.stock < 5 ? 'text-red-400' : 'text-[#f0ede8]/50'}`}>
                        {p.stock} un.
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => handleDelete(p.id)}
                        disabled={deleting === p.id}
                        className="text-[#f0ede8]/25 hover:text-red-400 text-xs transition-colors disabled:opacity-50"
                      >
                        {deleting === p.id ? '...' : 'Excluir'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

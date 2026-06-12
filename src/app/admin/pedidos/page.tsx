'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { Order } from '@/lib/types'

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-500/20 text-yellow-400',
  confirmed: 'bg-blue-500/20 text-blue-400',
  shipped: 'bg-purple-500/20 text-purple-400',
  delivered: 'bg-green-500/20 text-green-400',
  cancelled: 'bg-red-500/20 text-red-400',
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendente',
  confirmed: 'Confirmado',
  shipped: 'Enviado',
  delivered: 'Entregue',
  cancelled: 'Cancelado',
}

export default function AdminPedidosPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/orders')
        const json = await res.json()
        setOrders(json.data || [])
      } catch {
        setOrders([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0)

  return (
    <div className="min-h-screen">
      {/* Admin Header */}
      <header className="bg-[#0f0e13] border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="font-black text-xl tracking-widest text-[#c9a84c]">LUMIÈRE</span>
          <span className="text-[#f0ede8]/30 text-xs">Admin</span>
          <nav className="flex items-center gap-4">
            <Link href="/admin/produtos" className="text-sm text-[#f0ede8]/50 hover:text-[#f0ede8] transition-colors">Produtos</Link>
            <Link href="/admin/pedidos" className="text-sm text-[#c9a84c]">Pedidos</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" target="_blank" className="text-[#f0ede8]/30 hover:text-[#f0ede8] text-xs transition-colors">
            Ver loja ↗
          </Link>
          <button
            onClick={handleLogout}
            id="admin-logout-btn-pedidos"
            className="text-[#f0ede8]/30 hover:text-red-400 text-xs transition-colors"
          >
            Sair
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total de Pedidos', value: orders.length },
            { label: 'Pendentes', value: orders.filter((o) => o.status === 'pending').length },
            { label: 'Entregues', value: orders.filter((o) => o.status === 'delivered').length },
            { label: 'Receita Total', value: `R$ ${totalRevenue.toFixed(2).replace('.', ',')}` },
          ].map((stat) => (
            <div key={stat.label} className="bg-[#111018] rounded-2xl border border-white/8 p-5">
              <p className="text-[#f0ede8]/40 text-xs uppercase tracking-widest mb-2">{stat.label}</p>
              <p className="text-[#f0ede8] text-2xl font-semibold">{stat.value}</p>
            </div>
          ))}
        </div>

        <h1 className="text-[#f0ede8] text-2xl font-semibold mb-6">Pedidos</h1>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 bg-[#111018] rounded-xl animate-pulse" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-[#111018] rounded-2xl border border-white/8 p-16 text-center">
            <span className="text-4xl opacity-20 block mb-4">📦</span>
            <p className="text-[#f0ede8]/30 text-sm">Nenhum pedido ainda</p>
          </div>
        ) : (
          <div className="bg-[#111018] rounded-2xl border border-white/8 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/8">
                  <th className="text-left px-5 py-4 text-[#f0ede8]/40 text-xs uppercase tracking-widest font-medium">ID</th>
                  <th className="text-left px-5 py-4 text-[#f0ede8]/40 text-xs uppercase tracking-widest font-medium">Cliente</th>
                  <th className="text-left px-5 py-4 text-[#f0ede8]/40 text-xs uppercase tracking-widest font-medium hidden md:table-cell">Data</th>
                  <th className="text-left px-5 py-4 text-[#f0ede8]/40 text-xs uppercase tracking-widest font-medium">Total</th>
                  <th className="text-left px-5 py-4 text-[#f0ede8]/40 text-xs uppercase tracking-widest font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors">
                    <td className="px-5 py-4">
                      <span className="text-[#f0ede8]/40 text-xs font-mono">{order.id.slice(0, 8)}...</span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-[#f0ede8] text-sm">{order.customer}</p>
                      {order.phone && <p className="text-[#f0ede8]/30 text-xs">{order.phone}</p>}
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <span className="text-[#f0ede8]/40 text-xs">
                        {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-[#c9a84c] font-medium text-sm">
                        R$ {order.total.toFixed(2).replace('.', ',')}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full ${STATUS_COLORS[order.status] || 'bg-white/10 text-white/50'}`}>
                        {STATUS_LABELS[order.status] || order.status}
                      </span>
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

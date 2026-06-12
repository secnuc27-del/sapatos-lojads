'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPass, setShowPass] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const json = await res.json()

      if (!res.ok) {
        setError(json.error || 'Credenciais inválidas')
        return
      }

      router.push('/admin/produtos')
      router.refresh()
    } catch {
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#08070a] flex items-center justify-center p-4">
      {/* Background */}
      <div className="fixed inset-0 opacity-20 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #c9a84c11 0%, transparent 70%)' }}
      />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <p className="font-black text-3xl tracking-widest text-[#c9a84c]">LUMIÈRE</p>
          <p className="text-[9px] tracking-[0.4em] text-[#f0ede8]/30 uppercase mt-1">Área Administrativa</p>
        </div>

        {/* Card */}
        <div className="bg-[#111018] rounded-3xl border border-white/10 p-8">
          <h1 className="text-[#f0ede8] font-semibold text-xl mb-1">Entrar</h1>
          <p className="text-[#f0ede8]/30 text-sm mb-8">
            Acesso restrito aos administradores
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="admin-email" className="block text-[#f0ede8]/50 text-xs uppercase tracking-widest mb-2">
                Email
              </label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full bg-[#0f0e13] border border-white/10 text-[#f0ede8] text-sm px-4 py-3.5 rounded-xl focus:outline-none focus:border-[#c9a84c]/50 placeholder-[#f0ede8]/20 transition-colors"
                placeholder="admin@lumiere.com"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="admin-password" className="block text-[#f0ede8]/50 text-xs uppercase tracking-widest mb-2">
                Senha
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full bg-[#0f0e13] border border-white/10 text-[#f0ede8] text-sm px-4 py-3.5 pr-12 rounded-xl focus:outline-none focus:border-[#c9a84c]/50 placeholder-[#f0ede8]/20 transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#f0ede8]/30 hover:text-[#f0ede8]/70 transition-colors"
                >
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              id="admin-login-btn"
              disabled={loading}
              className="w-full bg-[#c9a84c] hover:bg-[#e8c96b] text-[#08070a] font-bold py-4 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#c9a84c]/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          {/* Security info */}
          <div className="mt-6 pt-6 border-t border-white/8 flex items-center justify-center gap-2">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#f0ede8]/20">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            <span className="text-[#f0ede8]/20 text-xs">
              Conexão segura · JWT · bcrypt
            </span>
          </div>
        </div>

        {/* Default creds hint (dev only) */}
        {process.env.NODE_ENV === 'development' && (
          <p className="text-center text-[#f0ede8]/20 text-xs mt-4">
            dev: admin@lumiere.com / admin123
          </p>
        )}
      </div>
    </div>
  )
}

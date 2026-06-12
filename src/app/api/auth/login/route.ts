import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { signToken, TOKEN_COOKIE } from '@/lib/auth'
import { isValidEmail, hasSQLInjection } from '@/lib/security'

// POST /api/auth/login
export async function POST(request: Request) {
  try {
    // ── Validar Content-Type ─────────────────────────────────────────────
    const contentType = request.headers.get('content-type') || ''
    if (!contentType.includes('application/json')) {
      return NextResponse.json(
        { error: 'Content-Type inválido' },
        { status: 415 }
      )
    }

    // ── Parsear body com tamanho limitado ─────────────────────────────────
    let body: { email?: unknown; password?: unknown }
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Body inválido' }, { status: 400 })
    }

    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
    const password = typeof body.password === 'string' ? body.password : ''

    // ── Validação de campos ───────────────────────────────────────────────
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email e senha são obrigatórios' },
        { status: 400 }
      )
    }

    // Limitar tamanho para evitar DoS com bcrypt em senhas muito longas
    if (password.length > 128) {
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      )
    }

    // Validar formato do e-mail (proteção básica contra SQLi/injeção)
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      )
    }

    // Detectar tentativas de injeção
    if (hasSQLInjection(email) || hasSQLInjection(password)) {
      console.warn('[AUTH/LOGIN] Injection attempt detected')
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      )
    }

    // ── Buscar usuário ────────────────────────────────────────────────────
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      // Timing attack mitigation: sempre rodar bcrypt mesmo com usuário inexistente
      await bcrypt.compare(password, '$2b$12$invalidhashtopreventtimingattackXXXXXXXXXXXX')
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      )
    }

    // ── Verificar senha ───────────────────────────────────────────────────
    const passwordValid = await bcrypt.compare(password, user.password)

    if (!passwordValid) {
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      )
    }

    // ── Gerar JWT ─────────────────────────────────────────────────────────
    const token = await signToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    })

    // ── Resposta segura ───────────────────────────────────────────────────
    const response = NextResponse.json({
      message: 'Login realizado com sucesso',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })

    response.cookies.set(TOKEN_COOKIE, token, {
      httpOnly: true,        // Bloqueado a JS → anti-XSS
      secure: process.env.NODE_ENV === 'production', // HTTPS em produção
      sameSite: 'strict',    // Proteção CSRF (mudado de lax para strict)
      maxAge: 60 * 60 * 8,   // 8 horas (reduzido de 7 dias para maior segurança)
      path: '/',
    })

    return response
  } catch (error) {
    // Não vazar detalhes do erro para o cliente
    console.error('[AUTH/LOGIN] Internal error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║          MIDDLEWARE DE SEGURANÇA — LUMIÈRE SHOES                        ║
 * ║                                                                          ║
 * ║  Camadas de proteção (em ordem de execução):                            ║
 * ║  1. Bot & Scanner Detection (Nikto, Gobuster, SQLMap, Selenium…)        ║
 * ║  2. Rate Limiting (Hydra, FFUF, Wfuzz, Burp Intruder…)                 ║
 * ║  3. Honeypot paths (enumeração de arquivos)                             ║
 * ║  4. Security Headers (XSS, Clickjacking, MIME sniff, HSTS…)            ║
 * ║  5. CSRF Protection (API mutations)                                     ║
 * ║  6. JWT Authentication (Admin routes)                                   ║
 * ║  7. Path Traversal Block                                                ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit'
import { detectBotOrScanner } from '@/lib/bot-detection'
import { hasPathTraversal } from '@/lib/security'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret-change-in-production'
)

const TOKEN_COOKIE = 'lumiere_auth'

// ─── Helpers ────────────────────────────────────────────────────────────────

function getClientIP(request: NextRequest): string {
  return (
    request.headers.get('cf-connecting-ip') ||      // Cloudflare
    request.headers.get('x-real-ip') ||             // Nginx proxy
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    '127.0.0.1'
  )
}

function blockResponse(reason: string, status = 403): NextResponse {
  // Resposta genérica — não revelar detalhes ao atacante
  return new NextResponse(
    JSON.stringify({ error: 'Acesso negado' }),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
        'X-Block-Reason': reason, // Apenas para debug interno; remover em produção extrema
      },
    }
  )
}

function addSecurityHeaders(response: NextResponse): NextResponse {
  const h = response.headers

  // HSTS — força HTTPS por 2 anos
  h.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')

  // Anti-Clickjacking
  h.set('X-Frame-Options', 'DENY')

  // Anti-MIME sniffing
  h.set('X-Content-Type-Options', 'nosniff')

  // XSS Filter (legado, mas ainda útil)
  h.set('X-XSS-Protection', '1; mode=block')

  // Referrer Policy
  h.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  // Permissions Policy — desabilitar câmera, microfone, geolocalização
  h.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()')

  // CSP — Content Security Policy robusta
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",  // Necessário para Next.js
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' https://images.unsplash.com data: blob:",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests",
  ].join('; ')

  h.set('Content-Security-Policy', csp)

  // Ocultar informações do servidor
  h.delete('X-Powered-By')
  h.delete('Server')

  // Impedir caching de páginas sensíveis
  return response
}

// ─── Middleware principal ────────────────────────────────────────────────────

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const ip = getClientIP(request)
  const userAgent = request.headers.get('user-agent')

  // ── 1. PROTEÇÃO CONTRA PATH TRAVERSAL ─────────────────────────────────
  if (hasPathTraversal(decodeURIComponent(pathname))) {
    console.warn(`[SECURITY] Path traversal attempt from ${ip}: ${pathname}`)
    return blockResponse('path_traversal', 400)
  }

  // ── 2. BOT & SCANNER DETECTION ────────────────────────────────────────
  const botCheck = detectBotOrScanner(userAgent, pathname, request.headers)

  if (botCheck.isBot) {
    console.warn(`[SECURITY] Bot/Scanner blocked - IP: ${ip}, reason: ${botCheck.reason}, path: ${pathname}`)

    if (botCheck.isHoneypot) {
      // Honeypot: retornar 404 convincente (não revelar que detectamos)
      return new NextResponse('Not Found', { status: 404 })
    }

    // Para scanners de UA: retornar 403 genérico
    return blockResponse(botCheck.reason || 'bot_detected')
  }

  // ── 3. RATE LIMITING ─────────────────────────────────────────────────
  const isLoginEndpoint = pathname === '/api/auth/login'
  const isOrderEndpoint = pathname === '/api/orders'
  const isAPIEndpoint = pathname.startsWith('/api/')

  if (isLoginEndpoint) {
    // Rate limit severo para login (anti brute-force / Hydra)
    const limitKey = `login:${ip}`
    const result = checkRateLimit(limitKey, RATE_LIMITS.LOGIN)

    if (!result.allowed) {
      const waitMins = Math.ceil(((result.blockedUntil || 0) - Date.now()) / 60000)
      console.warn(`[SECURITY] Login rate limit exceeded - IP: ${ip}`)
      return new NextResponse(
        JSON.stringify({
          error: `Muitas tentativas. Tente novamente em ${waitMins} minuto(s).`,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(Math.ceil(((result.blockedUntil || 0) - Date.now()) / 1000)),
            'X-RateLimit-Limit': String(RATE_LIMITS.LOGIN.maxRequests),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(result.resetAt),
          },
        }
      )
    }
  } else if (isOrderEndpoint && request.method === 'POST') {
    const limitKey = `orders:${ip}`
    const result = checkRateLimit(limitKey, RATE_LIMITS.ORDERS)

    if (!result.allowed) {
      return new NextResponse(
        JSON.stringify({ error: 'Limite de pedidos excedido. Tente novamente mais tarde.' }),
        { status: 429, headers: { 'Content-Type': 'application/json', 'Retry-After': '3600' } }
      )
    }
  } else if (isAPIEndpoint) {
    // Rate limit geral para toda API
    const limitKey = `api:${ip}`
    const result = checkRateLimit(limitKey, RATE_LIMITS.API_GENERAL)

    if (!result.allowed) {
      return new NextResponse(
        JSON.stringify({ error: 'Muitas requisições. Aguarde um momento.' }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': '60',
            'X-RateLimit-Limit': String(RATE_LIMITS.API_GENERAL.maxRequests),
            'X-RateLimit-Remaining': '0',
          },
        }
      )
    }
  }

  // ── 4. CSRF PROTECTION (para mutations de API) ────────────────────────
  const isMutation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)

  if (isAPIEndpoint && isMutation && !isLoginEndpoint) {
    const origin = request.headers.get('origin')
    const host = request.headers.get('host')

    if (origin && host) {
      const allowedOrigins = [
        `https://${host}`,
        `http://localhost:3000`,
        `http://127.0.0.1:3000`,
      ]

      const isAllowed = allowedOrigins.some(o => origin.startsWith(o))

      if (!isAllowed) {
        console.warn(`[SECURITY] CSRF attempt - Origin: ${origin}, Host: ${host}, IP: ${ip}`)
        return blockResponse('csrf_mismatch', 403)
      }
    }
  }

  // ── 5. JWT AUTH (rotas admin) ─────────────────────────────────────────
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const token = request.cookies.get(TOKEN_COOKIE)?.value

    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    try {
      const { payload } = await jwtVerify(token, JWT_SECRET)

      if (payload.role !== 'ADMIN' && payload.role !== 'STAFF') {
        return NextResponse.redirect(new URL('/admin/login', request.url))
      }

      const response = NextResponse.next()
      return addSecurityHeaders(response)
    } catch {
      const response = NextResponse.redirect(new URL('/admin/login', request.url))
      response.cookies.delete(TOKEN_COOKIE)
      return response
    }
  }

  // ── 6. RESPOSTA COM HEADERS DE SEGURANÇA ─────────────────────────────
  const response = NextResponse.next()
  return addSecurityHeaders(response)
}

export const config = {
  matcher: [
    // Aplicar middleware em todas as rotas exceto arquivos estáticos e internals do Next.js
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.svg|.*\\.webp|.*\\.ico).*)',
  ],
}

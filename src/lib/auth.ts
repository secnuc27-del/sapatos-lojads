import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import type { JwtPayload } from './types'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret-change-in-production'
)

const TOKEN_COOKIE = 'lumiere_auth'

// ============================================================
// Gera um token JWT assinado
// ============================================================
export async function signToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET)
}

// ============================================================
// Verifica e decodifica um token JWT
// ============================================================
export async function verifyToken(token: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as JwtPayload
  } catch {
    return null
  }
}

// ============================================================
// Lê o token JWT do cookie da requisição
// ============================================================
export async function getTokenFromCookies(): Promise<JwtPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(TOKEN_COOKIE)?.value
  if (!token) return null
  return verifyToken(token)
}

// ============================================================
// Constante do nome do cookie (usada no middleware)
// ============================================================
export { TOKEN_COOKIE }

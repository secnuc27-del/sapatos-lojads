import { NextResponse } from 'next/server'
import { TOKEN_COOKIE } from '@/lib/auth'

// POST /api/auth/logout
export async function POST() {
  const response = NextResponse.json({ message: 'Logout realizado com sucesso' })
  response.cookies.delete(TOKEN_COOKIE)
  return response
}

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getTokenFromCookies } from '@/lib/auth'
import { isValidCUID, hasSQLInjection } from '@/lib/security'

// Campos permitidos para update (allowlist — proteção contra mass assignment)
const ALLOWED_PRODUCT_FIELDS = new Set([
  'name', 'category', 'price', 'oldPrice', 'description',
  'images', 'sizes', 'colors', 'featured', 'promo', 'stock',
])

function sanitizeProductUpdate(body: Record<string, unknown>) {
  const data: Record<string, unknown> = {}

  for (const key of ALLOWED_PRODUCT_FIELDS) {
    if (key in body) {
      const val = body[key]

      // Verificar injeção em strings
      if (typeof val === 'string' && hasSQLInjection(val)) {
        throw new Error(`Campo ${key} contém dados inválidos`)
      }

      if (key === 'price' || key === 'oldPrice') {
        const n = Number(val)
        if (isNaN(n) || n < 0 || n > 1_000_000) continue
        data[key] = n
      } else if (key === 'stock') {
        const n = Number(val)
        if (isNaN(n) || n < 0) continue
        data[key] = Math.floor(n)
      } else if (key === 'featured' || key === 'promo') {
        data[key] = Boolean(val)
      } else if (key === 'images' || key === 'sizes' || key === 'colors') {
        data[key] = Array.isArray(val) ? val.slice(0, 20) : []
      } else {
        data[key] = typeof val === 'string' ? val.trim().slice(0, 2000) : val
      }
    }
  }

  return data
}

// GET /api/products/[id]
export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Validar formato do ID (proteção IDOR e injeção)
    if (!isValidCUID(id)) {
      return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 })
    }

    const product = await prisma.product.findUnique({ where: { id } })
    if (!product) {
      return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 })
    }
    return NextResponse.json({ data: product })
  } catch (error) {
    console.error('[PRODUCT/GET]', error)
    return NextResponse.json({ error: 'Erro ao buscar produto' }, { status: 500 })
  }
}

// PUT /api/products/[id] — apenas ADMIN
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // ── Autenticação ──────────────────────────────────────────────────────
    const payload = await getTokenFromCookies()
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
    }

    // ── Validar ID ────────────────────────────────────────────────────────
    const { id } = params
    if (!isValidCUID(id)) {
      return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 })
    }

    // ── Parsear body ──────────────────────────────────────────────────────
    let body: Record<string, unknown>
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Body inválido' }, { status: 400 })
    }

    // ── Sanitizar (allowlist + validação) ─────────────────────────────────
    let cleanData: Record<string, unknown>
    try {
      cleanData = sanitizeProductUpdate(body)
    } catch (e) {
      return NextResponse.json({ error: String(e) }, { status: 400 })
    }

    if (Object.keys(cleanData).length === 0) {
      return NextResponse.json({ error: 'Nenhum campo válido para atualizar' }, { status: 400 })
    }

    const product = await prisma.product.update({
      where: { id },
      data: cleanData,
    })

    return NextResponse.json({ data: product })
  } catch (error) {
    console.error('[PRODUCT/PUT]', error)
    return NextResponse.json({ error: 'Erro ao atualizar produto' }, { status: 500 })
  }
}

// DELETE /api/products/[id] — apenas ADMIN
export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // ── Autenticação ──────────────────────────────────────────────────────
    const payload = await getTokenFromCookies()
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
    }

    // ── Validar ID ────────────────────────────────────────────────────────
    const { id } = params
    if (!isValidCUID(id)) {
      return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 })
    }

    await prisma.product.delete({ where: { id } })
    return NextResponse.json({ message: 'Produto removido' })
  } catch (error) {
    console.error('[PRODUCT/DELETE]', error)
    return NextResponse.json({ error: 'Erro ao remover produto' }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getTokenFromCookies } from '@/lib/auth'
import { sanitizeOrderBody } from '@/lib/security'

// POST /api/orders — criar pedido (público, mas com validação rigorosa)
export async function POST(request: Request) {
  try {
    // ── Validar Content-Type ────────────────────────────────────────────
    const contentType = request.headers.get('content-type') || ''
    if (!contentType.includes('application/json')) {
      return NextResponse.json({ error: 'Content-Type inválido' }, { status: 415 })
    }

    // ── Parsear body ────────────────────────────────────────────────────
    let body: Record<string, unknown>
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Body inválido' }, { status: 400 })
    }

    // ── Sanitizar e validar dados (proteção contra manipulação de preço) ──
    const sanitized = sanitizeOrderBody(body)
    if (!sanitized.valid || !sanitized.data) {
      return NextResponse.json(
        { error: sanitized.error || 'Dados do pedido inválidos' },
        { status: 400 }
      )
    }

    const { customer, phone, items } = sanitized.data

    // ── Buscar preços reais do banco (nunca confiar no preço do cliente) ──
    const productIds = items.map(i => i.productId)
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, price: true, stock: true, name: true },
    })

    const productMap = new Map(products.map(p => [p.id, p]))

    // Verificar que todos os produtos existem e têm estoque
    for (const item of items) {
      const product = productMap.get(item.productId)
      if (!product) {
        return NextResponse.json(
          { error: `Produto não encontrado` },
          { status: 404 }
        )
      }
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Estoque insuficiente para ${product.name}` },
          { status: 409 }
        )
      }
    }

    // ── Calcular total com preços do BANCO (anti price manipulation) ─────
    const total = items.reduce((sum, item) => {
      const product = productMap.get(item.productId)!
      return sum + product.price * item.quantity
    }, 0)

    // ── Criar pedido em transação atômica ─────────────────────────────────
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          customer,
          phone,
          total,
          items: {
            create: items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              size: item.size,
              color: item.color,
              price: productMap.get(item.productId)!.price, // preço do banco
            })),
          },
        },
        include: { items: true },
      })

      return newOrder
    })

    return NextResponse.json({ data: order }, { status: 201 })
  } catch (error) {
    console.error('[ORDERS/POST]', error)
    return NextResponse.json({ error: 'Erro ao criar pedido' }, { status: 500 })
  }
}

// GET /api/orders — SOMENTE ADMIN (verificação JWT)
export async function GET() {
  try {
    // Verificar autenticação JWT
    const payload = await getTokenFromCookies()

    if (!payload) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    if (payload.role !== 'ADMIN' && payload.role !== 'STAFF') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
    }

    const orders = await prisma.order.findMany({
      include: {
        items: { include: { product: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 500, // Limite de registros para evitar dump completo
    })

    return NextResponse.json({ data: orders })
  } catch (error) {
    console.error('[ORDERS/GET]', error)
    return NextResponse.json({ error: 'Erro ao buscar pedidos' }, { status: 500 })
  }
}

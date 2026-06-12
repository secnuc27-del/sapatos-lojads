import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getTokenFromCookies } from '@/lib/auth'

// GET /api/products
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const promo = searchParams.get('promo')

    const where: Record<string, unknown> = {}
    if (category) where.category = category
    if (featured === 'true') where.featured = true
    if (promo === 'true') where.promo = true

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ data: products })
  } catch (error) {
    console.error('[PRODUCTS/GET]', error)
    return NextResponse.json({ error: 'Erro ao buscar produtos' }, { status: 500 })
  }
}

// POST /api/products — apenas ADMIN
export async function POST(request: Request) {
  try {
    const payload = await getTokenFromCookies()
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
    }

    const body = await request.json()
    const {
      name, category, price, oldPrice, description,
      images, sizes, colors, featured, promo, stock,
    } = body

    if (!name || !category || !price || !description) {
      return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 })
    }

    const product = await prisma.product.create({
      data: {
        name, category, price: Number(price),
        oldPrice: oldPrice ? Number(oldPrice) : null,
        description,
        images: images || [],
        sizes: sizes || [],
        colors: colors || [],
        featured: Boolean(featured),
        promo: Boolean(promo),
        stock: Number(stock) || 0,
      },
    })

    return NextResponse.json({ data: product }, { status: 201 })
  } catch (error) {
    console.error('[PRODUCTS/POST]', error)
    return NextResponse.json({ error: 'Erro ao criar produto' }, { status: 500 })
  }
}

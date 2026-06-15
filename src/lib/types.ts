// ============================================================
// Tipos TypeScript globais da aplicação Lumière
// ============================================================

export interface Product {
  id: string
  name: string
  category: string
  price: number
  oldPrice?: number | null
  description: string
  images: string[]
  sizes: string[]
  colors: string[]
  featured: boolean
  promo: boolean
  stock: number
  createdAt: string
  updatedAt: string
}

export interface CartItem {
  product: Product
  quantity: number
  size?: string
  color?: string
}

export interface User {
  id: string
  email: string
  name: string
  role: 'ADMIN' | 'STAFF'
  createdAt: string
}

export interface Order {
  id: string
  customer: string
  phone?: string
  total: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  items: OrderItem[]
  createdAt: string
}

export interface OrderItem {
  id: string
  productId: string
  quantity: number
  size?: string
  color?: string
  price: number
  product?: Product
}

export interface ApiResponse<T = unknown> {
  data?: T
  error?: string
  message?: string
}

export interface JwtPayload {
  sub: string
  email: string
  role: string
  iat?: number
  exp?: number
}

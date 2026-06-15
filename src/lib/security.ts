/**
 * Validador e sanitizador de inputs — proteção contra SQLi, XSS, IDOR
 * Defende contra: SQLMap, Burp Suite payload injection, scripts maliciosos
 */

const XSS_PATTERNS = [
  /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
  /javascript\s*:/gi,
  /on\w+\s*=/gi,
  /<iframe[\s\S]*?>/gi,
  /<object[\s\S]*?>/gi,
  /<embed[\s\S]*?>/gi,
  /data:\s*text\/html/gi,
  /vbscript\s*:/gi,
  /expression\s*\(/gi,
]

const SQL_PATTERNS = [
  /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|UNION|TRUNCATE)\b)/gi,
  /(--|;|\/\*|\*\/|xp_|sp_)/g,
  /(\bOR\b\s+\d+\s*=\s*\d+)/gi,
  /(\bAND\b\s+\d+\s*=\s*\d+)/gi,
]

const PATH_TRAVERSAL_PATTERNS = [
  /\.\.\//g,
  /\.\.%2[Ff]/g,
  /%252[Ee]/g,
  /\/etc\/passwd/gi,
  /\/proc\/self/gi,
  /\0/g, // null bytes
]

/**
 * Remove padrões XSS de uma string
 */
export function sanitizeString(input: unknown): string {
  if (typeof input !== 'string') return ''

  let clean = input.trim()

  // Limitar tamanho para evitar DoS
  if (clean.length > 10_000) clean = clean.slice(0, 10_000)

  for (const pattern of XSS_PATTERNS) {
    clean = clean.replace(pattern, '')
  }

  // Escapar caracteres HTML perigosos
  clean = clean
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')

  return clean
}

/**
 * Detecta tentativas de injeção SQL
 */
export function hasSQLInjection(input: string): boolean {
  for (const pattern of SQL_PATTERNS) {
    if (pattern.test(input)) return true
  }
  return false
}

/**
 * Detecta path traversal
 */
export function hasPathTraversal(input: string): boolean {
  for (const pattern of PATH_TRAVERSAL_PATTERNS) {
    if (pattern.test(input)) return true
  }
  return false
}

/**
 * Valida e-mail com regex rigorosa
 */
export function isValidEmail(email: string): boolean {
  const re = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/
  return re.test(email) && email.length <= 254
}

/**
 * Valida telefone brasileiro
 */
export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '')
  return cleaned.length >= 10 && cleaned.length <= 11
}

/**
 * Valida se um UUID é válido (proteção contra IDOR por ID malformado)
 */
export function isValidCUID(id: string): boolean {
  return /^c[a-z0-9]{24,}$/.test(id)
}

/**
 * Valida se um valor é número positivo (preço, quantidade)
 */
export function isPositiveNumber(value: unknown): boolean {
  const n = Number(value)
  return !isNaN(n) && isFinite(n) && n > 0
}

/**
 * Sanitiza corpo de pedido — defende contra manipulação de preço e injeção
 */
export function sanitizeOrderBody(body: Record<string, unknown>): {
  valid: boolean
  error?: string
  data?: {
    customer: string
    phone: string
    items: Array<{
      productId: string
      quantity: number
      size?: string
      color?: string
      price: number
    }>
  }
} {
  const customer = typeof body.customer === 'string' ? body.customer.trim() : ''
  const phone = typeof body.phone === 'string' ? body.phone.trim() : ''
  const items = body.items

  if (!customer || customer.length < 2 || customer.length > 200) {
    return { valid: false, error: 'Nome do cliente inválido' }
  }

  if (hasSQLInjection(customer) || hasSQLInjection(phone)) {
    return { valid: false, error: 'Dados inválidos detectados' }
  }

  if (!Array.isArray(items) || items.length === 0 || items.length > 50) {
    return { valid: false, error: 'Itens do pedido inválidos' }
  }

  const sanitizedItems = []
  for (const item of items) {
    if (typeof item !== 'object' || item === null) {
      return { valid: false, error: 'Item inválido' }
    }

    const productId = typeof item.productId === 'string' ? item.productId : ''
    if (!isValidCUID(productId)) {
      return { valid: false, error: 'ID de produto inválido' }
    }

    const quantity = Number(item.quantity)
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 100) {
      return { valid: false, error: 'Quantidade inválida' }
    }

    // Preço DEVE ser buscado do banco, não do cliente
    // Aqui apenas validamos que existe para comparação posterior
    const price = Number(item.price)
    if (!isPositiveNumber(price) || price > 100_000) {
      return { valid: false, error: 'Preço inválido' }
    }

    sanitizedItems.push({
      productId,
      quantity,
      size: typeof item.size === 'string' ? item.size.slice(0, 20) : undefined,
      color: typeof item.color === 'string' ? item.color.slice(0, 50) : undefined,
      price,
    })
  }

  return {
    valid: true,
    data: {
      customer: sanitizeString(customer),
      phone: phone.replace(/\D/g, '').slice(0, 11),
      items: sanitizedItems,
    },
  }
}

/**
 * Rate Limiter in-memory — proteção contra brute force, bots e enumeração
 * Defende contra: Hydra, Burp Intruder, FFUF, Wfuzz, scripts Python/JS
 */

interface RateLimitEntry {
  count: number
  firstRequest: number
  lastRequest: number
  blocked: boolean
  blockUntil: number
}

const store = new Map<string, RateLimitEntry>()

// Limpeza periódica para evitar memory leak
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of store.entries()) {
    if (now - entry.lastRequest > 60 * 60 * 1000) {
      store.delete(key)
    }
  }
}, 10 * 60 * 1000)

export interface RateLimitConfig {
  /** Máximo de requests no período */
  maxRequests: number
  /** Janela de tempo em segundos */
  windowSeconds: number
  /** Tempo de bloqueio em segundos após exceder limite */
  blockSeconds: number
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: number
  blockedUntil?: number
}

/**
 * Verifica se um identificador está dentro do limite de taxa.
 * @param identifier IP, email, ou qualquer chave de identificação
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now()
  const windowMs = config.windowSeconds * 1000
  const blockMs = config.blockSeconds * 1000

  let entry = store.get(identifier)

  // Se bloqueado ainda
  if (entry?.blocked && now < entry.blockUntil) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.blockUntil,
      blockedUntil: entry.blockUntil,
    }
  }

  // Janela expirou → resetar
  if (!entry || now - entry.firstRequest > windowMs) {
    entry = {
      count: 1,
      firstRequest: now,
      lastRequest: now,
      blocked: false,
      blockUntil: 0,
    }
    store.set(identifier, entry)
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetAt: now + windowMs,
    }
  }

  entry.count++
  entry.lastRequest = now

  if (entry.count > config.maxRequests) {
    entry.blocked = true
    entry.blockUntil = now + blockMs
    store.set(identifier, entry)
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.blockUntil,
      blockedUntil: entry.blockUntil,
    }
  }

  store.set(identifier, entry)
  return {
    allowed: true,
    remaining: config.maxRequests - entry.count,
    resetAt: entry.firstRequest + windowMs,
  }
}

/** Configs pré-definidas para diferentes endpoints */
export const RATE_LIMITS = {
  /** Login: máx 5 tentativas / 15 minutos → bloqueia 30 minutos */
  LOGIN: { maxRequests: 5, windowSeconds: 900, blockSeconds: 1800 } as RateLimitConfig,

  /** API geral: máx 60 req / minuto */
  API_GENERAL: { maxRequests: 60, windowSeconds: 60, blockSeconds: 300 } as RateLimitConfig,

  /** Criação de pedido: máx 10 / hora */
  ORDERS: { maxRequests: 10, windowSeconds: 3600, blockSeconds: 3600 } as RateLimitConfig,

  /** Admin write: máx 30 / minuto */
  ADMIN_WRITE: { maxRequests: 30, windowSeconds: 60, blockSeconds: 300 } as RateLimitConfig,
}

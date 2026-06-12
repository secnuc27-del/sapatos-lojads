/**
 * Bot & Scanner Detection — proteção contra Nikto, Nmap, Gobuster, Dirb, Dirbuster,
 * Selenium, Puppeteer, Playwright, curl/wget automatizados e scripts de automação
 */

/** Headers típicos de ferramentas de pentest e bots */
const PENTEST_USER_AGENTS = [
  // Scanners
  'nikto', 'nmap', 'masscan', 'zmap', 'openvas', 'nessus',
  // Web fuzzers
  'gobuster', 'dirb', 'dirbuster', 'ffuf', 'wfuzz', 'feroxbuster',
  // Vulnerability scanners
  'sqlmap', 'havij', 'acunetix', 'burpsuite', 'burp suite', 'zaproxy', 'owasp zap',
  // Automation
  'python-requests', 'python-urllib', 'go-http-client', 'ruby', 'perl',
  'wget', 'curl/', 'httpie', 'axios/',
  // Headless browsers
  'headlesschrome', 'phantomjs', 'slimerjs',
  // Generic bot patterns
  'bot/', 'crawler', 'spider', 'scraper', 'harvest', 'extract',
  // Metasploit / exploit kits
  'metasploit', 'msfpayload', 'payload',
]

/** Paths tipicamente varridos por ferramentas de enumeração */
const HONEYPOT_PATHS = new Set([
  '/.env', '/.env.local', '/.env.production', '/.env.backup',
  '/wp-admin', '/wp-login.php', '/wp-config.php', '/xmlrpc.php',
  '/admin.php', '/phpmyadmin', '/phpinfo.php', '/info.php',
  '/.git/config', '/.git/HEAD', '/.svn/entries',
  '/config.php', '/config.yml', '/config.yaml', '/config.json',
  '/backup', '/backup.zip', '/backup.tar.gz', '/db.sql',
  '/shell.php', '/c99.php', '/r57.php', '/webshell.php',
  '/etc/passwd', '/etc/shadow', '/proc/self/environ',
  '/server-status', '/server-info', '/_profiler', '/actuator',
  '/api/swagger', '/api/swagger-ui', '/v1/swagger', '/swagger.json',
  '/api-docs', '/.well-known/security.txt',
  '/robots.txt', '/sitemap.xml', // Vamos servir versões controladas
])

export interface BotCheckResult {
  isBot: boolean
  reason?: string
  isHoneypot?: boolean
}

/**
 * Analisa request para detectar bots, scanners e pentest tools
 */
export function detectBotOrScanner(
  userAgent: string | null,
  pathname: string,
  headers: Headers
): BotCheckResult {
  const ua = (userAgent || '').toLowerCase()

  // Sem User-Agent é muito suspeito (curl sem -A, scripts básicos)
  if (!userAgent || ua.length < 5) {
    return { isBot: true, reason: 'missing_ua' }
  }

  // Verificar User-Agent contra lista negra
  for (const bad of PENTEST_USER_AGENTS) {
    if (ua.includes(bad)) {
      return { isBot: true, reason: `blocked_ua:${bad}` }
    }
  }

  // Detectar headless Chromium (Selenium, Puppeteer, Playwright)
  const isHeadless =
    ua.includes('headlesschrome') ||
    ua.includes('phantomjs') ||
    (ua.includes('chrome') && !headers.get('accept-language')) ||
    (ua.includes('chrome') && !headers.get('accept-encoding'))

  if (isHeadless) {
    return { isBot: true, reason: 'headless_browser' }
  }

  // Verificar se é path de honeypot
  if (HONEYPOT_PATHS.has(pathname)) {
    return { isBot: true, reason: 'honeypot_access', isHoneypot: true }
  }

  // Verificar extensões suspeitas em paths (enumeração de arquivos)
  const suspiciousExtensions = ['.php', '.asp', '.aspx', '.jsp', '.cgi', '.pl', '.rb', '.py']
  for (const ext of suspiciousExtensions) {
    if (pathname.endsWith(ext)) {
      return { isBot: true, reason: `suspicious_extension:${ext}`, isHoneypot: true }
    }
  }

  return { isBot: false }
}

/**
 * Gera um nonce criptográfico para CSP (Content Security Policy)
 */
export function generateNonce(): string {
  const array = new Uint8Array(16)
  crypto.getRandomValues(array)
  return Buffer.from(array).toString('base64')
}

/**
 * Verifica se o Origin é permitido (proteção CSRF)
 */
export function isAllowedOrigin(origin: string | null, host: string | null): boolean {
  if (!origin || !host) return false

  // Em desenvolvimento, permitir localhost
  const allowedOrigins = [
    `https://${host}`,
    `http://localhost:3000`,
    `http://127.0.0.1:3000`,
  ]

  return allowedOrigins.some(allowed => origin.startsWith(allowed))
}

/**
 * Máscara de dados sensíveis para logs (LGPD/GDPR compliance)
 */
export function maskSensitiveData(data: Record<string, unknown>): Record<string, unknown> {
  const sensitiveKeys = ['password', 'senha', 'token', 'secret', 'key', 'card', 'cvv', 'cpf']
  const masked = { ...data }

  for (const key of Object.keys(masked)) {
    if (sensitiveKeys.some(s => key.toLowerCase().includes(s))) {
      masked[key] = '[REDACTED]'
    }
  }

  return masked
}

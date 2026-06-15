/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
    // Desabilitar carregamento de domínios não listados
    dangerouslyAllowSVG: false,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Ocultar header X-Powered-By
  poweredByHeader: false,

  // Compressão ativa
  compress: true,

  async headers() {
    return [
      {
        // Headers de segurança em TODAS as rotas
        source: '/(.*)',
        headers: [
          // HSTS — forçar HTTPS por 2 anos
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          // Anti-Clickjacking
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          // Anti-MIME sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // XSS Protection (modo legado)
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // Referrer Policy
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Permissions Policy — desabilitar APIs sensíveis
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), bluetooth=(), serial=()',
          },
          // CSP — Content Security Policy
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline'", // necessário para Next.js hydration
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com data:",
              "img-src 'self' https://images.unsplash.com data: blob:",
              "connect-src 'self'",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "object-src 'none'",
              "media-src 'none'",
              "upgrade-insecure-requests",
            ].join('; '),
          },
          // Cross-Origin Embedder/Opener/Resource Policy
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'same-origin',
          },
        ],
      },
      {
        // Headers específicos para a API — sem cache de dados sensíveis
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
          {
            key: 'Surrogate-Control',
            value: 'no-store',
          },
        ],
      },
      {
        // Headers para área admin — cache totalmente desabilitado
        source: '/admin/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, private',
          },
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow, noarchive',
          },
        ],
      },
    ]
  },

  // Redirects de segurança
  async redirects() {
    return [
      // Redirecionar tentativas de acessar arquivos sensíveis comuns
      {
        source: '/.env',
        destination: '/404',
        permanent: false,
      },
      {
        source: '/wp-admin',
        destination: '/404',
        permanent: false,
      },
      {
        source: '/wp-login.php',
        destination: '/404',
        permanent: false,
      },
    ]
  },
}

export default nextConfig

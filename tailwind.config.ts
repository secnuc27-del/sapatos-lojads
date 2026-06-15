import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        bg2: 'var(--bg2)',
        bg3: 'var(--bg3)',
        card: 'var(--card)',
        border: 'var(--border)',
        border2: 'var(--border2)',
        fg: 'var(--fg)',
        muted: 'var(--muted)',
        gold: 'var(--gold)',
        gold2: 'var(--gold2)',
        green: '#25D366',
        red: '#e05252',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['"Cormorant Garamond"', 'serif'],
        black: ['"Bebas Neue"', 'cursive'],
      },
      boxShadow: {
        gold: '0 0 40px rgba(201,168,76,0.3)',
        green: '0 8px 32px rgba(37,211,102,0.45)',
        card: '0 8px 40px rgba(0,0,0,0.6)',
      },
      animation: {
        shimmer: 'shimmer 3s linear infinite',
        'pulse-dot': 'pulse-dot 2s ease-in-out infinite',
        float1: 'float1 4s ease-in-out infinite',
        float2: 'float2 4s ease-in-out infinite 1s',
        'wa-pulse': 'wa-pulse 2.5s ease-in-out infinite',
        'slide-in': 'slideIn 0.3s ease',
        'slide-down': 'slideDown 0.3s ease',
        marquee: 'marquee 18s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
        'pulse-dot': {
          '0%,100%': { boxShadow: '0 0 0 0 rgba(201,168,76,0.4)' },
          '50%': { boxShadow: '0 0 0 6px rgba(201,168,76,0)' },
        },
        float1: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        float2: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(10px)' },
        },
        'wa-pulse': {
          '0%,100%': { boxShadow: '0 8px 32px rgba(37,211,102,0.45)' },
          '50%': { boxShadow: '0 8px 48px rgba(37,211,102,0.75)' },
        },
        slideIn: {
          from: { opacity: '0', transform: 'translateX(20px)' },
          to: { opacity: '1', transform: 'none' },
        },
        slideDown: {
          from: { opacity: '0', transform: 'translateY(-10px)' },
          to: { opacity: '1', transform: 'none' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}

export default config

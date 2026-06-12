'use client'

import { useEffect } from 'react'

/**
 * Componente cliente que aplica proteções anti-inspeção:
 * - Bloqueia F12, Ctrl+U, Ctrl+S, Ctrl+Shift+I/J/C/K/E, Ctrl+A, Ctrl+P
 * - Bloqueia botão direito (contextmenu)
 * - Bloqueia seleção de texto (exceto inputs)
 * - Bloqueia drag
 * - Detecta abertura do DevTools por tamanho de janela
 */
export default function AntiInspect() {
  useEffect(() => {
    // ── 1. Bloquear botão direito ────────────────────────────────────────
    const blockContext = (e: MouseEvent) => {
      e.preventDefault()
      return false
    }

    // ── 2. Bloquear atalhos de DevTools ─────────────────────────────────
    const blockKeys = (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey
      const shift = e.shiftKey
      const key = e.key

      const blocked =
        key === 'F12' ||
        (ctrl && key === 'u') ||
        (ctrl && key === 's') ||
        (ctrl && key === 'p') ||
        (ctrl && key === 'a') ||
        (ctrl && shift && key === 'I') ||
        (ctrl && shift && key === 'J') ||
        (ctrl && shift && key === 'C') ||
        (ctrl && shift && key === 'K') || // Firefox console
        (ctrl && shift && key === 'E')    // Firefox network

      if (blocked) {
        e.preventDefault()
        e.stopPropagation()
        return false
      }
    }

    // ── 3. Bloquear seleção de texto ─────────────────────────────────────
    const blockSelect = (e: Event) => {
      const target = e.target as HTMLElement
      const tag = target?.tagName
      if (tag !== 'INPUT' && tag !== 'TEXTAREA') {
        e.preventDefault()
        return false
      }
    }

    // ── 4. Bloquear drag ─────────────────────────────────────────────────
    const blockDrag = (e: DragEvent) => {
      e.preventDefault()
      return false
    }

    // ── 5. Detectar DevTools por tamanho de janela ───────────────────────
    let devOpen = false
    const threshold = 160

    const detectDevTools = setInterval(() => {
      const widthDiff = window.outerWidth - window.innerWidth
      const heightDiff = window.outerHeight - window.innerHeight

      if (widthDiff > threshold || heightDiff > threshold) {
        if (!devOpen) {
          devOpen = true
          document.body.innerHTML = `
            <div style="
              display:flex;align-items:center;justify-content:center;
              height:100vh;background:#08070a;color:#c9a96e;
              font-family:Inter,sans-serif;flex-direction:column;gap:16px;
            ">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="1.5">
                <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              </svg>
              <h1 style="font-size:1.5rem;margin:0">Acesso Restrito</h1>
              <p style="color:#888;margin:0">Esta página não pode ser inspecionada.</p>
            </div>
          `
        }
      } else {
        devOpen = false
      }
    }, 500)

    // Registrar todos os event listeners
    document.addEventListener('contextmenu', blockContext)
    document.addEventListener('keydown', blockKeys, true) // capture
    document.addEventListener('selectstart', blockSelect)
    document.addEventListener('dragstart', blockDrag)

    // Cleanup ao desmontar
    return () => {
      document.removeEventListener('contextmenu', blockContext)
      document.removeEventListener('keydown', blockKeys, true)
      document.removeEventListener('selectstart', blockSelect)
      document.removeEventListener('dragstart', blockDrag)
      clearInterval(detectDevTools)
    }
  }, [])

  return null // Componente invisível — apenas efeitos colaterais
}

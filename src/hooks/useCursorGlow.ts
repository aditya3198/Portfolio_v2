import { useEffect } from 'react'

// Proximity radius (px) outside card edges where the glow starts fading in
const RADIUS = 130

export function useCursorGlow() {
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const cards = document.querySelectorAll<HTMLElement>('[data-glow]')
      for (const card of cards) {
        const r = card.getBoundingClientRect()

        // Cursor as % within the card — can be outside 0-100 range
        const mx = ((e.clientX - r.left) / r.width) * 100
        const my = ((e.clientY - r.top) / r.height) * 100

        // Distance from cursor to nearest point on card edge (0 = inside or touching)
        const dx = Math.max(0, r.left - e.clientX, e.clientX - r.right)
        const dy = Math.max(0, r.top  - e.clientY, e.clientY - r.bottom)
        const dist = 1 - Math.min(1, Math.hypot(dx, dy) / RADIUS)

        card.style.setProperty('--mx',   `${mx.toFixed(1)}%`)
        card.style.setProperty('--my',   `${my.toFixed(1)}%`)
        card.style.setProperty('--dist', dist.toFixed(3))
      }
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])
}

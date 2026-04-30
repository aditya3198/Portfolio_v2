import { useEffect } from 'react'
import { cometTrail, overLink, recordCometMove, setOverLink } from './cometStore'

const TRAIL_LIFE   = 540   // ms a trail point lives
const HEAD_R       = 13    // nucleus glow radius
const TAIL_W_MAX   = 5.5   // trail stroke width at head
const TAIL_W_MIN   = 0.3

function drawSpike4(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  len: number, width: number,
  alpha: number,
) {
  for (let i = 0; i < 4; i++) {
    const angle = (i * Math.PI) / 2
    const ex = x + Math.cos(angle) * len
    const ey = y + Math.sin(angle) * len
    const g = ctx.createLinearGradient(x, y, ex, ey)
    g.addColorStop(0, `rgba(255,255,255,${alpha.toFixed(3)})`)
    g.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.save()
    ctx.strokeStyle = g
    ctx.lineWidth   = width
    ctx.lineCap     = 'round'
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(ex, ey); ctx.stroke()
    ctx.restore()
  }
}

export function useCometTrail() {
  useEffect(() => {
    // Touch/stylus devices: no mouse cursor, skip the whole effect
    if (window.matchMedia('(pointer: coarse)').matches) return

    // ── canvas overlay ─────────────────────────────────────────────────────────
    const canvas = document.createElement('canvas')
    Object.assign(canvas.style, {
      position:      'fixed',
      top:           '0',
      left:          '0',
      width:         '100vw',
      height:        '100vh',
      pointerEvents: 'none',
      zIndex:        '9998',
    })
    document.body.appendChild(canvas)

    const dpr = window.devicePixelRatio || 1
    let W = window.innerWidth
    let H = window.innerHeight

    const setSize = () => {
      W = window.innerWidth
      H = window.innerHeight
      canvas.width  = W * dpr
      canvas.height = H * dpr
      canvas.style.width  = `${W}px`
      canvas.style.height = `${H}px`
      canvas.getContext('2d')!.scale(dpr, dpr)
    }
    setSize()

    // ── state ──────────────────────────────────────────────────────────────────
    let raf: number
    let lastX = -9999, lastY = -9999
    let curX = -200, curY = -200   // raw cursor position, updated every mousemove
    let hasMoved = false

    const onMove = (e: MouseEvent) => {
      curX = e.clientX; curY = e.clientY
      hasMoved = true
      setOverLink(!!(e.target as Element)?.closest('a, button, [role="button"]'))
      // Only push to trail when cursor actually moves (avoids fill-up while still)
      if (Math.hypot(e.clientX - lastX, e.clientY - lastY) > 2) {
        recordCometMove(e.clientX, e.clientY)
        lastX = e.clientX; lastY = e.clientY
      }
    }

    // ── draw ───────────────────────────────────────────────────────────────────
    const draw = () => {
      const ctx = canvas.getContext('2d')!
      const now = Date.now()
      ctx.clearRect(0, 0, W, H)

      if (!hasMoved) { raf = requestAnimationFrame(draw); return }

      const live = cometTrail.filter(p => now - p.t < TRAIL_LIFE)

      // Nucleus position: head of trail if trail exists, otherwise raw cursor
      const headX = live.length ? live[live.length - 1].x : curX
      const headY = live.length ? live[live.length - 1].y : curY
      const head  = { x: headX, y: headY }

      // ── outer soft halo along tail ─────────────────────────────────────────
      ctx.save()
      ctx.lineCap = 'round'; ctx.lineJoin = 'round'
      for (let i = 1; i < live.length; i++) {
        const p0 = live[i - 1], p1 = live[i]
        const a1 = 1 - (now - p1.t) / TRAIL_LIFE
        const a0 = 1 - (now - p0.t) / TRAIL_LIFE
        const avg = (a0 + a1) / 2
        ctx.beginPath()
        ctx.moveTo(p0.x, p0.y); ctx.lineTo(p1.x, p1.y)
        ctx.strokeStyle = `rgba(80,220,255,${(avg * 0.07).toFixed(3)})`
        ctx.lineWidth = TAIL_W_MAX * a1 * 6
        ctx.stroke()
      }

      // ── main trail — width + opacity taper head→tail ───────────────────────
      for (let i = 1; i < live.length; i++) {
        const p0 = live[i - 1], p1 = live[i]
        const a1 = 1 - (now - p1.t) / TRAIL_LIFE
        const a0 = 1 - (now - p0.t) / TRAIL_LIFE
        const avg = (a0 + a1) / 2
        const g = ctx.createLinearGradient(p0.x, p0.y, p1.x, p1.y)
        g.addColorStop(0, `rgba(170,240,255,${(a0 * 0.55).toFixed(3)})`)
        g.addColorStop(1, `rgba(230,255,255,${(a1 * 0.90).toFixed(3)})`)
        ctx.beginPath()
        ctx.moveTo(p0.x, p0.y); ctx.lineTo(p1.x, p1.y)
        ctx.strokeStyle = g
        ctx.lineWidth = Math.max(TAIL_W_MIN, TAIL_W_MAX * avg)
        ctx.stroke()
      }
      ctx.restore()

      // ── sparkle fragments along trail ──────────────────────────────────────
      for (let i = 0; i < live.length; i += 5) {
        const p   = live[i]
        const age = 1 - (now - p.t) / TRAIL_LIFE
        if (age < 0.08) continue
        const r = Math.max(0.3, 1.4 * age)
        ctx.fillStyle = `rgba(255,255,255,${(age * 0.55).toFixed(3)})`
        ctx.beginPath()
        ctx.arc(p.x + p.jx * age, p.y + p.jy * age, r, 0, Math.PI * 2)
        ctx.fill()
      }

      // ── nucleus ────────────────────────────────────────────────────────────
      if (overLink) {
        // ── link-hover state: cyan ring + cyan core ──────────────────────────
        // pulsing ring
        ctx.save()
        ctx.strokeStyle = 'rgba(34,211,238,0.7)'
        ctx.lineWidth   = 1.5
        ctx.beginPath(); ctx.arc(head.x, head.y, HEAD_R * 2.4, 0, Math.PI * 2); ctx.stroke()
        ctx.restore()

        // cyan coma
        const comaCyan = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, HEAD_R * 3.2)
        comaCyan.addColorStop(0,    'rgba(34,211,238,0.28)')
        comaCyan.addColorStop(0.45, 'rgba(34,211,238,0.08)')
        comaCyan.addColorStop(1,    'rgba(0,0,0,0)')
        ctx.fillStyle = comaCyan
        ctx.beginPath(); ctx.arc(head.x, head.y, HEAD_R * 3.2, 0, Math.PI * 2); ctx.fill()

        // cyan core
        const coreCyan = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, HEAD_R)
        coreCyan.addColorStop(0,    'rgba(180,248,255,0.97)')
        coreCyan.addColorStop(0.28, 'rgba(34,211,238,0.85)')
        coreCyan.addColorStop(0.65, 'rgba(34,211,238,0.30)')
        coreCyan.addColorStop(1,    'rgba(0,0,0,0)')
        ctx.fillStyle = coreCyan
        ctx.beginPath(); ctx.arc(head.x, head.y, HEAD_R, 0, Math.PI * 2); ctx.fill()
      } else {
        // ── default state: white nucleus ─────────────────────────────────────
        drawSpike4(ctx, head.x, head.y, HEAD_R * 2.4, 1.1, 0.75)

        const coma = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, HEAD_R * 3.2)
        coma.addColorStop(0,   'rgba(120,235,255,0.30)')
        coma.addColorStop(0.45,'rgba(60,200,240,0.10)')
        coma.addColorStop(1,   'rgba(0,0,0,0)')
        ctx.fillStyle = coma
        ctx.beginPath(); ctx.arc(head.x, head.y, HEAD_R * 3.2, 0, Math.PI * 2); ctx.fill()

        const core = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, HEAD_R)
        core.addColorStop(0,   'rgba(255,255,255,0.97)')
        core.addColorStop(0.28,'rgba(200,248,255,0.80)')
        core.addColorStop(0.65,'rgba(80,210,255,0.32)')
        core.addColorStop(1,   'rgba(0,0,0,0)')
        ctx.fillStyle = core
        ctx.beginPath(); ctx.arc(head.x, head.y, HEAD_R, 0, Math.PI * 2); ctx.fill()
      }

      raf = requestAnimationFrame(draw)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('resize',    setSize)
    raf = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize',    setSize)
      cancelAnimationFrame(raf)
      document.body.removeChild(canvas)
    }
  }, [])
}

import { useEffect, useRef } from 'react'
import { cometTrail } from '../../hooks/cometStore'

// ─── Types ────────────────────────────────────────────────────────────────────

type RGB = [number, number, number]

interface Star {
  x: number; y: number; size: number; baseOp: number
  r: number; g: number; b: number
}

interface LightSource { x: number; y: number; weight: number }

// ─── Stars ────────────────────────────────────────────────────────────────────

function pickStarColor(): RGB {
  const roll = Math.random()
  if (roll < 0.60) return [185 + Math.floor(Math.random() * 55), 210 + Math.floor(Math.random() * 45), 255]
  if (roll < 0.80) return [255, 255, 255]
  if (roll < 0.93) return [255, 215 + Math.floor(Math.random() * 30), 150 + Math.floor(Math.random() * 55)]
  return              [255, 150 + Math.floor(Math.random() * 50), 100 + Math.floor(Math.random() * 60)]
}

function makeStars(count: number, sizeMin: number, sizeMax: number, opMin: number, opMax: number): Star[] {
  const w = Math.ceil(window.innerWidth  * 1.15)
  const h = Math.ceil(window.innerHeight * 1.15)
  return Array.from({ length: count }, () => {
    const [r, g, b] = pickStarColor()
    return {
      x: Math.random() * w, y: Math.random() * h,
      size:   Math.random() * (sizeMax - sizeMin) + sizeMin,
      baseOp: Math.random() * (opMax   - opMin)   + opMin,
      r, g, b,
    }
  }).sort((a, b) => a.size - b.size)
}

function drawSpike(ctx: CanvasRenderingContext2D, x: number, y: number, len: number, w: number, r: number, g: number, b: number, op: number) {
  for (let i = 0; i < 4; i++) {
    const a = (i * Math.PI) / 2
    const ex = x + Math.cos(a) * len, ey = y + Math.sin(a) * len
    const grd = ctx.createLinearGradient(x, y, ex, ey)
    grd.addColorStop(0, `rgba(${r},${g},${b},${op.toFixed(3)})`)
    grd.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.save(); ctx.strokeStyle = grd; ctx.lineWidth = w; ctx.lineCap = 'round'
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(ex, ey); ctx.stroke()
    ctx.restore()
  }
}

const PROX_R    = 210
const MAX_BOOST = 1.16

function paintStars(
  ctx: CanvasRenderingContext2D,
  W: number, H: number,
  stars: Star[],
  cx: number, cy: number,
  wake: LightSource[] = [],
) {
  ctx.clearRect(0, 0, W, H)
  for (const s of stars) {
    // Cursor proximity
    const dist = Math.sqrt((s.x - cx) ** 2 + (s.y - cy) ** 2)
    let prox = Math.max(0, 1 - dist / PROX_R)
    // Comet wake — stars along the trail path stay lit longer
    for (const src of wake) {
      const d = Math.sqrt((s.x - src.x) ** 2 + (s.y - src.y) ** 2)
      prox = Math.max(prox, Math.max(0, 1 - d / PROX_R) * src.weight)
    }
    const op = Math.min(1, s.baseOp + prox * MAX_BOOST)
    const { x, y, size, r, g, b } = s

    if (size > 1.0) {
      const gr = size * 7
      const glow = ctx.createRadialGradient(x, y, 0, x, y, gr)
      glow.addColorStop(0,   `rgba(${r},${g},${b},${(op * 0.38).toFixed(3)})`)
      glow.addColorStop(0.5, `rgba(${r},${g},${b},${(op * 0.10).toFixed(3)})`)
      glow.addColorStop(1,   'rgba(0,0,0,0)')
      ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(x, y, gr, 0, Math.PI * 2); ctx.fill()
    }

    const cr = Math.max(size, 0.5) * 1.5
    const core = ctx.createRadialGradient(x, y, 0, x, y, cr)
    core.addColorStop(0,   `rgba(255,255,255,${op.toFixed(3)})`)
    core.addColorStop(0.4, `rgba(${r},${g},${b},${(op * 0.9).toFixed(3)})`)
    core.addColorStop(1,   'rgba(0,0,0,0)')
    ctx.fillStyle = core; ctx.beginPath(); ctx.arc(x, y, cr, 0, Math.PI * 2); ctx.fill()

    if (size > 2.0 && op > 0.60) drawSpike(ctx, x, y, size * 15, size * 0.38, r, g, b, op * 0.78)
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export function HeroBackground() {
  const bgRef = useRef<HTMLDivElement>(null)
  const c1    = useRef<HTMLCanvasElement>(null)
  const c2    = useRef<HTMLCanvasElement>(null)
  const c3    = useRef<HTMLCanvasElement>(null)

  const s1 = useRef<Star[]>([])
  const s2 = useRef<Star[]>([])
  const s3 = useRef<Star[]>([])

  useEffect(() => {
    s1.current = makeStars(620, 0.4, 1.6, 0.06, 0.22)
    s2.current = makeStars(220, 1.2, 2.8, 0.09, 0.28)
    s3.current = makeStars( 80, 2.2, 5.0, 0.12, 0.32)

    const dpr = window.devicePixelRatio || 1
    const W = Math.ceil(window.innerWidth  * 1.15)
    const H = Math.ceil(window.innerHeight * 1.15)
    for (const ref of [c1, c2, c3]) {
      if (!ref.current) continue
      ref.current.width  = W * dpr
      ref.current.height = H * dpr
      ref.current.style.width  = `${W}px`
      ref.current.style.height = `${H}px`
      ref.current.getContext('2d')!.scale(dpr, dpr)
    }
  }, [])

  useEffect(() => {
    const bg = bgRef.current
    if (!bg) return

    const W = Math.ceil(window.innerWidth  * 1.15)
    const H = Math.ceil(window.innerHeight * 1.15)
    const cx = W / 2, cy = H / 2

    // Touch devices: one static paint, no cursor tracking, no RAF loop
    if (window.matchMedia('(pointer: coarse)').matches) {
      if (c1.current) paintStars(c1.current.getContext('2d')!, W, H, s1.current, cx, cy)
      if (c2.current) paintStars(c2.current.getContext('2d')!, W, H, s2.current, cx, cy)
      if (c3.current) paintStars(c3.current.getContext('2d')!, W, H, s3.current, cx, cy)
      return
    }

    let tx = 0, ty = 0, parX = 0, parY = 0
    let rawX = window.innerWidth / 2, rawY = window.innerHeight / 2
    let smX = rawX, smY = rawY
    let raf: number
    const LERP = 0.055
    const lerp  = (a: number, b: number, t: number) => a + (b - a) * t

    const tick = () => {
      parX = lerp(parX, tx, LERP)
      parY = lerp(parY, ty, LERP)
      smX  = lerp(smX, rawX, LERP)
      smY  = lerp(smY, rawY, LERP)

      if (c1.current) c1.current.style.transform = `translate(${parX * 0.18}px, ${parY * 0.18}px)`
      if (c2.current) c2.current.style.transform = `translate(${parX * 0.50}px, ${parY * 0.50}px)`
      if (c3.current) c3.current.style.transform = `translate(${parX * 0.92}px, ${parY * 0.92}px)`

      const cur1X = smX - parX * 0.18, cur1Y = smY - parY * 0.18
      const cur2X = smX - parX * 0.50, cur2Y = smY - parY * 0.50
      const cur3X = smX - parX * 0.92, cur3Y = smY - parY * 0.92

      // Build comet wake sources (sample every 3rd trail point for performance)
      const now     = Date.now()
      const WAKE_MS = 460
      const rawWake = cometTrail.filter((p, i) => i % 3 === 0 && now - p.t < WAKE_MS)
      const mkWake  = (off: number): LightSource[] =>
        rawWake.map(p => ({
          x:      p.x - parX * off,
          y:      p.y - parY * off,
          weight: Math.max(0, 1 - (now - p.t) / WAKE_MS) * 0.72,
        }))

      if (c1.current) paintStars(c1.current.getContext('2d')!, W, H, s1.current, cur1X, cur1Y, mkWake(0.18))
      if (c2.current) paintStars(c2.current.getContext('2d')!, W, H, s2.current, cur2X, cur2Y, mkWake(0.50))
      if (c3.current) paintStars(c3.current.getContext('2d')!, W, H, s3.current, cur3X, cur3Y, mkWake(0.92))

      raf = requestAnimationFrame(tick)
    }

    const onMove = (e: MouseEvent) => {
      const normX = (e.clientX / window.innerWidth  - 0.5) * 2
      const normY = (e.clientY / window.innerHeight - 0.5) * 2
      tx = normX * 28; ty = normY * 18
      rawX = e.clientX; rawY = e.clientY
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    raf = requestAnimationFrame(tick)
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf) }
  }, [])

  return (
    <div className="hero-bg" ref={bgRef} aria-hidden>
      <div className="hero-bg__nebula hero-bg__nebula--cyan" />
      <div className="hero-bg__nebula hero-bg__nebula--purple" />
      <div className="hero-bg__nebula hero-bg__nebula--green" />
      <canvas className="hero-bg__canvas hero-bg__canvas--far"  ref={c1} />
      <canvas className="hero-bg__canvas hero-bg__canvas--mid"  ref={c2} />
      <canvas className="hero-bg__canvas hero-bg__canvas--near" ref={c3} />
      <div className="hero-bg__shoot" />
      <div className="hero-bg__shoot hero-bg__shoot--b" />
      <div className="hero-bg__vignette" />
    </div>
  )
}

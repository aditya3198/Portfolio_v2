export interface TrailPoint {
  x: number
  y: number
  t: number
  jx: number  // pre-baked sparkle jitter so it doesn't flicker per-frame
  jy: number
}

export const cometTrail: TrailPoint[] = []

export let overLink = false
export function setOverLink(v: boolean) { overLink = v }

export function recordCometMove(x: number, y: number) {
  const t = Date.now()
  cometTrail.push({
    x, y, t,
    jx: (Math.random() - 0.5) * 16,
    jy: (Math.random() - 0.5) * 16,
  })
  if (cometTrail.length > 90) cometTrail.shift()
}

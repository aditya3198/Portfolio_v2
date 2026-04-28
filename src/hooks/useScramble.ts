import { useCallback, useRef, useState } from 'react'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*'
const DURATION = 420

export function useScramble(text: string) {
  const [display, setDisplay] = useState(text)
  const frameRef = useRef<number>(0)

  const scramble = useCallback(() => {
    cancelAnimationFrame(frameRef.current)
    const start = performance.now()

    const tick = (now: number) => {
      const progress = Math.min((now - start) / DURATION, 1)
      const resolved = Math.floor(progress * text.length)

      setDisplay(
        text
          .split('')
          .map((char, i) => {
            if (char === ' ' || char === '·') return char
            if (i < resolved) return char
            return CHARS[Math.floor(Math.random() * CHARS.length)]
          })
          .join(''),
      )

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick)
      }
    }

    frameRef.current = requestAnimationFrame(tick)
  }, [text])

  const reset = useCallback(() => {
    cancelAnimationFrame(frameRef.current)
    setDisplay(text)
  }, [text])

  return { display, scramble, reset }
}

import { useEffect, useRef, useState } from 'react'

export function useTyped(words: string[], active: boolean = true) {
  const [display, setDisplay] = useState('')
  const state = useRef({ wi: 0, ci: 0, deleting: false })
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    if (!active || words.length === 0) return

    function tick() {
      const { wi, ci, deleting } = state.current
      const word = words[wi]
      if (!deleting) {
        setDisplay(word.slice(0, ci + 1))
        if (ci + 1 >= word.length) {
          state.current = { wi, ci: ci + 1, deleting: true }
          timer.current = setTimeout(tick, 1800)
        } else {
          state.current = { wi, ci: ci + 1, deleting: false }
          timer.current = setTimeout(tick, 85)
        }
      } else {
        if (ci <= 0) {
          state.current = { wi: (wi + 1) % words.length, ci: 0, deleting: false }
          timer.current = setTimeout(tick, 380)
        } else {
          state.current = { wi, ci: ci - 1, deleting: true }
          setDisplay(word.slice(0, ci - 1))
          timer.current = setTimeout(tick, 38)
        }
      }
    }

    timer.current = setTimeout(tick, 400)
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [active, words])

  return display
}

import { useEffect } from 'react'
import Lenis from '@studio-freight/lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })

    lenis.on('scroll', ScrollTrigger.update)

    const rafUpdate = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(rafUpdate)
    gsap.ticker.lagSmoothing(0)

    // Intercept all anchor clicks so Lenis drives the scroll instead of the browser
    const onAnchorClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null
      if (!anchor) return
      const href = anchor.getAttribute('href')
      if (!href || href === '#') return
      e.preventDefault()

      // Sections with cinematic reveals need extra offset to land past the
      // reveal phase so content is already visible on arrival.
      const revealSections = ['#skills', '#experience', '#projects']
      const revealOffset = window.innerHeight * 0.9

      const offset = revealSections.includes(href)
        ? revealOffset - 60
        : -60

      lenis.scrollTo(href, { duration: 1.4, offset })
    }

    // Allow any component to trigger a Lenis scroll with the correct reveal offset
    const onLenisScrollTo = (e: Event) => {
      const { target } = (e as CustomEvent<{ target: string }>).detail
      const revealSections = ['#skills', '#experience', '#projects']
      const offset = revealSections.includes(target) ? window.innerHeight * 0.9 - 60 : -60
      lenis.scrollTo(target, { duration: 1.4, offset })
    }

    document.addEventListener('click', onAnchorClick)
    document.addEventListener('lenis:scrollTo', onLenisScrollTo)

    return () => {
      document.removeEventListener('click', onAnchorClick)
      document.removeEventListener('lenis:scrollTo', onLenisScrollTo)
      gsap.ticker.remove(rafUpdate)
      lenis.destroy()
    }
  }, [])
}

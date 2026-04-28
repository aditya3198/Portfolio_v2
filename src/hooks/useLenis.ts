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
    // Allow nav transition overlay to take over by calling e.preventDefault() first
    // Per-section scroll offsets. Skills pins for +=380% so 90% through = 3.42×vh.
    // Experience/Projects use dynamic totalScroll() so keep a generous vh offset.
    const sectionOffset = (href: string) => {
      if (href === '#skills') return window.innerHeight * 0.9 * 3.8
      if (href === '#experience' || href === '#projects') return window.innerHeight * 0.9 - 60
      return -60
    }

    const onLenisScrollToInstant = (e: Event) => {
      const { target } = (e as CustomEvent<{ target: string }>).detail
      lenis.scrollTo(target, { immediate: true, offset: sectionOffset(target) })
    }

    const onAnchorClick = (e: MouseEvent) => {
      if (e.defaultPrevented) return
      const anchor = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null
      if (!anchor) return
      const href = anchor.getAttribute('href')
      if (!href || href === '#') return
      e.preventDefault()
      lenis.scrollTo(href, { duration: 1.4, offset: sectionOffset(href) })
    }

    // Allow any component to trigger a Lenis scroll with the correct reveal offset
    const onLenisScrollTo = (e: Event) => {
      const { target } = (e as CustomEvent<{ target: string }>).detail
      lenis.scrollTo(target, { duration: 1.4, offset: sectionOffset(target) })
    }

    document.addEventListener('click', onAnchorClick)
    document.addEventListener('lenis:scrollTo', onLenisScrollTo)
    document.addEventListener('lenis:scrollToInstant', onLenisScrollToInstant)

    return () => {
      document.removeEventListener('click', onAnchorClick)
      document.removeEventListener('lenis:scrollTo', onLenisScrollTo)
      document.removeEventListener('lenis:scrollToInstant', onLenisScrollToInstant)
      gsap.ticker.remove(rafUpdate)
      lenis.destroy()
    }
  }, [])
}

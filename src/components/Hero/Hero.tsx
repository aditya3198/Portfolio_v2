import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { HeroContent } from './HeroContent'
import './Hero.scss'

gsap.registerPlugin(ScrollTrigger)

export function Hero() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const [skipVisible, setSkipVisible] = useState(false)
  const hintPhase = useRef(-1)

  useEffect(() => {
    const t = setTimeout(() => setSkipVisible(true), 2000)
    return () => clearTimeout(t)
  }, [])

  const handleSkip = () => {
    if (!wrapperRef.current) return
    // ScrollTrigger range: offsetTop → offsetTop + wrapperHeight - vh
    const scrollStart = wrapperRef.current.offsetTop
    const scrollEnd = scrollStart + wrapperRef.current.offsetHeight - window.innerHeight
    const target = scrollStart + (scrollEnd - scrollStart) * 0.90
    document.dispatchEvent(
      new CustomEvent('lenis:scrollTo', { detail: { target } }),
    )
  }

  useEffect(() => {
    const footer = document.querySelector('footer')
    if (!footer) return

    const obs = new IntersectionObserver(([entry]) => {
      const el = document.getElementById('scroll-hint')
      if (!el) return
      if (entry.isIntersecting) {
        gsap.to(el, {
          opacity: 0, duration: 0.4, ease: 'power2.in',
          onComplete: () => gsap.set(el, { display: 'none' }),
        })
      } else {
        gsap.set(el, { display: 'flex' })
        gsap.to(el, { opacity: 1, duration: 0.4, ease: 'power2.out' })
      }
    })

    obs.observe(footer)
    return () => obs.disconnect()
  }, [])

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set('#scroll-hint', { xPercent: -50 })

      // ── Entry: badge + name chars + scroll hint on page load (no scroll needed)
      const entry = gsap.timeline({ defaults: { ease: 'power3.out' } })
      entry.fromTo('#hero-badge', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5 }, 0.1)
      entry.fromTo(
        '.name-char',
        { opacity: 0, y: 36, skewX: -8 },
        { opacity: 1, y: 0, skewX: 0, stagger: 0.025, duration: 0.7 },
        0.25,
      )
      entry.fromTo('#scroll-hint', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.6 }, 0.9)

      // ── Scroll-driven cinematic reveal:
      //   0.05 – 0.20  typed role
      //   0.18 – 0.42  description words
      //   0.42 – 0.52  CTA buttons
      //   0.50 – 0.62  stat cards
      //   0.62 – 0.82  HOLD (user reads)
      //   0.82 – 0.92  background layers fade to transparent
      //   0.90 – 1.00  content exits; sticky releases into dark page
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          onUpdate: (self) => {
            setProgress(self.progress)

            const p = self.progress
            const newPhase = p > 0.02 ? 1 : 0

            if (newPhase === hintPhase.current) return
            hintPhase.current = newPhase

            gsap.killTweensOf('#scroll-hint')

            if (newPhase === 0) {
              gsap.to('#scroll-hint', {
                xPercent: -50, x: 0,
                bottom: window.innerHeight * 0.22,
                scale: 1, opacity: 1,
                duration: 0.6, ease: 'power2.out',
              })
            } else {
              const w = document.getElementById('scroll-hint')?.offsetWidth ?? 120
              gsap.to('#scroll-hint', {
                xPercent: 0,
                x: window.innerWidth / 2 - 24 - w,
                bottom: 24,
                scale: 0.55,
                opacity: 1,
                transformOrigin: 'right bottom',
                duration: 0.7, ease: 'power2.inOut',
              })
            }
          },
          onEnterBack: () => {
            gsap.set('#scroll-hint', { display: 'flex' })
            gsap.to('#scroll-hint', { opacity: 1, duration: 0.4, ease: 'power2.out' })
          },
        },
      })

      tl.fromTo('#hero-role',   { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.15 }, 0.05)
      tl.fromTo('.desc-word',   { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, stagger: 0.006, duration: 0.18 }, 0.18)
      tl.fromTo('#hero-cta',    { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.1  }, 0.42)
      tl.fromTo('#hero-stats',  { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.12 }, 0.5)

      // Fade hero background layers BEFORE the content exits so the hero sticky
      // is already invisible when it unsticks — the page bg (#09090f) shows
      // through and the physical scroll of the wrapper is imperceptible.
      tl.fromTo('.hero-bg',    { opacity: 1 }, { opacity: 0, duration: 0.08 }, 0.82)
      tl.fromTo('#hero-content', { opacity: 1, y: 0 }, { opacity: 0, y: -26, duration: 0.1 }, 0.90)
    }, wrapperRef)

    return () => {
      hintPhase.current = -1
      ctx.revert()
    }
  }, [])

  return (
    <div ref={wrapperRef} className="hero-wrapper" id="top">
      <div ref={heroRef} className="hero-sticky">
        <HeroContent />

        <div className="scroll-hint" id="scroll-hint" aria-hidden>
          <div className="scroll-hint__mouse">
            <span className="scroll-hint__wheel" />
          </div>
          <div className="scroll-hint__label">Scroll to explore</div>
          <div className="scroll-hint__chevrons">
            <span className="scroll-hint__chev" />
            <span className="scroll-hint__chev" />
            <span className="scroll-hint__chev" />
          </div>
        </div>

        <button
          className={`hero-skip${skipVisible && progress < 0.05 ? ' hero-skip--visible' : ''}`}
          onClick={handleSkip}
          aria-label="Skip intro animation"
          tabIndex={skipVisible && progress < 0.05 ? 0 : -1}
        >
          Skip intro
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <div className="hero-progress" aria-hidden>
          <div
            className="hero-progress__bar"
            style={{ transform: `scaleY(${progress})` }}
          />
          <span className="hero-progress__pct">
            {Math.round(progress * 100).toString().padStart(2, '0')}
          </span>
        </div>
      </div>
    </div>
  )
}

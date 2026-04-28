import { useLayoutEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import { gsap } from 'gsap'
import { experience } from '../../data/content'
import './Experience.scss'

export function Experience() {
  const sectionRef = useRef<HTMLElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      mm.add('(min-width: 641px)', () => {
        const track = trackRef.current
        if (!track) return

        const getDistance = () => track.scrollWidth - window.innerWidth + 80
        // 900px for reveals + ~1200px dwell so content is readable before exit
        const totalScroll = () => getDistance() + 2100

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            pin: pinRef.current,
            start: 'top top',
            end: () => `+=${totalScroll()}`,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (barRef.current) barRef.current.style.transform = `scaleX(${self.progress})`
            },
          },
        })

        // Heading reveal
        tl.fromTo('.experience__head', { opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: 0.12 }, 0)

        // Split cards into those visible in the initial viewport vs off-screen to the right
        const cards = gsap.utils.toArray<HTMLElement>('.exp-card', track)
        const vw = window.innerWidth
        const visible = cards.filter(c => c.getBoundingClientRect().left < vw - 50)
        const offScreen = cards.filter(c => c.getBoundingClientRect().left >= vw - 50)

        // Phase 1 — stagger-reveal only the visible cards
        visible.forEach((card, i) => {
          tl.fromTo(
            card,
            { opacity: 0, y: 70, scale: 0.9 },
            { opacity: 1, y: 0, scale: 1, duration: 0.28 },
            0.14 + i * 0.25,
          )
        })

        // Start off-screen cards hidden
        if (offScreen.length) gsap.set(offScreen, { opacity: 0, scale: 0.92 })

        // Phase 2 — horizontal pan
        const panStart = tl.duration()
        tl.to(track, { x: () => -getDistance(), ease: 'none', duration: 1 }, '>')

        // Reveal each off-screen card at the exact moment it enters the viewport during pan
        offScreen.forEach(card => {
          const enterProgress = Math.max(0, (card.getBoundingClientRect().left - vw + 40) / getDistance())
          tl.fromTo(
            card,
            { opacity: 0, scale: 0.92 },
            { opacity: 1, scale: 1, duration: 0.1 },
            panStart + enterProgress,
          )
        })

        // Hold: user reads the final card before the exit
        tl.to({}, { duration: 0.8 }, '>')
        // Fade out before pin releases — pinned element is invisible when it unsticks
        tl.to(pinRef.current, { opacity: 0, duration: 0.12 }, '>')
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section className="experience" id="experience" ref={sectionRef}>
      <div className="experience__pin" ref={pinRef}>
        <div className="container">
          <div className="experience__head">
            <span className="section-label">Experience</span>
            <h2 className="section-heading">Where I&rsquo;ve shipped</h2>
          </div>
        </div>

        <div className="experience__rail">
          <div className="experience__rail-inner" ref={trackRef}>
            {experience.map((job) => (
              <article
                key={job.company}
                className="exp-card"
                data-glow
                style={{ '--accent': job.accent } as CSSProperties}
              >
                <div className="exp-card__glow" aria-hidden />
                <div className="exp-card__top" />
                <div className="exp-card__head">
                  <h3 className="exp-card__role">{job.role}</h3>
                  <div className="exp-card__meta">
                    <span className="exp-card__company">{job.company}</span>
                    {job.client && (
                      <>
                        <span className="exp-card__sep">·</span>
                        <span className="exp-card__client">{job.client}</span>
                      </>
                    )}
                  </div>
                  <div className="exp-card__period">{job.period}</div>
                </div>

                <ul className="exp-card__points">
                  {job.points.map((p, idx) => (
                    <li key={idx}>
                      <span className="exp-card__bullet" />
                      {p}
                    </li>
                  ))}
                </ul>

                <div className="exp-card__tech">
                  {job.tech.map((t) => (
                    <span key={t} className="exp-card__tag">
                      {t}
                    </span>
                  ))}
                </div>
              </article>
            ))}

            <div className="exp-card exp-card--end">
              <div className="exp-card__end-text">More to come.</div>
              <div className="exp-card__end-sub">Always shipping.</div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="experience__hint">scroll to traverse the timeline</div>
        </div>

        <div className="section-progress" aria-hidden>
          <div className="section-progress__bar" ref={barRef} />
        </div>
      </div>
    </section>
  )
}

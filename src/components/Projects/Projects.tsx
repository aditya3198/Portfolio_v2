import { useLayoutEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import { gsap } from 'gsap'
import { projects } from '../../data/content'
import './Projects.scss'

export function Projects() {
  const sectionRef = useRef<HTMLElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      mm.add('(max-width: 640px)', () => {
        gsap.fromTo(
          '.projects__head',
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.6, scrollTrigger: { trigger: '.projects__head', start: 'top 92%' } },
        )
        // Cards always visible on mobile — horizontal scroll-snap handles UX
        gsap.set('.proj-card', { opacity: 1, y: 0, scale: 1 })
      })

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
        tl.fromTo('.projects__head', { opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: 0.12 }, 0)

        // Split cards into those visible in the initial viewport vs off-screen to the right
        const cards = gsap.utils.toArray<HTMLElement>('.proj-card', track)
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
    <section className="projects" id="projects" ref={sectionRef}>
      <div className="projects__pin" ref={pinRef}>
        <div className="container">
          <div className="projects__head">
            <span className="section-label">Projects</span>
            <h2 className="section-heading">Things I&rsquo;ve built</h2>
          </div>
        </div>

        <div className="projects__rail">
          <div className="projects__rail-inner" ref={trackRef}>
            {projects.map((p) => (
              <article
                key={p.name}
                className="proj-card"
                data-glow
                style={
                  {
                    '--accent': p.accent,
                    '--badge-color': p.badgeColor,
                  } as CSSProperties
                }
              >
                <div className="proj-card__glow" aria-hidden />
                <div className="proj-card__top" />
                <div className="proj-card__head">
                  <h3 className="proj-card__name">{p.name}</h3>
                  <span className="proj-card__badge">{p.badge}</span>
                </div>

                <p className="proj-card__desc">{p.desc}</p>

                <div className="proj-card__tech">
                  {p.tech.map((t) => (
                    <span key={t} className="proj-card__tag">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="proj-card__links">
                  {'isCurrent' in p && p.isCurrent ? (
                    <span className="proj-card__link proj-card__link--here" aria-label="You are currently viewing this site">
                      You're here ✦
                    </span>
                  ) : p.liveUrl ? (
                    <a
                      href={p.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="proj-card__link"
                    >
                      Live ↗
                    </a>
                  ) : (
                    <span className="proj-card__link proj-card__link--disabled" aria-disabled="true">Live ↗</span>
                  )}
                  {p.githubUrl ? (
                    <a
                      href={p.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="proj-card__link proj-card__link--ghost"
                    >
                      Code ↗
                    </a>
                  ) : (
                    <span className="proj-card__link proj-card__link--ghost proj-card__link--disabled" aria-disabled="true">Code ↗</span>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="container">
          <div className="projects__hint">scroll to explore</div>
        </div>

        <div className="section-progress" aria-hidden>
          <div className="section-progress__bar" ref={barRef} />
        </div>
      </div>
    </section>
  )
}

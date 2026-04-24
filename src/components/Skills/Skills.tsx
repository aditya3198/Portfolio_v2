import { useLayoutEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import { gsap } from 'gsap'
import { marqueeSkills, highlightSkills } from '../../data/content'
import './Skills.scss'

const skillIcons: Record<string, React.ReactElement> = {
  'React.js': (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="2.1" fill="currentColor" />
      <ellipse cx="12" cy="12" rx="10.5" ry="4" stroke="currentColor" strokeWidth="1.2" />
      <ellipse cx="12" cy="12" rx="10.5" ry="4" stroke="currentColor" strokeWidth="1.2" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="10.5" ry="4" stroke="currentColor" strokeWidth="1.2" transform="rotate(120 12 12)" />
    </svg>
  ),
  'TypeScript': (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="4" stroke="currentColor" strokeWidth="1.2" />
      <path d="M7 9h4M9 9v7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M13.5 15.2c.4.5 1.1.9 2 .8.9-.1 1.5-.7 1.5-1.5s-.6-1.2-1.8-1.5c-1.2-.3-1.7-.8-1.7-1.6 0-.8.7-1.4 1.7-1.4s1.6.4 1.9.9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  'Lit': (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13.8 2.5c.3 2.2-.6 3.8-1.8 5.1 0-1.3-.5-2.4-1.2-3.1-.2 1.5-1 2.7-2 3.6C7.4 9.5 6.5 11 6.5 13c0 3 2 5.5 5.5 5.5S17.5 16 17.5 13c0-1.6-.7-2.8-1.5-3.7.1.8-.1 1.6-.6 2.2C15.1 9.8 14.8 6 13.8 2.5z" />
    </svg>
  ),
  'Web Perf': (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 17a8 8 0 1 1 14 0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M12 7v2M7.1 9.1l1.4 1.4M16.9 9.1l-1.4 1.4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      <line x1="12" y1="17" x2="16.2" y2="10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="17" r="1.5" fill="currentColor" />
    </svg>
  ),
}

export function Skills() {
  const sectionRef = useRef<HTMLElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const marqueeLoop = [...marqueeSkills, ...marqueeSkills]

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      mm.add('(min-width: 641px)', () => {
        // Set initial states explicitly so scrub timeline sees them immediately.
        gsap.set('.skills__heading-wrap', { opacity: 0, y: 28 })
        gsap.set('.skills__marquee', { opacity: 0, y: 22 })
        gsap.set('.skills__card', { opacity: 0, y: 56, scale: 0.92 })

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '+=380%',
            scrub: 1,
            pin: stickyRef.current,
            pinSpacing: true,
          },
        })

        tl.to('.skills__heading-wrap', { opacity: 1, y: 0, duration: 0.14 }, 0.0)
        tl.to('.skills__marquee', { opacity: 1, y: 0, duration: 0.12 }, 0.16)
        tl.to(
          '.skills__card',
          { opacity: 1, y: 0, scale: 1, stagger: 0.14, duration: 0.24 },
          0.32,
        )

        // Hold: user reads the fully-revealed content before the exit
        tl.to({}, { duration: 0.8 }, '>')
        // Fade out before pin releases — pinned element is invisible when it unsticks
        tl.to(stickyRef.current, { opacity: 0, duration: 0.12 }, '>')
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section className="skills" id="skills" ref={sectionRef}>
      <div className="skills__sticky" ref={stickyRef}>
        <div className="container">
          <div className="skills__heading-wrap">
            <span className="section-label">Skills</span>
            <h2 className="section-heading">What I work with</h2>
          </div>
        </div>

        <div className="skills__marquee" aria-hidden>
          <div className="skills__marquee-track">
            {marqueeLoop.map((s, i) => (
              <span key={i} className="skills__chip">
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="container">
          <div className="skills__cards">
            {highlightSkills.map((s) => (
              <div
                key={s.label}
                className="skills__card"
                style={{ '--glow': s.glow } as CSSProperties}
              >
                <div className="skills__card-glow" />
                <div className="skills__card-body">
                  {skillIcons[s.label] && (
                    <div className="skills__card-icon" style={{ color: s.glow }}>
                      {skillIcons[s.label]}
                    </div>
                  )}
                  <div className="skills__card-label">{s.label}</div>
                  <div className="skills__card-sub">{s.sub}</div>
                  <div className="skills__card-desc">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

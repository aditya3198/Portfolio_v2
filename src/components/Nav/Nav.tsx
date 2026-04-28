import { useCallback, useEffect, useRef, useState } from 'react'
import { navLinks } from '../../data/content'
import { useScramble } from '../../hooks/useScramble'
import './Nav.scss'

type TransitionPhase = 'idle' | 'in' | 'out'

// ── NavLink — scramble + slide indicator on hover ────────────────────────────
interface NavLinkProps {
  link: { label: string; href: string }
  active: string
  onEnter: (href: string) => void
  onLeave: () => void
  setRef: (href: string, el: HTMLAnchorElement | null) => void
  onClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string, label: string) => void
}

function NavLink({ link, active, onEnter, onLeave, setRef, onClick }: NavLinkProps) {
  const { display, scramble, reset } = useScramble(link.label)

  return (
    <li>
      <a
        ref={(el) => setRef(link.href, el)}
        href={link.href}
        className={active === link.href ? 'nav__link--active' : ''}
        aria-current={active === link.href ? 'true' : undefined}
        onMouseEnter={() => { scramble(); onEnter(link.href) }}
        onMouseLeave={() => { reset(); onLeave() }}
        onClick={(e) => onClick(e, link.href, link.label)}
      >
        {display}
      </a>
    </li>
  )
}

// ── Nav ──────────────────────────────────────────────────────────────────────
export function Nav() {
  const [scrolled, setScrolled]   = useState(false)
  const [active, setActive]       = useState('')
  const [menuOpen, setMenuOpen]   = useState(false)
  const [transition, setTransition] = useState<{ phase: TransitionPhase; label: string }>({
    phase: 'idle',
    label: '',
  })

  const ulRef        = useRef<HTMLUListElement>(null)
  const indicatorRef = useRef<HTMLSpanElement>(null)
  const aRefs        = useRef<Map<string, HTMLAnchorElement>>(new Map())
  const timerRefs    = useRef<ReturnType<typeof setTimeout>[]>([])

  const closeMenu = useCallback(() => setMenuOpen(false), [])

  const setRef = useCallback((href: string, el: HTMLAnchorElement | null) => {
    if (el) aRefs.current.set(href, el)
    else aRefs.current.delete(href)
  }, [])

  const moveIndicator = useCallback((href: string) => {
    const ul        = ulRef.current
    const indicator = indicatorRef.current
    const a         = aRefs.current.get(href)
    if (!ul || !indicator || !a) return
    const ulRect = ul.getBoundingClientRect()
    const aRect  = a.getBoundingClientRect()
    indicator.style.left    = `${aRect.left - ulRect.left}px`
    indicator.style.width   = `${aRect.width}px`
    indicator.style.opacity = '1'
  }, [])

  const hideIndicator = useCallback(() => {
    if (indicatorRef.current) indicatorRef.current.style.opacity = '0'
  }, [])

  const handleNavClick = useCallback((
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    label: string,
  ) => {
    e.preventDefault()
    closeMenu()

    if (transition.phase !== 'idle') return

    // Clear any stale timers
    timerRefs.current.forEach(clearTimeout)
    timerRefs.current = []

    setTransition({ phase: 'in', label })

    // Instant-scroll while overlay is covering (380ms for curtain to close)
    const t1 = setTimeout(() => {
      document.dispatchEvent(
        new CustomEvent('lenis:scrollToInstant', { detail: { target: href } }),
      )
    }, 400)

    // Start exit
    const t2 = setTimeout(() => {
      setTransition((prev) => ({ ...prev, phase: 'out' }))
    }, 1150)

    // Done
    const t3 = setTimeout(() => {
      setTransition({ phase: 'idle', label: '' })
    }, 1600)

    timerRefs.current = [t1, t2, t3]
  }, [closeMenu, transition.phase])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const ids = navLinks.map((l) => l.href.slice(1))
    const observers = ids.map((id) => {
      const el = document.getElementById(id)
      if (!el) return null
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(`#${id}`) },
        { rootMargin: '-30% 0px -60% 0px', threshold: 0 },
      )
      obs.observe(el)
      return obs
    })
    return () => observers.forEach((o) => o?.disconnect())
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeMenu() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [menuOpen, closeMenu])

  // Cleanup timers on unmount
  useEffect(() => () => { timerRefs.current.forEach(clearTimeout) }, [])

  const overlayClass = [
    'nav-overlay',
    transition.phase === 'in'  ? 'nav-overlay--in'  : '',
    transition.phase === 'out' ? 'nav-overlay--out' : '',
  ].filter(Boolean).join(' ')

  return (
    <>
      <nav className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
        <div className="nav__inner">
          <a href="#top" className="nav__brand">
            <span className="nav__brand-mark grad-text">AG</span>
            <span className="nav__brand-dot" />
          </a>

          {/* Desktop links */}
          <ul ref={ulRef} className="nav__links">
            <span ref={indicatorRef} className="nav__indicator" aria-hidden />
            {navLinks.map((l) => (
              <NavLink
                key={l.href}
                link={l}
                active={active}
                onEnter={moveIndicator}
                onLeave={hideIndicator}
                setRef={setRef}
                onClick={handleNavClick}
              />
            ))}
          </ul>

          {/* Hamburger — mobile only */}
          <button
            className={`nav__burger ${menuOpen ? 'nav__burger--open' : ''}`}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="nav-mobile"
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </div>

        {/* Mobile fullscreen overlay */}
        <div
          id="nav-mobile"
          className={`nav__mobile ${menuOpen ? 'nav__mobile--open' : ''}`}
          aria-hidden={!menuOpen}
          inert={!menuOpen || undefined}
        >
          <ul className="nav__mobile-links">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className={active === l.href ? 'nav__link--active' : ''}
                  onClick={(e) => handleNavClick(e, l.href, l.label)}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Page transition curtain */}
      {transition.phase !== 'idle' && (
        <div className={overlayClass} aria-hidden>
          <span className="nav-overlay__label grad-text">{transition.label}</span>
          <div className="nav-overlay__bar">
            <div className="nav-overlay__fill" />
          </div>
        </div>
      )}
    </>
  )
}

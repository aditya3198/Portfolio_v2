import { useCallback, useEffect, useState } from 'react'
import { navLinks } from '../../data/content'
import './Nav.scss'

export function Nav() {
  const [scrolled, setScrolled]   = useState(false)
  const [active, setActive]       = useState('')
  const [menuOpen, setMenuOpen]   = useState(false)

  const closeMenu = useCallback(() => setMenuOpen(false), [])

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

  // Lock body scroll + ESC to close when mobile menu is open
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

  return (
    <nav className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <div className="nav__inner">
        <a href="#top" className="nav__brand">
          <span className="nav__brand-mark grad-text">AG</span>
          <span className="nav__brand-dot" />
        </a>

        {/* Desktop links */}
        <ul className="nav__links">
          {navLinks.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className={active === l.href ? 'nav__link--active' : ''}
                aria-current={active === l.href ? 'true' : undefined}
              >
                {l.label}
              </a>
            </li>
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
                onClick={closeMenu}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}

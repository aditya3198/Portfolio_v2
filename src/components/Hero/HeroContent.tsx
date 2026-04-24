import { Fragment, useEffect, useState } from 'react'
import { jobStatus, personal, typedRoles } from '../../data/content'
import { useSplitText } from '../../hooks/useSplitText'
import { useTyped } from '../../hooks/useTyped'
import { StatCards } from './StatCards'

export function HeroContent() {
  const nameChars = useSplitText(personal.name, 'chars')
  const descWords = useSplitText(personal.description, 'words')

  // Start typing shortly after mount
  const [typingActive, setTypingActive] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setTypingActive(true), 600)
    return () => clearTimeout(t)
  }, [])
  const typed = useTyped(typedRoles, typingActive)

  return (
    <div className="hero-content" id="hero-content">
      <span className="hero-badge" id="hero-badge">
        <span className="hero-badge__dot" />
        {jobStatus.available ? jobStatus.availableText : jobStatus.currentRole}
      </span>

      <h1 className="hero-name" id="hero-name">
        {nameChars.map(({ content, className, key }) => (
          <span key={key} className={className}>
            {content}
          </span>
        ))}
      </h1>

      <div className="hero-role" id="hero-role">
        <span className="hero-role__prefix">&gt;</span>
        <span className="hero-role__typed grad-text">{typed}</span>
        <span className="hero-role__caret" />
      </div>

      <p className="hero-desc" id="hero-desc">
        {descWords.map(({ content, className, key }) => (
          <Fragment key={key}>
            <span className={className}>{content}</span>
            {' '}
          </Fragment>
        ))}
      </p>

      <div className="hero-cta" id="hero-cta">
        <a href="#projects" className="hero-cta__btn hero-cta__btn--primary">
          See my work
          <span className="hero-cta__arrow">→</span>
        </a>
        <a href="#contact" className="hero-cta__btn hero-cta__btn--ghost">
          Get in touch
        </a>
      </div>

      <StatCards />
    </div>
  )
}

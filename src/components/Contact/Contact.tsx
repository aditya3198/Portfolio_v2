import { motion } from 'framer-motion'
import { personal } from '../../data/content'
import './Contact.scss'

export function Contact() {
  return (
    <section className="contact" id="contact">
      <div className="container">
        <motion.div
          className="contact__card"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="contact__glow" aria-hidden />
          <span className="section-label">Contact</span>
          <h2 className="contact__heading">
            Let&rsquo;s build something <span className="grad-text">worth shipping</span>.
          </h2>
          <p className="contact__sub">
            Open to SDE2 / Senior Frontend roles at product companies.
            Drop a line — I usually reply within a day.
          </p>

          <div className="contact__actions">
            <a
              href={`mailto:${personal.email}`}
              className="contact__btn contact__btn--primary"
            >
              {personal.email} →
            </a>
            <div className="contact__social">
              <a
                href={personal.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="contact__btn contact__btn--ghost"
              >
                LinkedIn
              </a>
              <a
                href={personal.github}
                target="_blank"
                rel="noopener noreferrer"
                className="contact__btn contact__btn--ghost"
              >
                GitHub
              </a>
            </div>
          </div>

          <div className="contact__meta">
            <span><span role="img" aria-label="Location">📍</span> {personal.location}</span>
            <span className="contact__dot" />
            <span>Bangalore / remote friendly</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

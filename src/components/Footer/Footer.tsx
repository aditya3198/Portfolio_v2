import { personal } from '../../data/content'
import './Footer.scss'

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__left">
          <span className="footer__brand grad-text">Aditya Garg</span>
          <span className="footer__sub">
            Built from scratch · React · TypeScript · GSAP
          </span>
        </div>
        <div className="footer__right">
          <a href={personal.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
          <a href={personal.github} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href={`mailto:${personal.email}`}>Email</a>
        </div>
      </div>
      <div className="container footer__copy">
        © {new Date().getFullYear()} Aditya Garg. All rights reserved.
      </div>
    </footer>
  )
}

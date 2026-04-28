import { useLenis } from './hooks/useLenis'
import { useCursorGlow } from './hooks/useCursorGlow'
import { useCometTrail } from './hooks/useCometTrail'
import { HeroBackground } from './components/Hero/HeroBackground'
import { Nav } from './components/Nav/Nav'
import { Hero } from './components/Hero/Hero'
import { Skills } from './components/Skills/Skills'
import { Experience } from './components/Experience/Experience'
import { Projects } from './components/Projects/Projects'
import { Contact } from './components/Contact/Contact'
import { Footer } from './components/Footer/Footer'

function App() {
  useLenis()
  useCursorGlow()
  useCometTrail()

  return (
    <>
      <HeroBackground />
      <a href="#skills" className="skip-link">Skip to content</a>
      <Nav />
      <main>
        <Hero />
        <Skills />
        <Experience />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default App

import { useLenis } from './hooks/useLenis'
import { Nav } from './components/Nav/Nav'
import { Hero } from './components/Hero/Hero'
import { Skills } from './components/Skills/Skills'
import { Experience } from './components/Experience/Experience'
import { Projects } from './components/Projects/Projects'
import { Contact } from './components/Contact/Contact'
import { Footer } from './components/Footer/Footer'

function App() {
  useLenis()

  return (
    <>
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

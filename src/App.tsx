import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { Projects } from './components/Projects'
import { About } from './components/About'
import { Footer } from './components/Footer'

function App() {
  return (
    <div className="min-h-screen bg-cream">
      <Nav />
      <main>
        <Hero />
        <Projects />
        <About />
      </main>
      <Footer />
    </div>
  )
}

export default App

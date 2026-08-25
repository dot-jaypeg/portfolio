import { useEffect, useState } from 'react'
import { useSmoothScroll } from './hooks/useSmoothScroll'
import { Preloader } from './components/Preloader'
import { Cursor } from './components/Cursor'
import { Grain } from './components/Grain'
import { Nav } from './components/Nav'
import { CinematicIntro } from './components/CinematicIntro'
import { WorkCarousel } from './components/WorkCarousel'
import { Capabilities } from './components/Capabilities'
import { Contact } from './components/Contact'

function App() {
  const [loading, setLoading] = useState(true)
  useSmoothScroll()

  useEffect(() => {
    document.body.style.overflow = loading ? 'hidden' : ''
  }, [loading])

  return (
    <>
      <Preloader onComplete={() => setLoading(false)} />
      <Cursor />
      <Grain />
      <div style={{ visibility: loading ? 'hidden' : 'visible' }}>
        <Nav />
        <main>
          <CinematicIntro />
          <WorkCarousel />
          <Capabilities />
        </main>
        <Contact />
      </div>
    </>
  )
}

export default App

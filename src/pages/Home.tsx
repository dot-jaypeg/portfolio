import { useEffect, useState } from 'react'
import { useSmoothScroll } from '../hooks/useSmoothScroll'
import { useSectionColors } from '../hooks/useSectionColors'
import { Preloader } from '../components/Preloader'
import { Cursor } from '../components/Cursor'
import { Grain } from '../components/Grain'
import { PageMask } from '../components/PageMask'
import { Nav } from '../components/Nav'
import { CinematicIntro } from '../components/CinematicIntro'
import { Journey } from '../components/Journey'
import { Contact } from '../components/Contact'
import { Divider } from '../components/Divider'

export function Home() {
  const [loading, setLoading] = useState(true)
  useSmoothScroll()
  useSectionColors()

  useEffect(() => {
    document.body.style.overflow = loading ? 'hidden' : ''
  }, [loading])

  return (
    <>
      <Preloader onComplete={() => setLoading(false)} />
      <Cursor />
      <Grain />
      <PageMask />
      <div style={{ visibility: loading ? 'hidden' : 'visible' }}>
        <Nav />
        <main>
          <CinematicIntro />
          <Journey />
          <Divider />
        </main>
        <Contact />
      </div>
    </>
  )
}

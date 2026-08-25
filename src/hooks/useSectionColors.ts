import { useEffect } from 'react'
import { gsap } from '../lib/gsap'

// Each entry crossfades --bg/--fg (see index.css) as its section's top
// edge crosses the trigger zone. Work and Contact share the dark ink/
// cream pair; About inverts to a light section in between, so the page
// reads dark -> light -> dark as you scroll -- CinematicIntro is left
// out deliberately, it stays fixed ink/cream throughout its own pinned
// scroll so it doesn't compete with the SplitText reveal timeline.
const SECTION_THEMES: Record<string, { bg: string; fg: string }> = {
  work: { bg: '#161616', fg: '#fffcef' },
  about: { bg: '#fffcef', fg: '#161616' },
  contact: { bg: '#161616', fg: '#fffcef' },
}

export function useSectionColors() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      Object.entries(SECTION_THEMES).forEach(([id, theme]) => {
        const section = document.getElementById(id)
        if (!section) return

        gsap.to(document.documentElement, {
          '--bg': theme.bg,
          '--fg': theme.fg,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'top 30%',
            scrub: true,
          },
        })
      })
    })

    return () => ctx.revert()
  }, [])
}

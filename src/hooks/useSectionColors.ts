import { useEffect } from 'react'
import { gsap } from '../lib/gsap'

// Each entry crossfades --bg/--fg (see index.css) as its section's top
// edge crosses the trigger zone. Work stays base ink/cream (continuity
// with where CinematicIntro's own per-scene tinting settles), About
// inverts to the full cream, and Contact lands on base ink/cream --
// the red that used to live here moved to CinematicIntro's "Jayden
// Ramirez" scene instead. CinematicIntro's own scene-to-scene tinting
// lives inside CinematicIntro.tsx, tied to its pinned scrub timeline
// instead of a separate ScrollTrigger here.
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

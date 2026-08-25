import { useEffect } from 'react'
import { gsap } from '../lib/gsap'

// Only Contact is left here -- it's the only section that still has a
// real vertical top edge to crossfade off of. Work and About now live
// inside Journey's own pinned horizontal track (see JourneyDesktop.tsx),
// which handles their per-chapter --bg/--fg tweens itself, tied to its
// scrub timeline instead of an independent ScrollTrigger here, exactly
// like CinematicIntro already does for its own scenes.
const SECTION_THEMES: Record<string, { bg: string; fg: string }> = {
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

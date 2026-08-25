import { useEffect } from 'react'
import { gsap } from '../lib/gsap'
import { JOURNEY_CHAPTERS } from '../data/journeyChapters'

// Only Contact is left here -- it's the only section that still has a
// real vertical top edge to crossfade off of. Work and About now live
// inside Journey's own pinned horizontal track (see JourneyDesktop.tsx),
// which handles their per-chapter --bg/--fg tweens itself, tied to its
// scrub timeline instead of an independent ScrollTrigger here, exactly
// like CinematicIntro already does for its own scenes.
const CONTACT_THEME = { bg: '#161616', fg: '#fffcef' }

export function useSectionColors() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      const section = document.getElementById('contact')
      if (!section) return

      // Explicit `from`, not gsap.to()'s implicit "read the current
      // value" -- this effect runs at mount, before Journey's own
      // tweens have written anything, so an implicit read would have
      // captured index.css's pristine --bg default (#161616) as the
      // "from" state. Since that happens to equal Contact's own target
      // color, the tween became a from===to no-op that still had an
      // active ScrollTrigger scrubbing it -- and depending on which of
      // two entirely independent ScrollTrigger instances happened to
      // render last on a given scroll tick, either this no-op tween's
      // constant value or Journey's held About-cream state could win,
      // producing a real, reproducible flicker between the two right
      // around Contact's entry. Sourcing the true "from" (About's held
      // color) directly from the chapter data keeps this tween a real
      // interpolation, so its rendered value at any progress is always
      // unambiguous.
      const from = JOURNEY_CHAPTERS[JOURNEY_CHAPTERS.length - 1]

      gsap.fromTo(
        document.documentElement,
        { '--bg': from.bg, '--fg': from.fg },
        {
          '--bg': CONTACT_THEME.bg,
          '--fg': CONTACT_THEME.fg,
          ease: 'none',
          // fromTo() renders its `from` state immediately on creation
          // by default -- at mount, well before any scrolling, which
          // briefly stamped About's cream onto the very first paint
          // instead of leaving the intro's own default alone. This
          // tween should only ever render once its ScrollTrigger
          // actually scrubs it.
          immediateRender: false,
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'top 30%',
            scrub: true,
          },
        },
      )
    })

    return () => ctx.revert()
  }, [])
}

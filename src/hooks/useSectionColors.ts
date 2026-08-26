import { useEffect } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { JOURNEY_CHAPTERS } from '../data/journeyChapters'
import { SCENES } from '../components/CinematicIntro'

// Contact's crossfade below is the only ORIGINAL reason this file
// existed -- it's a genuine vertical top edge to crossfade off of. Work
// and About otherwise live inside Journey's own pinned horizontal track
// (see JourneyDesktop.tsx), which handles their per-chapter --bg/--fg
// tweens itself, tied to its scrub timeline instead of an independent
// ScrollTrigger here, exactly like CinematicIntro does for its own
// scenes -- EXCEPT for the specific gap the second effect below patches.
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
        { '--bg': from.bg, '--fg': from.fg, '--nav-fg': from.fg },
        {
          '--bg': CONTACT_THEME.bg,
          '--fg': CONTACT_THEME.fg,
          '--nav-fg': CONTACT_THEME.fg,
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

  // A confirmed, structural bug: any pin-spacer reserves the pinned
  // element's own natural height (one viewport, since CinematicIntro is
  // h-screen) IN ADDITION to its scrub distance -- verified directly by
  // measuring CinematicIntro's own ScrollTrigger.end against where
  // Journey's own trigger actually starts (they were exactly one
  // viewport-height apart). That means CinematicIntro's internal
  // progress reaches 1 and STOPS a full extra viewport-height of scroll
  // before its pin visually releases and Journey's content appears --
  // scene 3 sits frozen on screen the whole time, and CinematicIntro's
  // own onUpdate never fires again during that stretch (self.progress
  // isn't changing, so GSAP has no reason to call it), confirmed
  // directly: instrumenting it showed zero calls anywhere in that range,
  // even scrolling through it slowly and continuously. Nothing was ever
  // writing color there, so whatever red was last set just sat frozen
  // for that whole extra scroll distance -- exactly what read as "stays
  // red-orange" instead of transitioning as you scroll. Fixed the same
  // way Contact's own crossfade above works: a plain, non-pinned
  // ScrollTrigger with a real vertical edge to key off of ("top bottom"
  // of #journey is, by construction, exactly where CinematicIntro's own
  // progress hits 1; "top top" is exactly where Journey's pin takes
  // over), so its own progress genuinely changes across that gap and
  // onUpdate reliably fires. Deliberately NOT `scrub` -- scrub is what
  // caused the original bug (self.progress easing toward a big instant
  // jump over about a second instead of snapping to it); tracking
  // self.progress directly with no smoothing means a nav-link jump
  // straight past this range reports its true final progress (0 or 1)
  // on the very first tick, with no belated catch-up to stomp whatever
  // Journey's own trigger has already set.
  useEffect(() => {
    const ctx = gsap.context(() => {
      const journey = document.getElementById('journey')
      if (!journey) return
      const last = SCENES[SCENES.length - 1]
      const first = JOURNEY_CHAPTERS[0]
      ScrollTrigger.create({
        trigger: journey,
        start: 'top bottom',
        end: 'top top',
        onUpdate: (self) => {
          // Guards against writing at all before the page has actually
          // scrolled anywhere near this range -- self.progress reports 0
          // even at the very top of the page (nowhere near this trigger),
          // which would otherwise stamp scene 3's red onto the very first
          // paint instead of leaving CinematicIntro's own default alone.
          if (!self.isActive) return
          const t = self.progress
          gsap.set(document.documentElement, {
            '--bg': gsap.utils.interpolate(last.bg, first.bg, t),
            '--fg': gsap.utils.interpolate(last.fg, first.fg, t),
            '--nav-fg': gsap.utils.interpolate(last.fg, first.fg, t),
          })
        },
      })
    })

    return () => ctx.revert()
  }, [])
}

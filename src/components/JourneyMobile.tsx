import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { JOURNEY_CHAPTERS } from '../data/journeyChapters'
import { Reveal } from './Reveal'

// Below the desktop breakpoint, the same chapter content renders as a
// plain stacked vertical flow instead -- no pin, no parallax, no
// clip-mask, just Reveal's existing fade+rise per chapter. Horizontal
// scroll-jacking via touch is fragile enough that skipping it entirely
// on mobile is the safer, standard choice for this kind of site.
//
// No id="work"/id="about" here -- the first Work chapter and first
// About chapter already carry those ids on their own root (see
// journeyChapters.tsx), since the exact same chapter.render() output
// is reused unmodified in JourneyDesktop. Adding a second id on this
// wrapper would just duplicate it in the DOM.
export function JourneyMobile() {
  const sectionRefs = useRef<(HTMLElement | null)[]>([])

  // JourneyDesktop drives --bg/--fg continuously off its own pinned
  // scrub timeline (colorAtProgress) -- this never had an equivalent on
  // mobile at all. Two real, confirmed bugs resulted: (1) the outer
  // `<>` fragment here carried no `id="journey"`, so
  // useSectionColors.ts's own gap-crossfade (CinematicIntro's last
  // scene -> this chapter's colors, keyed on `document.getElementById
  // ('journey')`) silently found nothing and never ran, leaving colors
  // frozen wherever CinematicIntro's own trigger last left them; (2)
  // with nothing here ever writing --bg/--fg either, the WHOLE Work +
  // About stretch just inherited whatever Contact's own separate
  // crossfade (or anything else touching these vars) happened to leave
  // behind -- confirmed directly: the entire Work section rendered
  // with About's cream/ink pair instead of Work's own ink/cream one.
  // One crossfade per chapter BOUNDARY (i from 1 -- chapter 0 doesn't
  // need its own, the gap-crossfade above already lands on its colors)
  // mirrors JourneyDesktop's own per-chapter interpolation, just driven
  // by each section's own scroll-into-view instead of a shared
  // timeline's progress.
  useEffect(() => {
    const ctx = gsap.context(() => {
      JOURNEY_CHAPTERS.forEach((chapter, i) => {
        if (i === 0) return
        const section = sectionRefs.current[i]
        const prev = JOURNEY_CHAPTERS[i - 1]
        if (!section) return
        gsap.fromTo(
          document.documentElement,
          { '--bg': prev.bg, '--fg': prev.fg, '--nav-fg': prev.fg },
          {
            '--bg': chapter.bg,
            '--fg': chapter.fg,
            '--nav-fg': chapter.fg,
            ease: 'none',
            // Matches Contact's own crossfade in useSectionColors.ts --
            // immediateRender:false so mounting this doesn't stamp a
            // later chapter's colors onto the very first paint, before
            // any real scrolling has happened.
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
    })
    return () => ctx.revert()
  }, [])

  return (
    <div id="journey">
      {JOURNEY_CHAPTERS.map((chapter, i) => (
        <section
          key={chapter.key}
          ref={(el) => {
            sectionRefs.current[i] = el
          }}
        >
          <Reveal>{chapter.render()}</Reveal>
        </section>
      ))}
    </div>
  )
}

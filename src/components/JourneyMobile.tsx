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

  // JourneyDesktop gives every `.chapter-media`/`.chapter-copy` element
  // its own depth-cue drift, scrubbed off its shared pinned timeline --
  // this never had an equivalent here at all, so on mobile every one of
  // these case-study photos and the About polaroid sat completely
  // static regardless of scroll, a real, confirmed gap (reported
  // directly as "a lack of scroll animations in general"). `yPercent`,
  // not desktop's `xPercent` -- a vertical drift reads as the familiar
  // parallax cue for a vertically-scrolling page, where a horizontal
  // one would look like an unrelated sideways jitter. Scrubbed by each
  // chapter's own natural top-to-bottom scroll-through range instead of
  // a shared timeline's fractional window, since there isn't one.
  useEffect(() => {
    const ctx = gsap.context(() => {
      JOURNEY_CHAPTERS.forEach((_, i) => {
        const section = sectionRefs.current[i]
        if (!section) return
        section.querySelectorAll<HTMLElement>('.chapter-media').forEach((media) => {
          const amount = Number(media.getAttribute('data-parallax-amount')) || 8
          gsap.fromTo(
            media,
            { yPercent: amount },
            {
              yPercent: -amount,
              ease: 'none',
              scrollTrigger: {
                trigger: section,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            },
          )
        })
        const copy = section.querySelector<HTMLElement>('.chapter-copy')
        if (copy) {
          gsap.fromTo(
            copy,
            { yPercent: -2 },
            {
              yPercent: 2,
              ease: 'none',
              scrollTrigger: {
                trigger: section,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            },
          )
        }
      })
    })
    return () => ctx.revert()
  }, [])

  // `pt-24` -- per direct request, there was no gap at all between
  // CinematicIntro's last scene (Jayden Ramirez) and this section's own
  // first chapter; the Contra cover photo butted directly up against it
  // with zero breathing room. Padding, not a margin -- keeps #journey's
  // own top edge exactly where useSectionColors.ts's gap-crossfade
  // (CinematicIntro -> this section) expects it, rather than shifting
  // the boundary the two use.
  return (
    <div id="journey" className="pt-24">
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

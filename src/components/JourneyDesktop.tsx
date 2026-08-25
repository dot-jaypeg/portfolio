import { Fragment, useEffect, useRef } from 'react'
import { gsap, SplitText } from '../lib/gsap'
import { JOURNEY_CHAPTERS, TOTAL_CHAPTERS } from '../data/journeyChapters'

const pad = (num: number) => String(num).padStart(2, '0')

export function JourneyDesktop() {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const track = trackRef.current!
      const panels = gsap.utils.toArray<HTMLElement>('.chapter-panel')
      const n = panels.length

      const splits = panels.map((panel) =>
        new SplitText(panel.querySelector('.chapter-headline')!, {
          type: 'words',
        }),
      )

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: () => '+=' + window.innerHeight * n * 1.3,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (progressRef.current) {
              progressRef.current.style.transform = `scaleX(${self.progress})`
            }
            if (counterRef.current) {
              // Panel i is centered at progress i/(n-1), not i/n -- the
              // track travels (n-1) panel-widths total, so rounding to
              // the nearest i/(n-1) gives whichever chapter is actually
              // dominant on screen right now.
              const index = Math.round(self.progress * (n - 1))
              counterRef.current.textContent = `${pad(index + 1)}/${pad(n)}`
            }
          },
        },
      })

      window.__journeyScrollTrigger = tl.scrollTrigger ?? null

      gsap.set(panels, { clipPath: 'inset(0% 0% 0% 0%)', scale: 1 })

      tl.to(track, { x: `-${(n - 1) * 100}vw`, ease: 'none', duration: 1 }, 0)

      // `unit`, not `1/n` -- the track travels (n-1) panel-widths total, so
      // panel i is exactly centered in the viewport at progress i/(n-1),
      // not i/n. Getting this denominator wrong is what caused a real bug
      // during development: word reveals/colors were scheduled against
      // the wrong panel's on-screen window, visibly desynced from what
      // was actually in view. Each panel's "dominant on screen" window
      // spans from the boundary with its previous neighbor to the
      // boundary with its next one -- exactly one `unit` wide, half a
      // unit on either side of its own center (clamped at the ends).
      const unit = 1 / (n - 1)

      panels.forEach((panel, i) => {
        const center = i * unit
        const winStart = i === 0 ? 0 : center - unit * 0.5
        const winEnd = i === n - 1 ? 1 : center + unit * 0.5
        const winWidth = winEnd - winStart
        const split = splits[i]
        const media = panel.querySelector('.chapter-media')
        const copy = panel.querySelector('.chapter-copy')

        // Panel 0 is visible at rest -- only chapters reached by
        // scrolling need an entrance reveal, mirroring CinematicIntro.
        // Budget (stagger tail + duration) as a fixed fraction of this
        // panel's own window instead of fixed absolute numbers, so a
        // headline with more words can never push the reveal past its
        // window regardless of chapter count -- a real bug during
        // development: one long headline's stagger tail alone extended
        // the whole timeline's duration past 1, desyncing every chapter
        // scheduled after it.
        if (i > 0) {
          const revealBudget = winWidth * 0.4
          const revealDuration = revealBudget * 0.6
          const stagger =
            split.words.length > 1
              ? (revealBudget - revealDuration) / (split.words.length - 1)
              : 0
          tl.from(
            split.words,
            { opacity: 0, y: 40, stagger, duration: revealDuration, ease: 'power2.out' },
            winStart + winWidth * 0.08,
          )
        }

        // Media and copy drift at different rates across this panel's
        // own on-screen window -- the parallax depth cue. Bound by the
        // media wrapper's own overflow-hidden (media itself is oversized
        // via inset[-8%]) so the swing never reveals empty edges; copy's
        // smaller swing needs no extra bounding.
        if (media) {
          tl.fromTo(
            media,
            { xPercent: 8 },
            { xPercent: -8, ease: 'none', duration: winWidth },
            winStart,
          )
        }
        if (copy) {
          tl.fromTo(
            copy,
            { xPercent: -4 },
            { xPercent: 4, ease: 'none', duration: winWidth },
            winStart,
          )
        }

        // Tint the page to this chapter's theme as its panel becomes
        // dominant, same scrubbed timeline as everything else -- chapter
        // 0 needs no tween since it's already the document's resting
        // default.
        if (i > 0) {
          tl.to(
            document.documentElement,
            {
              '--bg': JOURNEY_CHAPTERS[i].bg,
              '--fg': JOURNEY_CHAPTERS[i].fg,
              ease: 'none',
              duration: winWidth * 0.5,
            },
            winStart,
          )
        }

        // Clip-mask + scale crossover exactly at the boundary shared by
        // this panel's window end and the next panel's window start --
        // the track is split evenly between the two there, so a wipe
        // right at that point lines up with what's actually on screen.
        // Three independent property targets (track x, word opacity/y,
        // panel clipPath/scale) on three different elements, so none of
        // these fight each other.
        if (i < n - 1) {
          const boundary = winEnd
          const crossDuration = unit * 0.25
          tl.to(
            panel,
            { clipPath: 'inset(0% 0% 100% 0%)', scale: 0.88, ease: 'power1.in', duration: crossDuration },
            boundary - crossDuration * 0.5,
          )
          tl.fromTo(
            panels[i + 1],
            { clipPath: 'inset(100% 0% 0% 0%)', scale: 1.08 },
            { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, ease: 'power1.out', duration: crossDuration },
            boundary - crossDuration * 0.5,
          )
        }
      })

      // Same freeze-leak fix as CinematicIntro: a scrubbed timeline's
      // tweened --bg/--fg values freeze at whatever they were when the
      // timeline reaches progress 1, and that frozen state otherwise
      // leaks into Contact's own crossfade further down the page.
      const last = JOURNEY_CHAPTERS[n - 1]
      tl.to(
        document.documentElement,
        { '--bg': last.bg, '--fg': last.fg, ease: 'none', duration: 0.03 },
        0.97,
      )

      return () => {
        splits.forEach((split) => split.revert())
      }
    }, containerRef)

    return () => {
      window.__journeyScrollTrigger = null
      ctx.revert()
    }
  }, [])

  return (
    <section
      id="journey"
      ref={containerRef}
      className="relative h-screen w-screen overflow-hidden bg-ink"
    >
      <div
        ref={trackRef}
        className="flex h-full"
        style={{ width: `${TOTAL_CHAPTERS * 100}vw` }}
      >
        {JOURNEY_CHAPTERS.map((chapter) => (
          <Fragment key={chapter.key}>{chapter.render()}</Fragment>
        ))}
      </div>

      <div className="pointer-events-none absolute right-8 bottom-8 z-10 md:right-16 md:bottom-16">
        <span
          ref={counterRef}
          className="font-body text-xs tracking-[0.3em] text-cream/60 tabular-nums"
        >
          01/{pad(TOTAL_CHAPTERS)}
        </span>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-px bg-cream/15">
        <div
          ref={progressRef}
          className="h-full w-full origin-left bg-cream"
          style={{ transform: 'scaleX(0)' }}
        />
      </div>
    </section>
  )
}

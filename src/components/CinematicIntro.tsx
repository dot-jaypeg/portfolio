import { useEffect, useRef } from 'react'
import { gsap, SplitText } from '../lib/gsap'

const SCENES = [
  {
    eyebrow: '01 — Intro',
    headline: 'Hello.',
    bg: '#161616',
    fg: '#fffcef',
  },
  {
    eyebrow: '02 — Craft',
    headline: 'Branding & Identity',
    bg: '#fffcef',
    fg: '#161616',
  },
  {
    eyebrow: '03 — Craft',
    headline: 'Digital & Motion',
    bg: '#fffcef',
    fg: '#161616',
  },
  {
    eyebrow: '04 — Who',
    headline: 'Jayden Ramirez',
    bg: '#161616',
    fg: '#fffcef',
  },
]

export function CinematicIntro() {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const track = trackRef.current!
      const panels = gsap.utils.toArray<HTMLElement>('.scene-panel')
      const n = panels.length

      const splits = panels.map((panel) => {
        const headline = panel.querySelector('.scene-headline')!
        return new SplitText(headline, { type: 'words' })
      })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: () => '+=' + window.innerHeight * n * 1.1,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      })

      // Duration is 1 to match the [0, 1] fractional scale used for every
      // per-scene offset below -- GSAP's default tween duration (0.5) would
      // otherwise finish the horizontal translation at the timeline's
      // halfway point, desyncing it from the word reveal/exit timings.
      //
      // Using a plain vw value (not xPercent) deliberately: xPercent is a
      // percentage of the TRACK's own width (n * 100vw), not of 100vw, so
      // "-100 * (n - 1)" would translate n times further than intended.
      tl.to(
        track,
        { x: `-${(n - 1) * 100}vw`, ease: 'none', duration: 1 },
        0,
      )

      splits.forEach((split, i) => {
        const segment = 1 / n
        const start = i * segment
        // Scene 0 is visible at rest (scroll position 0) -- only scenes
        // reached by scrolling need an entrance fade-in.
        if (i > 0) {
          tl.from(
            split.words,
            {
              opacity: 0,
              y: 40,
              stagger: 0.05,
              duration: 0.12,
              ease: 'power2.out',
            },
            start + segment * 0.15,
          )
        }
        if (i < n - 1) {
          tl.to(
            split.words,
            {
              opacity: 0,
              y: -40,
              stagger: 0.03,
              duration: 0.12,
              ease: 'power2.in',
            },
            start + segment * 0.78,
          )
        }

        // Tint the page's --bg/--fg to this scene's theme as its panel
        // slides into place, in the same scrubbed timeline as the
        // horizontal track and word reveals -- scene 0 needs no tween
        // since it's already the document's resting default.
        if (i > 0) {
          tl.to(
            document.documentElement,
            {
              '--bg': SCENES[i].bg,
              '--fg': SCENES[i].fg,
              ease: 'none',
              duration: segment * 0.5,
            },
            start,
          )
        }
      })

      return () => {
        splits.forEach((split) => split.revert())
      }
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="top"
      ref={containerRef}
      className="relative h-screen w-screen overflow-hidden bg-ink"
    >
      <div
        ref={trackRef}
        className="flex h-full"
        style={{ width: `${SCENES.length * 100}vw` }}
      >
        {SCENES.map((scene) => (
          <div
            key={scene.headline}
            className="scene-panel relative flex h-full w-screen shrink-0 flex-col justify-end p-8 md:p-16"
          >
            <span className="font-body pointer-events-none absolute inset-8 flex items-center justify-center border border-dashed border-cream/15 text-xs tracking-[0.3em] text-cream/25 uppercase md:inset-16">
              [ placeholder video ]
            </span>
            <p className="font-body text-xs tracking-[0.3em] text-cream uppercase">
              {scene.eyebrow}
            </p>
            <h2 className="scene-headline font-display mt-4 text-[13vw] leading-[0.8] font-bold tracking-tighter text-cream uppercase">
              {scene.headline}
            </h2>
          </div>
        ))}
      </div>
    </section>
  )
}

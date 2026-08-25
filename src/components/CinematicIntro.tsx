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
    bg: '#dd5547',
    fg: '#fffcef',
  },
]

const pad = (num: number) => String(num).padStart(2, '0')

export function CinematicIntro() {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const track = trackRef.current!
      const panels = gsap.utils.toArray<HTMLElement>('.scene-panel')
      const n = panels.length

      const splits = panels.map((panel) => {
        const headline = panel.querySelector('.scene-headline')!
        return new SplitText(headline, { type: 'words' })
      })

      // `unit`, not `1/n` -- see the positioning comment below. Declared
      // early since colorAtProgress needs it too.
      const unit = 1 / (n - 1)

      // Colors are computed and applied here in onUpdate rather than as
      // tweens living inside the pinned timeline below -- a real bug
      // found this session (originally fixed in Journey, then found to
      // also affect this component): a pinned ScrollTrigger keeps
      // getting told to re-render on every scroll tick indefinitely,
      // long after scrolling past its own end. With color tweens living
      // inside the timeline, every one of those redundant re-renders
      // re-wrote --bg/--fg -- confirmed here directly: even after
      // Journey's own onUpdate correctly set About's cream, this
      // component's leftover reset tween (ink/cream, targeting Work's
      // colors) kept firing afterward and silently overwrote it, purely
      // because it happened to render on a later tick. Computing the
      // color here and skipping the write whenever it hasn't actually
      // changed means this component stops touching these properties at
      // all once truly settled, leaving whatever comes after it
      // uncontested.
      let lastColorKey = ''
      const colorAtProgress = (progress: number) => {
        const i = Math.round(progress * (n - 1))
        if (i === 0) return SCENES[0]
        const center = i * unit
        const winStart = center - unit * 0.5
        const t = gsap.utils.clamp(0, 1, (progress - winStart) / (unit * 0.5))
        const prev = SCENES[i - 1]
        const curr = SCENES[i]
        return {
          bg: gsap.utils.interpolate(prev.bg, curr.bg, t),
          fg: gsap.utils.interpolate(prev.fg, curr.fg, t),
        }
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: () => '+=' + window.innerHeight * n * 1.1,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            // Driven straight off ScrollTrigger's own progress rather than
            // React state -- this fires every scroll tick, so a re-render
            // per frame would be wasteful; direct DOM writes match the
            // quickTo pattern already used for the cursor elsewhere.
            if (progressRef.current) {
              progressRef.current.style.transform = `scaleX(${self.progress})`
            }
            if (counterRef.current) {
              // Scene i is centered at progress i/(n-1), not i/n -- the
              // track travels (n-1) panel-widths total, so rounding to
              // the nearest i/(n-1) gives whichever scene is actually
              // dominant on screen right now.
              const index = Math.round(self.progress * (n - 1))
              counterRef.current.textContent = `${pad(index + 1)}/${pad(n)}`
            }
            const { bg, fg } = colorAtProgress(self.progress)
            const key = bg + fg
            if (key !== lastColorKey) {
              lastColorKey = key
              gsap.set(document.documentElement, { '--bg': bg, '--fg': fg })
            }
          },
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
        const center = i * unit
        const winStart = i === 0 ? 0 : center - unit * 0.5
        const winEnd = i === n - 1 ? 1 : center + unit * 0.5
        const winWidth = winEnd - winStart

        // Scene 0 is visible at rest (scroll position 0) -- only scenes
        // reached by scrolling need an entrance fade-in.
        //
        // Budget (stagger tail + duration) as a fraction of this scene's
        // own window instead of fixed absolute numbers -- a real bug:
        // with a fixed stagger of 0.05 and duration of 0.12, a 3-word
        // headline's last word didn't finish fading in (entrance starts
        // staggered at +0.10 into its own 0.12-long tween, so it doesn't
        // complete until +0.22) until AFTER the exit fade had already
        // started pulling it back out again -- the last word of every
        // multi-word "craft" scene never fully appeared before fading
        // back out, reading as the headline being cut off mid-reveal.
        // Sizing both budgets off the window, regardless of word count,
        // guarantees entrance always finishes well before exit begins.
        if (i > 0) {
          const entryBudget = winWidth * 0.25
          const entryDuration = entryBudget * 0.6
          const entryStagger =
            split.words.length > 1
              ? (entryBudget - entryDuration) / (split.words.length - 1)
              : 0
          tl.from(
            split.words,
            {
              opacity: 0,
              y: 40,
              stagger: entryStagger,
              duration: entryDuration,
              ease: 'power2.out',
            },
            winStart + winWidth * 0.1,
          )
        }
        if (i < n - 1) {
          const exitBudget = winWidth * 0.25
          const exitDuration = exitBudget * 0.6
          const exitStagger =
            split.words.length > 1
              ? (exitBudget - exitDuration) / (split.words.length - 1)
              : 0
          tl.to(
            split.words,
            {
              opacity: 0,
              y: -40,
              stagger: exitStagger,
              duration: exitDuration,
              ease: 'power2.in',
            },
            winStart + winWidth * 0.65,
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

      <div className="pointer-events-none absolute right-8 bottom-8 z-10 md:right-16 md:bottom-16">
        <span
          ref={counterRef}
          className="font-body text-xs tracking-[0.3em] text-cream/60 tabular-nums"
        >
          01/{pad(SCENES.length)}
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

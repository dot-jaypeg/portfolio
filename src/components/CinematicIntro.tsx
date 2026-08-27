import { useEffect, useRef } from 'react'
import { gsap, SplitText } from '../lib/gsap'
import introPhoto from '../assets/images/intro/IMG_8143.jpg'

export const SCENES = [
  {
    eyebrow: '01 — Intro',
    headline: 'Hello.',
    bg: '#161616',
    fg: '#fffff0',
  },
  {
    eyebrow: '02 — Expertise',
    headline: 'Branding & Identity',
    bg: '#fffff0',
    fg: '#161616',
  },
  {
    eyebrow: '03 — Expertise',
    headline: 'Digital & Motion',
    bg: '#fffff0',
    fg: '#161616',
  },
  {
    eyebrow: '04 — Who',
    headline: 'Jayden Ramirez',
    bg: '#dd5547',
    fg: '#fffff0',
  },
]

export function CinematicIntro() {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const maskRef = useRef<HTMLDivElement>(null)

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
      // Same fix as JourneyDesktop's colorAtProgress: fading color over
      // a full half-unit window read as laggy and disconnected from the
      // actual scroll -- text for the next scene was already fully
      // revealed while the background was still slowly catching up well
      // after. A quarter-unit window centered on the scene boundary (the
      // same proportion the word-reveal budgets already use below) keeps
      // the color settled by the time the new scene's headline arrives.
      const crossDuration = unit * 0.25
      let lastColorKey = ''
      const colorAtProgress = (progress: number) => {
        const i = Math.round(progress * (n - 1))
        if (i === 0) return SCENES[0]
        const boundary = (i - 1) * unit + unit * 0.5
        const t = gsap.utils.clamp(
          0,
          1,
          (progress - (boundary - crossDuration * 0.5)) / crossDuration,
        )
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

            // `scrub: 1` eases self.progress toward a big instant scroll
            // jump over about a second instead of snapping to it -- a nav
            // click straight to Work jumps the real scroll past this
            // trigger's own end in one tick, but self.progress still has
            // to visibly animate 0 -> 1 to catch up, firing onUpdate
            // repeatedly along the way and landing on scene 3's red well
            // after JourneyDesktop's own trigger (which barely had to
            // move) already set the correct ink. self.scroll() is the
            // REAL scroll position, not the still-easing progress --
            // comparing it against this trigger's own end catches "we've
            // already scrolled past this component entirely" and skips
            // writing colors at all once that's true. (The remaining gap
            // between this trigger's own end and where Journey's pin
            // actually starts -- the pin-spacer also reserves this
            // section's own natural height, on top of the scrub distance
            // -- is filled by its own dedicated crossfade in
            // useSectionColors, since this trigger's onUpdate never fires
            // there at all: self.progress is pinned at exactly 1 for that
            // whole stretch, so GSAP has no reason to call it.)
            if (self.scroll() > self.end) return
            const { bg, fg } = colorAtProgress(self.progress)
            // Fixed red ONLY over scene 0's own window ("Hello.", the one
            // scene with a busy photo behind it) -- NOT the whole
            // component. Scene 3 ("Jayden Ramirez") has a red *background*
            // of its own, so pinning nav red across all four scenes would
            // have recreated the exact red-on-red invisibility bug this
            // is meant to fix, just one scene later. Every other scene
            // (1, 2, 3) tracks --fg like body copy does everywhere else.
            const isFirstScene = Math.round(self.progress * (n - 1)) === 0
            const navFg = isFirstScene ? '#dd5547' : fg
            const key = bg + fg + navFg
            if (key !== lastColorKey) {
              lastColorKey = key
              gsap.set(document.documentElement, {
                '--bg': bg,
                '--fg': fg,
                '--nav-fg': navFg,
              })
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

      // A mask sweep for the Hello -> Branding boundary specifically
      // (scene 0 -> 1), after the Le Mans Classic reference. This is a
      // SEPARATE element living outside `trackRef` (a sibling, not a
      // child), animated with its own independent xPercent tween --
      // NOT a clip-path on the scene panels themselves. Clipping the
      // panels directly was tried for an analogous boundary in Journey
      // and caused a real bug: the panels are ALSO continuously
      // translated by the track's own x tween above, and a clip-path
      // keyed to each panel's own local coordinates fights that
      // translation, opening a visible gap where neither panel's
      // clipped region actually covers the screen. A standalone
      // full-viewport panel that just slides across independently
      // sidesteps that entirely, while leaving the existing media
      // swing and word entrance/exit animations on the scenes
      // untouched underneath it.
      if (maskRef.current) {
        const maskBoundary = 0.5 * unit // scene 0/1 boundary, matches colorAtProgress's own
        tl.fromTo(
          maskRef.current,
          { xPercent: 100 },
          { xPercent: -100, ease: 'power2.inOut', duration: crossDuration },
          maskBoundary - crossDuration * 0.5,
        )
      }

      splits.forEach((split, i) => {
        const center = i * unit
        const winStart = i === 0 ? 0 : center - unit * 0.5
        const winEnd = i === n - 1 ? 1 : center + unit * 0.5
        const winWidth = winEnd - winStart

        // Same depth-cue swing JourneyDesktop gives its own chapter media,
        // scaled to whatever this element's own CSS oversize can safely
        // hide (see the `data-parallax-amount` comment in JourneyDesktop
        // for why that amount isn't just a flat default for every image).
        const media = panels[i].querySelector('.scene-media')
        if (media) {
          const amount = Number(media.getAttribute('data-parallax-amount')) || 6
          tl.fromTo(
            media,
            { xPercent: amount },
            { xPercent: -amount, ease: 'none', duration: winWidth },
            winStart,
          )
        }

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
      {/* A sibling of the track, not a child -- this must NOT ride along
          with the track's own horizontal x tween, since its whole job is
          to move independently across the fixed viewport. No inline
          transform here -- GSAP's fromTo() already renders its "from"
          state immediately on creation (before first paint), and a real
          bug came from trying to pre-empt that: setting a plain
          `transform: translateX(100%)` inline gets parsed by GSAP as a
          separate fixed pixel offset the first time it touches this
          element, and xPercent then ADDS on top of that residual offset
          instead of replacing it -- confirmed directly (computed
          transform matrix showed 2880px at rest and 0px at the "end"
          instead of the intended 1440px and -1440px), which is why the
          mask looked stuck covering the screen instead of sweeping
          off-screen left. */}
      <div
        ref={maskRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[8]"
        style={{ backgroundColor: SCENES[1].bg }}
      />
      <div
        ref={trackRef}
        className="flex h-full"
        style={{ width: `${SCENES.length * 100}vw` }}
      >
        {SCENES.map((scene, i) => (
          <div
            key={scene.headline}
            className="scene-panel relative flex h-full w-screen shrink-0 flex-col justify-end overflow-hidden p-8 md:p-16"
          >
            {i === 0 ? (
              // Negative inset cancels the panel's own padding so the
              // photo reads as a true full-bleed hero shot instead of a
              // framed box floating inside a margin -- the overflow-hidden
              // here (not just the one on scene-panel) is what lets the
              // oversized, parallax-driven image inside it swing without
              // ever revealing its own edges.
              <div className="absolute -inset-8 overflow-hidden md:-inset-16">
                {/* `max-w-none` is required, not decorative -- Tailwind's
                    preflight sets `img { max-width: 100% }`, which
                    silently caps this element's WIDTH at 100% regardless
                    of the 112% utility (height isn't affected, since
                    preflight only overrides max-width, not max-height).
                    Without it the swing has zero real horizontal bleed
                    margin and reveals a gap on one side. */}
                <img
                  src={introPhoto}
                  alt="Jayden Ramirez"
                  data-parallax-amount="6"
                  className="scene-media pointer-events-none absolute inset-[-6%] h-[112%] w-[112%] max-w-none object-cover"
                />
                {/* Bottom scrim purely for the eyebrow/headline's own
                    legibility against a busy photo -- independent of the
                    fixed red nav-fg pin above, which solves a different
                    problem (nav contrast against the page-wide red bg). */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />
              </div>
            ) : (
              <span className="font-body pointer-events-none absolute inset-8 flex items-center justify-center border border-dashed border-cream/15 text-xs tracking-[0.22em] text-cream/25 uppercase md:inset-16">
                [ placeholder video ]
              </span>
            )}
            <p className="font-body text-xs tracking-[0.22em] text-cream uppercase">
              {scene.eyebrow}
            </p>
            <h2 className="scene-headline font-display mt-4 text-[13vw] leading-[0.8] font-bold tracking-[-0.06em] text-cream uppercase">
              {scene.headline}
            </h2>
          </div>
        ))}
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

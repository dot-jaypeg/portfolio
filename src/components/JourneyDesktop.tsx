import { Fragment, useEffect, useRef } from 'react'
import { gsap, SplitText } from '../lib/gsap'
import { JOURNEY_CHAPTERS, TOTAL_CHAPTERS, WORK_COUNT } from '../data/journeyChapters'

export function JourneyDesktop() {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

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

      // Colors are computed and applied here in onUpdate rather than as
      // tweens living inside the pinned timeline below -- a real bug
      // during development: a pinned ScrollTrigger keeps getting told to
      // re-render on every scroll tick indefinitely, long after scrolling
      // past its own end (confirmed empirically: it kept firing 100+
      // times while sitting still at the bottom of the page, vs. a
      // plain non-pinned trigger which correctly goes quiet once past
      // its end). With color tweens living inside that timeline, every
      // one of those redundant re-renders re-wrote --bg/--fg, which
      // could stomp Contact's own independent, already-correct crossfade
      // right after it finished, purely because Journey's stale
      // re-assertion happened to land on a later tick. Computing the
      // color here and skipping the write whenever it hasn't actually
      // changed means Journey stops touching these properties at all
      // once truly settled, leaving Contact's own trigger uncontested.
      let lastColorKey = ''
      const colorAtProgress = (progress: number) => {
        const i = Math.round(progress * (n - 1))
        if (i === 0) return JOURNEY_CHAPTERS[0]
        const center = i * unit
        const winStart = center - unit * 0.5
        const t = gsap.utils.clamp(0, 1, (progress - winStart) / (unit * 0.5))
        const prev = JOURNEY_CHAPTERS[i - 1]
        const curr = JOURNEY_CHAPTERS[i]
        return {
          bg: gsap.utils.interpolate(prev.bg, curr.bg, t),
          fg: gsap.utils.interpolate(prev.fg, curr.fg, t),
        }
      }

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
            const { bg, fg } = colorAtProgress(self.progress)
            const key = bg + fg
            if (key !== lastColorKey) {
              lastColorKey = key
              // --nav-fg mirrors --fg here (unlike CinematicIntro, which
              // pins it to a fixed red) -- past the intro's own photo,
              // nav should just read as body copy again.
              gsap.set(document.documentElement, { '--bg': bg, '--fg': fg, '--nav-fg': fg })
            }
          },
        },
      })

      window.__journeyScrollTrigger = tl.scrollTrigger ?? null

      gsap.set(panels, { clipPath: 'inset(0% 0% 0% 0%)', scale: 1 })

      tl.to(track, { x: `-${(n - 1) * 100}vw`, ease: 'none', duration: 1 }, 0)

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
        //
        // The swing amount is configurable per-element via
        // `data-parallax-amount` (defaulting to the original 8) -- a
        // real photo's meaningful content (a face, decorative stickers
        // near the corners) can sit much closer to its own edges than
        // an abstract placeholder box ever does, so the oversize this
        // swing needs to stay gap-free can end up clipping into real
        // content unless that specific element's swing (and matching
        // CSS oversize) is dialed down to fit how much safe margin it
        // actually has.
        if (media) {
          const amount = Number(media.getAttribute('data-parallax-amount')) || 8
          tl.fromTo(
            media,
            { xPercent: amount },
            { xPercent: -amount, ease: 'none', duration: winWidth },
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

      // Slow auto-advance through the Work chapters only, with manual
      // scroll always taking priority: any real scroll/touch/keyboard
      // input pauses it, and it resumes on its own after a quiet moment.
      // Listening for raw input events (not Lenis's own 'scroll' event)
      // is what lets this tell "the user just did something" apart from
      // "this auto-advance loop just moved the page itself" -- the
      // latter would otherwise immediately re-pause itself every tick.
      const AUTO_SPEED = 75 // px/s, slow and readable
      const RESUME_DELAY = 1800 // ms of quiet before auto-advance resumes
      const workEndOffset = () => {
        const st = tl.scrollTrigger
        if (!st) return null
        return st.start + ((WORK_COUNT - 1) / (n - 1)) * (st.end - st.start)
      }
      let lastInputTime = 0
      let lastTickTime: number | null = null
      const markManualInput = () => {
        lastInputTime = performance.now()
      }
      window.addEventListener('wheel', markManualInput, { passive: true })
      window.addEventListener('touchstart', markManualInput, { passive: true })
      window.addEventListener('touchmove', markManualInput, { passive: true })
      window.addEventListener('keydown', markManualInput)
      // Nav and ChaptersMenu both jump via an EASED (non-immediate)
      // lenis.scrollTo -- a real bug: raw wheel/touch/keydown listeners
      // can't see those, so auto-advance had no idea a real navigation
      // was in flight and kept calling its own immediate scrollTo every
      // tick, which stomped the eased jump before it could finish.
      // Clicking "About" while auto-advance was running didn't actually
      // navigate anywhere -- confirmed directly, the click landed you
      // right back in a slow crawl through Work instead. Exposing this
      // so those components can pause it too.
      window.__markAutoAdvanceInput = markManualInput

      // Tracked as our own float, not read back from window.scrollY --
      // a real bug: each tick's nudge is sub-pixel (a few tenths of a
      // pixel at 45px/s and a ~60fps tick rate), and window.scrollY is
      // always a rounded integer, so re-deriving the next target from
      // it every tick rounded the fractional progress away before it
      // could accumulate -- the loop looked like it was running (all
      // its guards passed) but the page never actually moved. Keeping
      // our own precise running position and only syncing it forward
      // when the real scroll position gets ahead of it (first
      // activation, or the user manually scrolled further) fixes that.
      let virtualScrollY: number | null = null
      const autoAdvanceTick = () => {
        const now = performance.now()
        const dt = lastTickTime == null ? 0 : (now - lastTickTime) / 1000
        lastTickTime = now
        if (dt <= 0 || dt > 0.5) return
        if (window.__chaptersMenuOpen) return
        if (now - lastInputTime < RESUME_DELAY) return
        const st = tl.scrollTrigger
        const endOffset = workEndOffset()
        if (!st || endOffset == null) return
        const scrollY = window.scrollY
        if (scrollY < st.start || scrollY >= endOffset) {
          virtualScrollY = null
          return
        }
        if (virtualScrollY == null || virtualScrollY < scrollY) {
          virtualScrollY = scrollY
        }
        virtualScrollY = Math.min(endOffset, virtualScrollY + AUTO_SPEED * dt)
        window.__lenis?.scrollTo(virtualScrollY, { immediate: true })
      }
      gsap.ticker.add(autoAdvanceTick)

      return () => {
        splits.forEach((split) => split.revert())
        gsap.ticker.remove(autoAdvanceTick)
        window.removeEventListener('wheel', markManualInput)
        window.removeEventListener('touchstart', markManualInput)
        window.removeEventListener('touchmove', markManualInput)
        window.removeEventListener('keydown', markManualInput)
        window.__markAutoAdvanceInput = undefined
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

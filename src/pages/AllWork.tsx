import { useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react'
import { Link } from 'react-router-dom'
import { CASE_STUDIES } from '../data/caseStudies'
import { Cursor } from '../components/Cursor'
import { Grain } from '../components/Grain'
import { useMaskNavigate } from '../hooks/useMaskNavigate'
import { getChapterScrollOffset } from '../lib/journeyScroll'
import { gsap, Flip } from '../lib/gsap'

const pad = (num: number) => String(num).padStart(2, '0')

// Filmstrip/accordion gallery -- every case study (including the still-
// placeholder 06-10 entries the featured Journey chapters skip) as one
// row of strips, all visible at once, with the active/expanded one
// growing via an animated `flex` value rather than a real width change.
// `div`, not `button`, for each strip -- the active one needs its own
// real <button> nested inside for "next", and interactive elements
// can't nest.
//
// The actual width transition isn't CSS anymore -- see `AllWork`'s
// GSAP Flip setup below. Letting the browser's own CSS transition
// interpolate `flex`/`min-width` directly means a real layout reflow
// AND a fresh image repaint on every one of the 10 strips, every
// single frame, which is what made this feel janky instead of smooth.
function Strip({
  cs,
  index,
  isActive,
  isHovered,
  onSelect,
  onHoverStart,
  onHoverEnd,
}: {
  cs: (typeof CASE_STUDIES)[number]
  index: number
  isActive: boolean
  isHovered: boolean
  onSelect: () => void
  onHoverStart: () => void
  onHoverEnd: () => void
}) {
  // Hovering widens a strip and shows its photo fully, the same way
  // clicking does.
  const expanded = isActive || isHovered

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelect()
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      data-cursor={isActive ? undefined : 'View'}
      style={{
        flex: expanded ? '8 8 0%' : '1 1 0%',
        minWidth: expanded ? 280 : 56,
      }}
      className="group relative h-full shrink-0 cursor-pointer overflow-hidden border-r border-cream/10 text-left last:border-r-0 focus-visible:outline-none"
    >
      {cs.image ? (
        <img
          src={cs.image}
          alt={cs.title}
          className="pointer-events-none absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          style={{ objectPosition: cs.imagePosition ?? 'center' }}
        />
      ) : (
        <div className="font-body pointer-events-none absolute inset-4 flex items-center justify-center border border-dashed border-cream/15 text-center text-[10px] tracking-[0.22em] text-cream/25 uppercase">
          [ placeholder image ]
        </div>
      )}
      <div
        className={`pointer-events-none absolute inset-0 bg-ink transition-opacity duration-500 ${
          expanded ? 'opacity-0' : 'opacity-55 group-hover:opacity-25'
        }`}
      />
      {/* The collapsed-state dark overlay above is what kept the number
          badge below legible -- switching it off once active to actually
          show the photo left that badge with no guaranteed dark ground
          under it, and against a bright/busy photo (sky, foliage) it
          disappeared entirely. This top scrim (active only) replaces
          just that, now that the title/category caption itself lives in
          a page-level overlay (below in AllWork) instead of inside each
          strip -- see AllWork for why. */}
      {isActive && (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/50 to-transparent" />
      )}

      {/* top-20, not top-6 -- the fixed header's logo/[Back] links sit
          in these exact corners, and this label collided directly with
          "[Back]" for whichever strip happens to be rightmost. */}
      <span className="font-body pointer-events-none absolute top-20 left-6 text-xs tracking-[0.22em] text-cream/70 uppercase">
        {pad(index + 1)}
      </span>

      {!isActive && (
        <span className="font-body pointer-events-none absolute bottom-6 left-6 origin-bottom-left translate-y-0 [writing-mode:vertical-rl] whitespace-nowrap text-xs tracking-[0.3em] text-cream/70 uppercase">
          {cs.title}
        </span>
      )}

    </div>
  )
}

export function AllWork() {
  const [active, setActive] = useState(0)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const rowRef = useRef<HTMLDivElement>(null)
  const flipStateRef = useRef<ReturnType<typeof Flip.getState> | null>(null)

  // Captures the row's current layout BEFORE an active/hover change, so
  // the effect below can hand it to Flip.from, which fakes the same
  // visual width transition using transforms (scaleX + translateX)
  // instead of letting the browser interpolate `flex`/`min-width`
  // directly -- that's what made this smooth instead of janky.
  const captureFlip = () => {
    if (rowRef.current) {
      flipStateRef.current = Flip.getState(Array.from(rowRef.current.children))
    }
  }

  // Runs AFTER React has already committed the new flex/min-width
  // values (useLayoutEffect, not useEffect, so it fires before the
  // browser paints the "snapped" end state) -- Flip.from reads the
  // elements' now-current geometry, compares it to what captureFlip
  // saved, and animates from the old to the new.
  useLayoutEffect(() => {
    if (!flipStateRef.current) return
    Flip.from(flipStateRef.current, {
      duration: 0.7,
      ease: 'power3.inOut',
      // Each strip sizes itself via `flex: N N 0%` -- an explicit
      // flex-basis, which always wins over a plain `width` property.
      // Flip's default technique fakes a size change by tweening an
      // inline width/height, so without `scale: true` that injected
      // width gets silently overridden by flex-basis: the strip snaps
      // to its final size instantly and only a position correction
      // (translateX) actually animates, which is what read as janky.
      // scaleX/scaleY transforms work regardless of the sizing model.
      scale: true,
      // A strip's scaleX transform stretches its full-bleed <img> right
      // along with it. Pre-computing one inverse counter-scale up front
      // (e.g. via Flip's own nested-state handling) doesn't actually
      // cancel this: the parent's scale and a counter-tween both ease
      // independently over the same 0.7s, and lerp(a,b,t) * lerp(1/a,
      // 1/b,t) isn't 1 for any t strictly between 0 and 1 -- so the
      // photo still visibly warped mid-transition. Recomputing the
      // exact reciprocal every frame from the strip's own live,
      // already-eased scaleX is the only way to keep the two multiplying
      // out to 1 at every instant, not just at the start and end.
      //
      // The <img> itself also carries its own `transition-transform
      // duration-700` class (for the unrelated group-hover:scale-105
      // zoom) -- a CSS transition applies to ANY change in `transform`,
      // including these inline per-frame gsap.set calls, so without
      // overriding it to `none` here the browser was smoothing/lagging
      // every one of these ~60fps counter-scale updates over its own
      // 700ms curve, which was the actual source of the warped look
      // (not the counter-scale math, which was already correct).
      onStart: () => {
        if (!rowRef.current) return
        for (const strip of rowRef.current.children) {
          const img = strip.querySelector('img')
          if (img) img.style.transition = 'none'
        }
      },
      onUpdate: () => {
        if (!rowRef.current) return
        for (const strip of rowRef.current.children) {
          const img = strip.querySelector('img')
          if (!img) continue
          const scaleX = Number(gsap.getProperty(strip, 'scaleX'))
          const scaleY = Number(gsap.getProperty(strip, 'scaleY'))
          gsap.set(img, { scaleX: 1 / scaleX, scaleY: 1 / scaleY })
        }
      },
      onComplete: () => {
        if (!rowRef.current) return
        for (const strip of rowRef.current.children) {
          const img = strip.querySelector('img')
          if (img) img.style.transition = ''
        }
      },
    })
    flipStateRef.current = null
  }, [active, hoveredIndex])

  const selectStrip = (i: number) => {
    captureFlip()
    setActive(i)
  }
  const advanceStrip = () => {
    captureFlip()
    setActive((a) => (a + 1) % CASE_STUDIES.length)
  }
  const hoverStrip = (i: number | null) => {
    captureFlip()
    setHoveredIndex(i)
  }

  // The title/category/Next caption used to live inside each Strip,
  // positioned relative to that strip's own box -- so it physically
  // appeared wherever the active strip happened to sit in the row (far
  // left for project 1, far right for project 10). Rendering it once
  // here instead, pinned to a fixed spot on the page, makes it reveal
  // in the same place no matter which project is active.
  const activeCaseStudy = CASE_STUDIES[active]
  const accent = activeCaseStudy.accent ?? '#618c82'
  const captionRef = useRef<HTMLDivElement>(null)

  // Crossfades the caption on every active change instead of letting it
  // just snap to the new project's text mid-Flip.
  useLayoutEffect(() => {
    if (!captionRef.current) return
    gsap.fromTo(
      captionRef.current,
      { autoAlpha: 0, y: 8 },
      { autoAlpha: 1, y: 0, duration: 0.5, delay: 0.15, ease: 'power2.out' },
    )
  }, [active])

  const maskNavigate = useMaskNavigate()
  // Same curtain-wipe transition as the homepage's own Nav jumps, so
  // leaving this page feels consistent with arriving at it -- without
  // this, a plain Link back to "/" would swap instantly while the
  // outward trip (from Nav's "Work" link) covers/uncovers smoothly.
  const goHome = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    maskNavigate('/')
  }
  // "Back" specifically returns to the Work section, not just the top
  // of the homepage -- a fresh "/" mount always replays the Preloader
  // splash + CinematicIntro from scratch, so the Journey chapter this
  // needs to scroll to isn't ready the instant navigate() returns.
  // Polling (rAF, no existing wait-loop utility in this codebase to
  // reuse) for both the chapter offset AND the Preloader having
  // actually finished (body's scroll lock lifting) is what makes this
  // land correctly instead of firing into a half-initialized page.
  const goBackToWork = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    maskNavigate('/', () => {
      const tryScroll = () => {
        const offset = getChapterScrollOffset(0)
        const preloaderDone = document.body.style.overflow !== 'hidden'
        if (offset != null && preloaderDone) {
          window.__lenis?.scrollTo(offset, { immediate: true })
        } else {
          requestAnimationFrame(tryScroll)
        }
      }
      requestAnimationFrame(tryScroll)
    })
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-ink">
      <Cursor />
      <Grain />

      <header className="fixed inset-x-0 top-0 z-20 flex items-center justify-between px-6 py-6 md:px-10">
        <Link
          to="/"
          onClick={goHome}
          data-cursor="Home"
          className="font-display text-2xl font-bold tracking-[-0.06em] text-cream italic md:text-3xl"
        >
          .jaypeg
        </Link>
        <Link
          to="/"
          onClick={goBackToWork}
          className="font-body text-xs tracking-[0.22em] text-cream/60 uppercase transition-colors hover:text-cream"
        >
          [Back]
        </Link>
      </header>

      {/* overflow-x-auto, not hidden -- each strip's own min-width (56px
          idle, 280px active) can add up to more than the viewport on a
          narrow phone with 10 strips; letting the row scroll instead of
          forcing everything to fit is what keeps idle strips from being
          crushed down to unreadable slivers there. On desktop the row
          already fits with room to spare, so this is a no-op. */}
      <div ref={rowRef} className="flex h-full w-full overflow-x-auto">
        {CASE_STUDIES.map((cs, i) => (
          <Strip
            key={cs.slug}
            cs={cs}
            index={i}
            isActive={i === active}
            isHovered={i === hoveredIndex}
            onSelect={() => selectStrip(i)}
            onHoverStart={() => hoverStrip(i)}
            onHoverEnd={() => hoverStrip(null)}
          />
        ))}
      </div>

      {/* Page-level caption, fixed to the same spot regardless of which
          strip is active -- see the comment above `activeCaseStudy`. */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-10 h-56 bg-gradient-to-t from-black/85 via-black/20 to-transparent md:h-64" />
      <div
        ref={captionRef}
        className="pointer-events-none fixed inset-x-6 bottom-8 z-10 md:inset-x-10 md:bottom-12"
      >
        <p
          style={{ color: accent }}
          className="font-body mb-3 flex items-center gap-2 text-xs tracking-[0.22em] uppercase"
        >
          <span style={{ backgroundColor: accent }} className="h-px w-6" />
          {activeCaseStudy.category.split('//')[0].trim()}
        </p>
        <h2 className="font-display text-[6vw] leading-[0.9] font-bold tracking-[-0.04em] text-cream uppercase md:text-[3vw]">
          {activeCaseStudy.title}
        </h2>
        <p className="font-body mt-3 text-xs tracking-[0.14em] text-cream/60 uppercase">
          {activeCaseStudy.client}
        </p>
        <button
          type="button"
          onClick={advanceStrip}
          aria-label="Next project"
          data-cursor="Next"
          className="pointer-events-auto absolute right-0 -bottom-1 flex h-10 w-10 items-center justify-center border border-cream/20 text-cream transition-colors hover:border-teal hover:text-teal md:h-12 md:w-12"
        >
          →
        </button>
      </div>
    </div>
  )
}

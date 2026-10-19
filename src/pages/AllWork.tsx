import { useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react'
import { CASE_STUDIES } from '../data/caseStudies'
import { Cursor } from '../components/Cursor'
import { Grain } from '../components/Grain'
import { Nav } from '../components/Nav'
import { gsap, Flip } from '../lib/gsap'

const pad = (num: number) => String(num).padStart(2, '0')

// Filmstrip/accordion gallery -- every case study (including the still-
// placeholder 06-10 entries the featured Journey chapters skip) as one
// row of strips, all visible at once, with the expanded one growing via
// an animated `flex` value rather than a real width change. `div`, not
// `button`, for each strip -- the expanded one needs its own real
// <button> nested inside for "next", and interactive elements can't
// nest.
//
// The actual width transition isn't CSS anymore -- see `AllWork`'s
// GSAP Flip setup below. Letting the browser's own CSS transition
// interpolate `flex`/`min-width` directly means a real layout reflow
// AND a fresh image repaint on every one of the 10 strips, every
// single frame, which is what made this feel janky instead of smooth.
function Strip({
  cs,
  index,
  isExpanded,
  onSelect,
  onNext,
  onHoverStart,
  onHoverEnd,
}: {
  cs: (typeof CASE_STUDIES)[number]
  index: number
  isExpanded: boolean
  onSelect: () => void
  onNext: () => void
  onHoverStart: () => void
  onHoverEnd: () => void
}) {
  // Each case study's own brand color, same field/fallback WorkPanel
  // uses on the homepage -- color-coordinating the category label here
  // too instead of a flat site-wide teal.
  const accent = cs.accent ?? '#618c82'

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
      data-cursor={isExpanded ? undefined : 'View'}
      style={{
        flex: isExpanded ? '8 8 0%' : '1 1 0%',
        minWidth: isExpanded ? 280 : 56,
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
          isExpanded ? 'opacity-0' : 'opacity-55 group-hover:opacity-25'
        }`}
      />
      {/* The collapsed-state dark overlay above is what kept its own text
          legible -- switching it off once expanded to actually show the
          photo left this copy block sitting directly on top of whatever
          the image's own content is, unreadable against a busy shot
          like the stickers. A dedicated bottom scrim (expanded only)
          fixes that without dimming the photo everywhere else. */}
      {isExpanded && (
        <>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
          {/* Light top scrim too -- the number badge (top-20) has no
              guaranteed dark ground under it now that the expanded
              panel's full-strength overlay is off, and against a
              bright/busy photo (sky, foliage) it disappeared entirely. */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/50 to-transparent" />
        </>
      )}

      {/* top-20, not top-6 -- the fixed Nav sits in these exact corners,
          and this label collided directly with its links for whichever
          strip happens to be leftmost/rightmost. */}
      <span className="font-body pointer-events-none absolute top-20 left-6 text-xs tracking-[0.22em] text-cream/70 uppercase">
        {pad(index + 1)}
      </span>

      {/* Every collapsed strip shows its own title at once -- this is
          safe (no overlap) specifically because only ONE strip is ever
          expanded at a time, and the caption below only ever renders
          inside THAT strip's own box, never spilling into any other
          strip's column. */}
      {!isExpanded && (
        <span className="font-body pointer-events-none absolute bottom-6 left-6 origin-bottom-left translate-y-0 [writing-mode:vertical-rl] whitespace-nowrap text-xs tracking-[0.3em] text-cream/70 uppercase">
          {cs.title}
        </span>
      )}

      {isExpanded && (
        <div className="pointer-events-none absolute inset-x-6 bottom-8 flex items-center justify-between gap-6 md:inset-x-10 md:bottom-12">
          <div>
            <p
              style={{ color: accent }}
              className="font-body mb-3 flex items-center gap-2 text-xs tracking-[0.22em] uppercase"
            >
              <span style={{ backgroundColor: accent }} className="h-px w-6" />
              {cs.category.split('//')[0].trim()}
            </p>
            <h2 className="font-display text-[6vw] leading-[0.9] font-bold tracking-[-0.04em] text-cream uppercase md:text-[3vw]">
              {cs.title}
            </h2>
            <p className="font-body mt-3 text-xs tracking-[0.14em] text-cream/60 uppercase">
              {cs.client}
            </p>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onNext()
            }}
            aria-label="Next project"
            data-cursor="Next"
            className="pointer-events-auto flex h-10 w-10 shrink-0 items-center justify-center border border-cream/20 text-cream transition-colors hover:border-teal hover:text-teal md:h-12 md:w-12"
          >
            →
          </button>
        </div>
      )}
    </div>
  )
}

export function AllWork() {
  // No project is active by default -- matching the reference accordion
  // (5blox's portfolio widget), every strip starts at equal width with
  // no caption at all, and ONLY hovering ever expands one. `active` only
  // exists as a pin for interactions that can't hover at all (a tap on
  // touch, Enter/Space on keyboard) -- it holds a strip open after that
  // interaction so its caption/Next button stay usable, but a live
  // hover always takes priority over it (see `expandedIndex`).
  const [active, setActive] = useState<number | null>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const expandedIndex = hoveredIndex ?? active
  const rowRef = useRef<HTMLDivElement>(null)
  const flipStateRef = useRef<ReturnType<typeof Flip.getState> | null>(null)

  // Captures the row's current layout BEFORE an expanded-index change,
  // so the effect below can hand it to Flip.from, which fakes the same
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
  }, [expandedIndex])

  const selectStrip = (i: number) => {
    captureFlip()
    setActive(i)
  }
  // Advances from whichever strip is CURRENTLY shown (hover or pin,
  // whichever `expandedIndex` resolves to), not just the pinned
  // `active` value -- the button only ever renders inside that strip,
  // so "next" has to mean next-from-there. Clearing hoveredIndex
  // matters too: the click doesn't move the mouse, so without this the
  // stale hover would keep outranking the new pin in `expandedIndex`
  // and the strip would never visibly advance until the mouse moved.
  const advanceStrip = () => {
    captureFlip()
    const next = ((expandedIndex ?? -1) + 1) % CASE_STUDIES.length
    setHoveredIndex(null)
    setActive(next)
  }
  const hoverStrip = (i: number | null) => {
    captureFlip()
    setHoveredIndex(i)
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-ink">
      <Cursor />
      <Grain />
      <Nav />

      {/* overflow-x-auto, not hidden -- each strip's own min-width (56px
          idle, 280px expanded) can add up to more than the viewport on a
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
            isExpanded={i === expandedIndex}
            onSelect={() => selectStrip(i)}
            onNext={advanceStrip}
            onHoverStart={() => hoverStrip(i)}
            onHoverEnd={() => hoverStrip(null)}
          />
        ))}
      </div>
    </div>
  )
}

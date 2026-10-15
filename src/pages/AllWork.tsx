import { useState, type KeyboardEvent } from 'react'
import { Link } from 'react-router-dom'
import { CASE_STUDIES } from '../data/caseStudies'
import { Cursor } from '../components/Cursor'
import { Grain } from '../components/Grain'
import { useMaskNavigate } from '../hooks/useMaskNavigate'
import { getChapterScrollOffset } from '../lib/journeyScroll'

const pad = (num: number) => String(num).padStart(2, '0')

// Filmstrip/accordion gallery -- every case study (including the still-
// placeholder 06-10 entries the featured Journey chapters skip) as one
// row of strips, all visible at once, with the active/expanded one
// growing via an animated `flex` value rather than a real width change.
// `div`, not `button`, for each strip -- the active one needs its own
// real <button> nested inside for "next", and interactive elements
// can't nest.
function Strip({
  cs,
  index,
  isActive,
  onSelect,
  onNext,
}: {
  cs: (typeof CASE_STUDIES)[number]
  index: number
  isActive: boolean
  onSelect: () => void
  onNext: () => void
}) {
  const [isHovered, setIsHovered] = useState(false)
  // Hovering widens a strip and shows its photo fully, the same way
  // clicking does -- but the full title/category/Next content block
  // below only appears once a strip is genuinely ACTIVE (clicked), not
  // merely hovered. Showing that block (and its Next button) on pure
  // hover would let clicking Next while hovering a strip OTHER than the
  // real active one silently advance an index you're not even looking
  // at. Touch devices have no hover at all, so tapping (which fires
  // onSelect directly) is unaffected by any of this either way.
  const expanded = isActive || isHovered
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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-cursor={isActive ? undefined : 'View'}
      style={{
        flex: expanded ? '8 8 0%' : '1 1 0%',
        minWidth: expanded ? 280 : 56,
      }}
      className="group relative h-full shrink-0 cursor-pointer overflow-hidden border-r border-cream/10 text-left transition-[flex] duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] last:border-r-0 focus-visible:outline-none"
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
      {/* The collapsed-state dark overlay above is what kept its own text
          legible -- switching it off once active to actually show the
          photo left this copy block sitting directly on top of whatever
          the image's own content is, unreadable against a busy shot
          like the stickers. A dedicated bottom scrim (active only) fixes
          that without dimming the photo everywhere else. Tied to
          `isActive`, not `expanded` -- there's no text block to protect
          here on a merely-hovered, not-yet-active strip. */}
      {isActive && (
        <>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
          {/* Light top scrim too -- the number badge (top-20) has no
              guaranteed dark ground under it now that the active panel's
              full-strength overlay is off, and against a bright/busy
              photo (sky, foliage) it disappeared entirely. */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/50 to-transparent" />
        </>
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

      {isActive && (
        <div className="pointer-events-none absolute inset-x-6 bottom-8 md:inset-x-10 md:bottom-12">
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
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onNext()
            }}
            aria-label="Next project"
            data-cursor="Next"
            className="pointer-events-auto absolute right-0 -bottom-1 flex h-10 w-10 items-center justify-center border border-cream/20 text-cream transition-colors hover:border-teal hover:text-teal md:h-12 md:w-12"
          >
            →
          </button>
        </div>
      )}
    </div>
  )
}

export function AllWork() {
  const [active, setActive] = useState(0)
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
      <div className="flex h-full w-full overflow-x-auto">
        {CASE_STUDIES.map((cs, i) => (
          <Strip
            key={cs.slug}
            cs={cs}
            index={i}
            isActive={i === active}
            onSelect={() => setActive(i)}
            onNext={() => setActive((active + 1) % CASE_STUDIES.length)}
          />
        ))}
      </div>
    </div>
  )
}

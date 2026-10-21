import { Link } from 'react-router-dom'
import type { CaseStudy } from '../data/caseStudies'
import { useMaskNavigate } from '../hooks/useMaskNavigate'

// Placeholder pending approved copy -- see conversation. Deliberately
// not cs.description: that field is also the homepage's real WorkPanel
// pull-quote text for the 5 featured case studies.
const PLACEHOLDER_BLURB =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua, ut enim ad minim veniam.'

export function ProjectCard({
  cs,
  index,
  aspect,
  stacked,
  cardRef,
  washRef,
  mediaRef,
}: {
  cs: CaseStudy
  index: number
  // Liesinger's own thumbnails alternate between roughly 4:3 and 3:2 --
  // not a uniform ratio across every project.
  aspect: '4/3' | '3/2'
  // False under prefers-reduced-motion -- renders as a plain block in
  // normal flow instead of a sticky, z-indexed stack layer, and skips
  // the wash overlay entirely (nothing left to scrub it).
  stacked: boolean
  cardRef?: (el: HTMLElement | null) => void
  washRef?: (el: HTMLDivElement | null) => void
  mediaRef?: (el: HTMLDivElement | null) => void
}) {
  const maskNavigate = useMaskNavigate()
  const goToProject = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    maskNavigate(`/work/${cs.slug}`)
  }

  return (
    <section
      ref={cardRef}
      style={stacked ? { zIndex: index + 1 } : undefined}
      // `sticky` and `relative` both set `position`, and Tailwind's
      // generated CSS order (not this template's order) decides which
      // utility wins when both are present on the same element --
      // confirmed directly that it was `relative`, silently killing the
      // pin entirely. Keeping them in separate, mutually exclusive
      // branches avoids relying on that order at all.
      className={stacked ? 'sticky top-0 h-dvh w-full bg-ink' : 'relative h-auto w-full bg-ink'}
    >
      <Link
        to={`/work/${cs.slug}`}
        onClick={goToProject}
        className="group flex h-full flex-col items-center transition-colors duration-500 hover:bg-cream focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-teal md:flex-row"
      >
        <div className="flex w-full flex-1 flex-col justify-between gap-6 px-8 py-10 md:w-1/2 md:px-16 md:py-16 lg:px-24">
          <span className="font-body text-xs tracking-[0.22em] text-cream/40 uppercase transition-colors duration-500 group-hover:text-ink/40">
            {String(index + 1).padStart(2, '0')}
          </span>
          <div>
            <h2 className="font-display text-4xl leading-[0.95] font-bold tracking-[-0.04em] text-cream uppercase transition-colors duration-500 group-hover:text-ink md:text-5xl lg:text-6xl">
              {cs.title}
            </h2>
            <p className="font-body mt-6 max-w-md text-sm leading-relaxed text-cream/60 transition-colors duration-500 group-hover:text-ink/60">
              {PLACEHOLDER_BLURB}
            </p>
          </div>
          <span className="font-body text-xs tracking-[0.22em] text-cream/40 uppercase transition-colors duration-500 group-hover:text-ink/40">
            {cs.category}
          </span>
        </div>

        {/* Liesinger-matched thumbnail sizing: a bounded, centered box
            (not full-bleed-to-edges like the previous stack build) --
            `perspective` lives here, on media's PARENT, so GSAP's rotateX
            on media itself (see ProjectStack) actually reads as a tilt in
            3D space instead of a flat skew. */}
        <div
          className="flex w-full flex-1 items-center justify-center px-8 py-6 md:w-1/2 md:px-16 md:py-16 lg:px-24"
          style={{ perspective: '1400px' }}
        >
          <div ref={mediaRef} className="w-full max-w-xl overflow-hidden" style={{ aspectRatio: aspect }}>
            {cs.image ? (
              <img
                src={cs.image}
                alt={`${cs.title} cover`}
                loading="lazy"
                decoding="async"
                style={{ objectPosition: cs.imagePosition ?? 'center' }}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center border border-dashed border-cream/15">
                <span className="font-body px-4 text-center text-[10px] tracking-[0.22em] text-cream/25 uppercase">
                  [ placeholder image ]
                </span>
              </div>
            )}
          </div>
        </div>
      </Link>

      {/* The outgoing card's "soft white wash" -- fades in on top of
          THIS card's own content as the next one rises to cover it. Its
          own eventual opacity 1 is what keeps it from ever bleeding
          through once settled (see ProjectStack for why that matters:
          the next card's root fades in from 0 over this same card, so
          anything this wash doesn't fully hide would otherwise show
          through indefinitely once the handoff finishes, not just
          during it). */}
      {stacked && <div ref={washRef} className="pointer-events-none absolute inset-0 bg-cream opacity-0" />}
    </section>
  )
}

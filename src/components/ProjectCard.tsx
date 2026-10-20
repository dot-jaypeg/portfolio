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
  stacked,
  cardRef,
  dimRef,
  clipRef,
}: {
  cs: CaseStudy
  index: number
  // False under prefers-reduced-motion -- renders as a plain block in
  // normal document flow instead of a sticky, z-indexed stack layer,
  // and skips the dim overlay entirely (nothing to scrub it).
  stacked: boolean
  cardRef?: (el: HTMLElement | null) => void
  dimRef?: (el: HTMLDivElement | null) => void
  clipRef?: (el: HTMLDivElement | null) => void
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
      className={`group relative w-full bg-ink ${stacked ? 'sticky top-0 h-dvh' : 'h-auto'}`}
    >
      {/* The clip-path target -- kept as its own wrapper, separate from
          the Link below, so GSAP can round its corners as it recedes
          without that transform ever touching hit-testing/focus on the
          interactive element inside it. */}
      <div ref={clipRef} className="h-full w-full overflow-hidden">
        <Link
          to={`/work/${cs.slug}`}
          onClick={goToProject}
          className="flex h-full flex-col bg-ink transition-colors duration-500 group-hover:bg-cream focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-teal md:flex-row"
        >
          <div className="flex flex-1 flex-col justify-between gap-6 p-8 md:w-1/2 md:p-16">
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

          <div className="relative min-h-0 flex-1 md:w-1/2">
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
        </Link>
      </div>

      {/* Stands in for the reference's filter:brightness() darken --
          restricted to transform/opacity/clip-path here, so this is a
          plain opacity-scrubbed black layer instead of a CSS filter. */}
      {stacked && <div ref={dimRef} className="pointer-events-none absolute inset-0 bg-black opacity-0" />}
    </section>
  )
}

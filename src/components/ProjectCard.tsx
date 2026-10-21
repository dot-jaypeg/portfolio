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
}: {
  cs: CaseStudy
  index: number
  // Liesinger's own thumbnails alternate between roughly 4:3 and 3:2 --
  // not a uniform ratio across every project.
  aspect: '4/3' | '3/2'
  // False under prefers-reduced-motion -- renders as a plain block in
  // normal flow instead of a sticky, z-indexed stack layer.
  stacked: boolean
  cardRef?: (el: HTMLElement | null) => void
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
      //
      // That sticky + ascending z-index is the ENTIRE mechanic now --
      // no GSAP, no fade, no crossfade. Per direct request, the wash/
      // entrance-fade/thumbnail tilt-blur polish layer that used to sit
      // on top of this was removed entirely: cards just overlap.
      className={stacked ? 'sticky top-0 h-dvh w-full bg-cream' : 'relative h-auto w-full bg-cream'}
    >
      <Link
        to={`/work/${cs.slug}`}
        onClick={goToProject}
        className="group flex h-full flex-col items-center focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-teal md:flex-row"
      >
        <div className="flex w-full flex-1 flex-col justify-between gap-6 px-8 py-10 md:w-1/2 md:px-16 md:py-16 lg:px-24">
          <span className="font-body text-xs tracking-[0.22em] text-ink/40 uppercase">
            {String(index + 1).padStart(2, '0')}
          </span>
          <div>
            <h2 className="font-display text-4xl leading-[0.95] font-bold tracking-[-0.04em] text-ink uppercase md:text-5xl lg:text-6xl">
              {cs.title}
            </h2>
            <p className="font-body mt-6 max-w-md text-sm leading-relaxed text-ink/60">
              {PLACEHOLDER_BLURB}
            </p>
            {/* Same pill treatment as ExpertisePills/the Download Resume
                link (rounded-full border, invert-on-hover) -- the one
                established "button" look sitewide -- just recolored for
                this page's light theme (border-ink, inverts to a solid
                ink fill instead of cream). A <span>, not a nested
                <button>/<a>: the whole card above is already one Link,
                and interactive elements can't nest -- this is a visual
                affordance, not a second click target. */}
            <span className="mt-8 inline-block rounded-full border border-ink/20 px-6 py-3 text-xs tracking-wider text-ink/70 uppercase transition-colors duration-300 group-hover:border-ink group-hover:bg-ink group-hover:text-cream">
              View Project
            </span>
          </div>
          <span className="font-body text-xs tracking-[0.22em] text-ink/40 uppercase">
            {cs.category}
          </span>
        </div>

        {/* Liesinger-matched thumbnail sizing: a bounded, centered box
            (not full-bleed-to-edges). */}
        <div className="flex w-full flex-1 items-center justify-center px-8 py-6 md:w-1/2 md:px-16 md:py-16 lg:px-24">
          <div className="w-full max-w-xl overflow-hidden" style={{ aspectRatio: aspect }}>
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
              <div className="flex h-full w-full items-center justify-center border border-dashed border-ink/15">
                <span className="font-body px-4 text-center text-[10px] tracking-[0.22em] text-ink/25 uppercase">
                  [ placeholder image ]
                </span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </section>
  )
}

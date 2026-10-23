import { Link } from 'react-router-dom'
import type { CaseStudy } from '../data/caseStudies'
import { useMaskNavigate } from '../hooks/useMaskNavigate'

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
      className={stacked ? 'sticky top-0 h-dvh w-full bg-ink' : 'relative h-auto w-full bg-ink'}
    >
      <Link
        to={`/work/${cs.slug}`}
        onClick={goToProject}
        className="flex h-full flex-col items-center focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-teal md:flex-row"
      >
        <div className="flex w-full flex-1 flex-col justify-between gap-6 px-8 py-10 md:w-1/2 md:px-16 md:py-16 lg:px-24">
          <span className="font-body text-xs tracking-[0.22em] text-cream/40 uppercase">
            {String(index + 1).padStart(2, '0')}
          </span>
          <div>
            <h2 className="font-display text-4xl leading-[0.95] font-bold tracking-[-0.04em] text-cream uppercase md:text-5xl lg:text-6xl">
              {cs.title}
            </h2>
            <p className="font-body mt-6 max-w-md text-sm leading-relaxed text-cream/60">{cs.description}</p>
            {/* Same pill treatment as ExpertisePills/the Download Resume
                link (rounded-full border, invert-on-hover) -- the one
                established "button" look sitewide -- recolored for this
                page's dark theme (border-cream, inverts to a solid
                cream fill instead of ink). A <span>, not a nested
                <button>/<a>: the whole card above is already one Link,
                and interactive elements can't nest -- this is a visual
                affordance, not a second click target.
                `hover:`, not `group-hover:` -- this should only invert
                when the cursor is actually over the pill itself, not
                anywhere on the card (the card has no other hover effect
                of its own to piggyback on; a plain :hover on this
                element is exactly scoped to its own box regardless of
                where in the ancestor Link the cursor is). */}
            <span className="mt-8 inline-block rounded-full border border-cream/20 px-6 py-3 text-xs tracking-wider text-cream/70 uppercase transition-colors duration-300 hover:border-cream hover:bg-cream hover:text-ink">
              View Project
            </span>
          </div>
          <span className="font-body text-xs tracking-[0.22em] text-cream/40 uppercase">
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
                style={{ objectPosition: cs.workImagePosition ?? cs.imagePosition ?? 'center' }}
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
    </section>
  )
}

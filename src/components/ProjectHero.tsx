import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import type { CaseStudy } from '../data/caseStudies'
import type { ProjectDetailData } from '../data/projectDetails'

// Media comes first, full-bleed, with no text overlaid on it -- the
// nav is already `fixed`/transparent (see Nav.tsx), so it simply
// floats on top of this the same way it does on littletroop.com's own
// case studies. The statement H1, tags, and links row all sit below
// it, not over it.
export function ProjectHero({ project, detail }: { project: CaseStudy; detail: ProjectDetailData }) {
  const imgRef = useRef<HTMLImageElement>(null)
  const prefersReducedMotion = usePrefersReducedMotion()
  const heroBold = detail.heroBold ?? project.client
  const links = detail.links

  useEffect(() => {
    const el = imgRef.current
    if (!el || prefersReducedMotion) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, scale: 1.06 },
        { opacity: 1, scale: 1, duration: 1.4, ease: 'power3.out', delay: 0.1 },
      )
    })
    return () => ctx.revert()
  }, [prefersReducedMotion])

  return (
    <header>
      {project.image && (
        <div className="h-[85vh] w-full overflow-hidden bg-cream/5">
          <img
            ref={imgRef}
            src={project.image}
            alt={`${project.title} lead image`}
            style={{ objectPosition: detail.heroImagePosition ?? project.imagePosition ?? 'center' }}
            className="h-full w-full object-cover"
            loading="eager"
            decoding="async"
          />
        </div>
      )}

      <div className="px-6 pt-10 pb-10 md:px-10 md:pt-14 md:pb-14">
        <p className="font-geist max-w-[90rem] text-2xl leading-[1.2] font-light text-cream md:text-4xl lg:text-5xl">
          {detail.heroLead} <strong className="font-medium">{heroBold}</strong>
          {detail.heroTagline}
        </p>

        <p className="font-geist mt-7 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium tracking-[0.22em] text-cream/40 uppercase">
          {detail.tags.map((tag, i) => (
            <span key={tag} className="flex items-center gap-2">
              {i > 0 && <span className="text-cream/20">/</span>}
              {tag}
            </span>
          ))}
        </p>

        {links && (links.site || (links.featuredOn && links.featuredOn.length > 0)) && (
          <div className="mt-10 flex flex-wrap gap-4 border-t border-cream/10 pt-8">
            {links.site && (
              <a
                href={links.site}
                target="_blank"
                rel="noreferrer"
                className="font-geist rounded-full border border-cream/20 px-6 py-3 text-xs font-medium tracking-wider text-cream/70 uppercase transition-colors duration-300 hover:border-cream hover:bg-cream hover:text-ink"
              >
                Visit Site
              </a>
            )}
            {links.featuredOn?.map((f) => (
              <a
                key={f.href}
                href={f.href}
                target="_blank"
                rel="noreferrer"
                className="font-geist rounded-full border border-cream/20 px-6 py-3 text-xs font-medium tracking-wider text-cream/70 uppercase transition-colors duration-300 hover:border-cream hover:bg-cream hover:text-ink"
              >
                {f.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}

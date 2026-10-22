import { useEffect, useRef, type CSSProperties } from 'react'
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
  const accent = project.accent ?? '#618c82'

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
        <div className="h-screen w-full overflow-hidden bg-cream/5">
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
        <p className="font-geist max-w-[90rem] text-2xl leading-[1.2] font-light tracking-tighter text-cream md:text-4xl lg:text-5xl">
          {detail.heroLead} <strong className="font-medium">{heroBold}</strong>
          {detail.heroTagline}
        </p>

        <p
          style={{ color: accent }}
          className="font-geist mt-7 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium tracking-[0.22em] uppercase"
        >
          {detail.tags.map((tag, i) => (
            <span key={tag} className="flex items-center gap-2">
              {i > 0 && (
                <span style={{ color: accent }} className="opacity-40">
                  /
                </span>
              )}
              {tag}
            </span>
          ))}
        </p>

        {/* Always renders, not just when there are links -- this is the
            divider between the hero block and whatever comes next
            (the intro paragraph), not just a rule above the pills. */}
        <div style={{ borderColor: `${accent}33` }} className="mt-10 border-t pt-8">
          {links && (links.site || (links.featuredOn && links.featuredOn.length > 0)) && (
            <div className="flex flex-wrap gap-4">
              {links.site && (
                <a
                  href={links.site}
                  target="_blank"
                  rel="noreferrer"
                  style={{ '--pill-accent': accent, borderColor: `${accent}66`, color: accent } as CSSProperties}
                  className="font-geist rounded-full border px-6 py-3 text-xs font-medium tracking-wider uppercase transition-colors duration-300 hover:bg-[var(--pill-accent)] hover:text-ink"
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
                  style={{ '--pill-accent': accent, borderColor: `${accent}66`, color: accent } as CSSProperties}
                  className="font-geist rounded-full border px-6 py-3 text-xs font-medium tracking-wider uppercase transition-colors duration-300 hover:bg-[var(--pill-accent)] hover:text-ink"
                >
                  {f.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

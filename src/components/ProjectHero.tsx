import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import type { CaseStudy } from '../data/caseStudies'
import type { ProjectDetailData } from '../data/projectDetails'

export function ProjectHero({ project, detail }: { project: CaseStudy; detail: ProjectDetailData }) {
  const imgRef = useRef<HTMLImageElement>(null)
  const prefersReducedMotion = usePrefersReducedMotion()
  const accent = project.accent ?? '#618c82'
  const heroBold = detail.heroBold ?? project.client
  const links = detail.links

  useEffect(() => {
    const el = imgRef.current
    if (!el || prefersReducedMotion) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, scale: 1.06 },
        { opacity: 1, scale: 1, duration: 1.3, ease: 'power3.out', delay: 0.15 },
      )
    })
    return () => ctx.revert()
  }, [prefersReducedMotion])

  return (
    <header className="pt-32 pb-10 md:pt-40 md:pb-14">
      <div className="px-6 md:px-10">
        <p
          style={{ color: accent }}
          className="font-body mb-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs tracking-[0.22em] uppercase"
        >
          {detail.tags.map((tag, i) => (
            <span key={tag} className="flex items-center gap-2">
              {i > 0 && <span className="text-cream/25">/</span>}
              {tag}
            </span>
          ))}
        </p>

        <h1 className="font-display max-w-4xl text-3xl leading-[1.15] font-bold tracking-[-0.02em] text-cream md:text-5xl lg:text-6xl">
          {detail.heroLead} <strong className="font-bold">{heroBold}</strong>
          {detail.heroTagline}
        </h1>

        {links && (links.site || (links.featuredOn && links.featuredOn.length > 0)) && (
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-2">
            {links.site && (
              <a
                href={links.site}
                target="_blank"
                rel="noreferrer"
                className="font-body text-xs tracking-[0.2em] text-cream/60 uppercase transition-colors hover:text-cream"
              >
                Visit Site {'→'}
              </a>
            )}
            {links.featuredOn?.map((f) => (
              <a
                key={f.href}
                href={f.href}
                target="_blank"
                rel="noreferrer"
                className="font-body text-xs tracking-[0.2em] text-cream/60 uppercase transition-colors hover:text-cream"
              >
                Featured On {'—'} {f.label}
              </a>
            ))}
          </div>
        )}
      </div>

      {project.image && (
        <div className="mt-10 w-full overflow-hidden bg-cream/5 md:mt-14" style={{ aspectRatio: '16 / 9' }}>
          <img
            ref={imgRef}
            src={project.image}
            alt={`${project.title} lead image`}
            style={{ objectPosition: project.imagePosition ?? 'center' }}
            className="h-full w-full object-cover"
            loading="eager"
            decoding="async"
          />
        </div>
      )}
    </header>
  )
}

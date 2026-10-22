import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import type { ProjectChapter as ProjectChapterData } from '../data/projectDetails'
import { ImageGrid } from './ImageGrid'

export function ProjectChapter({ chapter, accent }: { chapter: ProjectChapterData; accent: string }) {
  const sectionRef = useRef<HTMLElement>(null)
  const prefersReducedMotion = usePrefersReducedMotion()
  const paragraphs = chapter.text ? (Array.isArray(chapter.text) ? chapter.text : [chapter.text]) : []
  const card = chapter.imagesOnCard ?? true

  useEffect(() => {
    const el = sectionRef.current
    if (!el || prefersReducedMotion) return
    const ctx = gsap.context(() => {
      const targets = el.querySelectorAll('[data-reveal]')
      gsap.from(targets, {
        opacity: 0,
        y: 28,
        stagger: 0.08,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 82%',
          // Symmetric in both directions -- replays the reveal every
          // time the section re-enters view, scrolling down OR back up
          // (not just a one-time play that silently stays revealed
          // forever once you've scrolled past it once).
          toggleActions: 'play reverse play reverse',
        },
      })
    }, el)
    return () => ctx.revert()
  }, [prefersReducedMotion])

  return (
    <section ref={sectionRef} className="py-10 md:py-16">
      {(chapter.label || paragraphs.length > 0) && (
        <div data-reveal className="px-6 md:px-10">
          {chapter.label && (
            <p style={{ color: accent }} className="font-geist mb-5 text-xs font-medium tracking-[-0.02em] uppercase">
              {chapter.label}
            </p>
          )}
          {paragraphs.map((paragraph, i) => (
            <p
              key={i}
              className={`font-geist max-w-[90rem] text-lg leading-relaxed font-light tracking-tight text-cream md:text-xl lg:text-2xl ${i > 0 ? 'mt-6' : ''}`}
            >
              {paragraph}
            </p>
          ))}
        </div>
      )}
      <div data-reveal>
        <ImageGrid layout={chapter.layout} images={chapter.images} card={card} tall={chapter.tall} />
      </div>
      {chapter.moreImages?.map((block, i) => (
        <div data-reveal key={i} className={block.layout === 'full-page' ? '' : 'mt-10'}>
          <ImageGrid layout={block.layout} images={block.images} card={card} tall={block.tall} />
        </div>
      ))}
    </section>
  )
}

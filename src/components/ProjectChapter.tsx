import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import type { ProjectChapter as ProjectChapterData } from '../data/projectDetails'
import { ImageGrid } from './ImageGrid'

export function ProjectChapter({ chapter }: { chapter: ProjectChapterData }) {
  const sectionRef = useRef<HTMLElement>(null)
  const prefersReducedMotion = usePrefersReducedMotion()

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
          toggleActions: 'play none none reverse',
        },
      })
    }, el)
    return () => ctx.revert()
  }, [prefersReducedMotion])

  return (
    <section ref={sectionRef} className="py-14 md:py-20">
      <div data-reveal className="mx-auto max-w-3xl px-6 md:px-10">
        <p className="font-body text-sm leading-relaxed text-cream/80 md:text-base">
          <strong className="text-cream">{chapter.label}.</strong> {chapter.text}
        </p>
      </div>
      <div data-reveal>
        <ImageGrid layout={chapter.layout} images={chapter.images} />
      </div>
    </section>
  )
}

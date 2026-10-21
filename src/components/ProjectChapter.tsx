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
    <section ref={sectionRef} className="py-20 md:py-32">
      <div data-reveal className="px-6 md:px-10">
        <p className="font-body mb-5 text-xs tracking-[0.22em] text-cream/40 uppercase">{chapter.label}</p>
        <p className="font-display max-w-[90rem] text-2xl leading-[1.2] font-normal text-cream md:text-4xl lg:text-5xl">
          {chapter.text}
        </p>
      </div>
      <div data-reveal>
        <ImageGrid layout={chapter.layout} images={chapter.images} card={chapter.imagesOnCard ?? true} />
      </div>
      {chapter.extraImages && (
        <div data-reveal className="mt-10">
          <ImageGrid
            layout={chapter.extraImages.layout}
            images={chapter.extraImages.images}
            card={chapter.imagesOnCard ?? true}
          />
        </div>
      )}
    </section>
  )
}

import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import type { ProjectChapter as ProjectChapterData } from '../data/projectDetails'
import { ImageGrid } from './ImageGrid'

// Closed by default -- click the label to reveal the copy. Body text
// renders much smaller than the standard chapter treatment (a notch
// above the label itself, not the usual big editorial size), since a
// dropdown reads as a compact aside, not the chapter's own headline.
function CollapsibleChapterText({
  label,
  paragraphs,
  accent,
}: {
  label: string
  paragraphs: string[]
  accent: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const el = contentRef.current
    if (!el) return
    gsap.killTweensOf(el)
    gsap.to(el, {
      height: isOpen ? 'auto' : 0,
      opacity: isOpen ? 1 : 0,
      duration: prefersReducedMotion ? 0 : 0.45,
      ease: 'power2.inOut',
      // One safe refresh once the open/close settles, so every OTHER
      // ScrollTrigger on the page (further-down chapters' own reveals)
      // picks up the document height this just changed.
      onComplete: () => ScrollTrigger.refresh(true),
    })
  }, [isOpen, prefersReducedMotion])

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        className="flex items-center gap-3 text-left"
      >
        <span style={{ color: accent }} className="font-geist text-xs font-medium tracking-[-0.02em] uppercase">
          {label}
        </span>
        <span
          style={{ color: accent }}
          className={`text-base leading-none transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}
        >
          +
        </span>
      </button>
      <div ref={contentRef} className="overflow-hidden" style={{ height: 0, opacity: 0 }}>
        {paragraphs.map((paragraph, i) => (
          <p
            key={i}
            className="font-geist mt-4 max-w-2xl text-sm leading-relaxed font-light text-cream/80 md:text-base"
          >
            {paragraph}
          </p>
        ))}
      </div>
    </>
  )
}

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
          {chapter.collapsible && chapter.label ? (
            <CollapsibleChapterText label={chapter.label} paragraphs={paragraphs} accent={accent} />
          ) : (
            <>
              {chapter.label && (
                <p
                  style={{ color: accent }}
                  className="font-geist mb-5 text-xs font-medium tracking-[-0.02em] uppercase"
                >
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
            </>
          )}
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

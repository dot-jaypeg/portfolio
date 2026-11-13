import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import type { ProjectChapter as ProjectChapterData } from '../data/projectDetails'
import { ImageGrid } from './ImageGrid'

// Points down closed, flips to point up open -- a plain chevron
// instead of a +/x morph, which reads as a more standard (and less
// fiddly-looking) accordion affordance.
function CaretIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="11"
      height="7"
      viewBox="0 0 11 7"
      fill="none"
      className={`shrink-0 transition-transform duration-300 ease-out ${open ? 'rotate-180' : ''}`}
    >
      <path d="M1 1L5.5 5.5L10 1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// Closed by default -- click the row to reveal the copy. Styled as a
// plain accordion list row (hairline rule, label pinned left, caret
// pinned right) rather than a label-plus-icon cluster -- body copy
// still reads a notch smaller than the standard chapter treatment
// (a compact aside, not the chapter's own headline).
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
    <div style={{ borderColor: `${accent}26` }} className="max-w-2xl border-t">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-6 py-6 text-left"
      >
        <span style={{ color: accent }} className="font-geist text-sm font-medium tracking-[0.1em] uppercase">
          {label}
        </span>
        <span style={{ color: accent }}>
          <CaretIcon open={isOpen} />
        </span>
      </button>
      <div ref={contentRef} className="overflow-hidden" style={{ height: 0, opacity: 0 }}>
        <div className="pb-6">
          {paragraphs.map((paragraph, i) => (
            <p
              key={i}
              className={`font-geist text-sm leading-relaxed font-light text-cream/75 md:text-base ${i > 0 ? 'mt-4' : ''}`}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
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
        <div
          data-reveal
          key={i}
          className={block.layout === 'full-page' || block.layout === 'full-page-two-up' ? '' : 'mt-10'}
        >
          <ImageGrid layout={block.layout} images={block.images} card={card} tall={block.tall} />
        </div>
      ))}
    </section>
  )
}

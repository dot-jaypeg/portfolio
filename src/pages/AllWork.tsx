import { useLayoutEffect, useRef } from 'react'
import { CASE_STUDIES } from '../data/caseStudies'
import { Cursor } from '../components/Cursor'
import { Grain } from '../components/Grain'
import { Nav } from '../components/Nav'
import { ProjectEntry } from '../components/ProjectEntry'
import { LogoCarousel } from '../components/LogoCarousel'
import { Contact } from '../components/Contact'
import { useScrollToTop } from '../hooks/useScrollToTop'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { gsap, ScrollTrigger } from '../lib/gsap'

// Modeled on liesingers.com/work/ (structure/restraint, not identity,
// assets, or copy) -- one simple vertical scroll, every project using
// the same template, no filters/categories bar/intro block. Replaces
// the previous hover-expand accordion entirely, per direct
// confirmation. /gallery (MoodboardCanvas) is untouched.
export function AllWork() {
  useScrollToTop()
  useDocumentMeta(
    'Work — .jaypeg',
    'Selected projects across branding, digital marketing, illustration, and motion.',
  )
  const prefersReducedMotion = usePrefersReducedMotion()
  const listRef = useRef<HTMLUListElement>(null)

  useLayoutEffect(() => {
    if (prefersReducedMotion || !listRef.current) return
    const entries = gsap.utils.toArray<HTMLElement>(listRef.current.querySelectorAll('.project-entry'))
    const batches = ScrollTrigger.batch(entries, {
      start: 'top 88%',
      onEnter: (batch) =>
        gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out' }),
    })
    ScrollTrigger.refresh()
    return () => batches.forEach((trigger) => trigger.kill())
  }, [prefersReducedMotion])

  return (
    <div className="min-h-screen bg-ink">
      <Cursor />
      <Grain />
      <Nav />

      <main className="px-6 pt-32 pb-24 md:px-10 md:pt-40 md:pb-32">
        {/* No visible intro block per the brief -- this exists purely
            so the page has a real heading for assistive tech. */}
        <h1 className="sr-only">Work</h1>

        <ul ref={listRef} className="flex flex-col gap-24 md:gap-32">
          {CASE_STUDIES.map((cs, i) => (
            <ProjectEntry
              key={cs.slug}
              cs={cs}
              aspect={i % 2 === 0 ? '4/3' : '3/2'}
              animated={!prefersReducedMotion}
            />
          ))}
        </ul>

        <LogoCarousel />
      </main>

      <Contact />
    </div>
  )
}

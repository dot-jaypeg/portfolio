import { useLayoutEffect, useRef } from 'react'
import { CASE_STUDIES } from '../data/caseStudies'
import { ProjectCard } from './ProjectCard'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { gsap, ScrollTrigger } from '../lib/gsap'

// Layered sticky card stack modeled on advancedmarketers.co/specialties
// -- read directly from its shipped specialties-scroll.js, not guessed
// from watching it scroll (see conversation for the exact numbers this
// is based on, and where this deliberately diverges from it).
//
// The covering effect itself needs zero JavaScript: every card is
// `position: sticky; top: 0; height: 100dvh` with an ascending
// z-index, all as siblings under this one shared container. Scrolled
// past, each one just stays pinned at the same spot and the next one
// (higher z-index) paints over it -- that's the whole mechanic, and
// it's why the page still reads correctly without JS. GSAP only adds
// the scale-down/dim/corner-radius polish on top, scrubbed to how far
// the NEXT card has travelled from the bottom of the viewport (progress
// 0) to the top (progress 1) -- exactly the reference's own progress
// calculation, just expressed as a ScrollTrigger instead of a hand-
// rolled rAF loop.
export function ProjectStack() {
  const prefersReducedMotion = usePrefersReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)
  const cardEls = useRef<(HTMLElement | null)[]>([])
  const dimEls = useRef<(HTMLDivElement | null)[]>([])
  const clipEls = useRef<(HTMLDivElement | null)[]>([])

  useLayoutEffect(() => {
    if (prefersReducedMotion || !containerRef.current) return

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      mm.add(
        { isDesktop: '(min-width: 768px)', isMobile: '(max-width: 767px)' },
        (context) => {
          const { isDesktop } = context.conditions as { isDesktop: boolean }
          // Smaller shift and a shorter transition window on mobile --
          // not a shorter CARD (still a full 100dvh, per the brief),
          // just a quicker cover/recede once the next one starts
          // entering, via a later ScrollTrigger `start`.
          const scaleFloor = isDesktop ? 0.95 : 0.97
          const dimOpacity = isDesktop ? 0.18 : 0.12
          const cornerRadius = isDesktop ? 28 : 16
          const start = isDesktop ? 'top bottom' : 'top 70%'

          cardEls.current.forEach((card, i) => {
            const next = cardEls.current[i + 1]
            if (!card || !next) return
            const dim = dimEls.current[i]
            const clip = clipEls.current[i]
            const scrollTrigger = { trigger: next, start, end: 'top top', scrub: true }

            gsap.fromTo(card, { scale: 1 }, { scale: scaleFloor, ease: 'none', scrollTrigger })
            if (dim) {
              gsap.fromTo(dim, { opacity: 0 }, { opacity: dimOpacity, ease: 'none', scrollTrigger })
            }
            if (clip) {
              gsap.fromTo(
                clip,
                { clipPath: 'inset(0px round 0px)' },
                { clipPath: `inset(0px round ${cornerRadius}px)`, ease: 'none', scrollTrigger },
              )
            }
          })

          // matchMedia's own per-breakpoint cleanup -- these tweens'
          // ScrollTriggers get killed automatically whenever the
          // breakpoint changes or the context reverts.
          return () => undefined
        },
      )
    }, containerRef)

    // Images don't affect any card's height here (each is a fixed
    // 100dvh regardless of its own image's aspect ratio), so there's no
    // layout-shift risk from them loading late -- this is just a
    // defensive recompute for anything else that might affect page
    // height (fonts, etc.), per the brief.
    const refreshId = requestAnimationFrame(() => ScrollTrigger.refresh())

    return () => {
      cancelAnimationFrame(refreshId)
      ctx.revert()
    }
  }, [prefersReducedMotion])

  return (
    <div ref={containerRef} className="relative">
      {CASE_STUDIES.map((cs, i) => (
        <ProjectCard
          key={cs.slug}
          cs={cs}
          index={i}
          stacked={!prefersReducedMotion}
          cardRef={(el) => {
            cardEls.current[i] = el
          }}
          dimRef={(el) => {
            dimEls.current[i] = el
          }}
          clipRef={(el) => {
            clipEls.current[i] = el
          }}
        />
      ))}
    </div>
  )
}

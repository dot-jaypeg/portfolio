import { useLayoutEffect, useRef } from 'react'
import { CASE_STUDIES } from '../data/caseStudies'
import { ProjectCard } from './ProjectCard'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { gsap, ScrollTrigger } from '../lib/gsap'

// Sticky card stack, pinning mechanic only borrowed from
// advancedmarketers.co/specialties (confirmed directly from its own
// shipped JS *and* CSS: every card is `position: sticky; top: 0` with
// an ascending z-index, under one shared parent, which is the entire
// reason later cards cover earlier ones with no JS required for that
// part at all -- GSAP only adds polish on top). Everything else here
// -- the soft white wash, the title/blurb crossfade, the thumbnail
// tilt-and-blur entrance -- is NOT in that reference (its own CSS
// comment literally says "the rows never fade"); this is this site's
// own direction, built fresh rather than ported.
//
// How the crossfade is actually composited: each card's own section
// opacity fades in from 0 as it arrives (not just its wash) -- so for
// the handoff's whole duration, you're seeing a literal blend of the
// outgoing card (fading toward solid cream under its wash) and the
// incoming one (fading up from transparent), which is what makes both
// titles genuinely visible together rather than one hard-cutting over
// the other.
export function ProjectStack() {
  const prefersReducedMotion = usePrefersReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)
  const cardEls = useRef<(HTMLElement | null)[]>([])
  const washEls = useRef<(HTMLDivElement | null)[]>([])
  const mediaEls = useRef<(HTMLDivElement | null)[]>([])

  useLayoutEffect(() => {
    if (prefersReducedMotion || !containerRef.current) return

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      mm.add({ isDesktop: '(min-width: 768px)' }, (context) => {
        const { isDesktop } = context.conditions as { isDesktop: boolean }
        // Mobile keeps the stack (per direct request -- the reference
        // itself disables it below 768px, this site doesn't), just
        // with a shorter handoff and a lighter tilt/blur.
        const handoffVh = isDesktop ? 0.75 : 0.5
        const tiltDeg = isDesktop ? 12 : 6
        const blurPx = isDesktop ? 10 : 5

        for (let i = 1; i < cardEls.current.length; i++) {
          const card = cardEls.current[i]
          const prevWash = washEls.current[i - 1]
          const media = mediaEls.current[i]
          if (!card) continue

          // scrub: a number (not `true`), for the lagged "catches up"
          // smoothing the brief asks for ("smooth easing") -- a straight
          // 1:1 scrub (what the reference itself uses) tracks the
          // scrollbar exactly, which reads as mechanical rather than
          // smooth once there's a multi-part crossfade riding on it.
          const scrollTrigger = {
            trigger: card,
            start: 'top bottom',
            end: () => `+=${window.innerHeight * handoffVh}`,
            scrub: 0.6,
          }

          gsap.fromTo(card, { autoAlpha: 0 }, { autoAlpha: 1, ease: 'none', scrollTrigger })
          if (prevWash) {
            gsap.fromTo(prevWash, { opacity: 0 }, { opacity: 1, ease: 'none', scrollTrigger })
          }
          if (media) {
            gsap.fromTo(
              media,
              { rotateX: tiltDeg, scale: 1.06, filter: `blur(${blurPx}px)` },
              { rotateX: 0, scale: 1, filter: 'blur(0px)', ease: 'none', scrollTrigger },
            )
          }
        }
      })
    }, containerRef)

    // Each card's height is a fixed 100dvh regardless of its own image's
    // aspect ratio, so image loads can't shift any pin position here --
    // this is just a defensive recompute for anything else that might
    // affect page height (fonts, etc.), per the brief.
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
          aspect={i % 2 === 0 ? '4/3' : '3/2'}
          stacked={!prefersReducedMotion}
          cardRef={(el) => {
            cardEls.current[i] = el
          }}
          washRef={(el) => {
            washEls.current[i] = el
          }}
          mediaRef={(el) => {
            mediaEls.current[i] = el
          }}
        />
      ))}
    </div>
  )
}

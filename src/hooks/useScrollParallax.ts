import { useEffect, type RefObject } from 'react'
import { gsap } from '../lib/gsap'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

// Drifts `targetRef` vertically as `containerRef` scrolls through the
// viewport, scrubbed to scroll position -- the classic "background
// moves slower than the page" depth cue. Same mechanic the homepage's
// own chapter-media parallax uses (a swing scrubbed to scroll), just
// driven by vertical ScrollTrigger progress here instead of
// JourneyDesktop's shared horizontal timeline.
//
// `targetRef` must be sized larger than `containerRef` (its own
// overflow-hidden bounds) -- a `yPercent` swing of `amount` in each
// direction needs at least that much oversize as slack, or the swing
// reveals empty edges. Typical caller: an absolutely-positioned,
// oversized wrapper div around the real media, not the media element
// itself (keeps this agnostic to whether that media is an <img>, a
// <video>, or something else entirely).
export function useScrollParallax(
  containerRef: RefObject<HTMLElement | null>,
  targetRef: RefObject<HTMLElement | null>,
  amount = 10,
) {
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const container = containerRef.current
    const target = targetRef.current
    if (!container || !target || prefersReducedMotion) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        target,
        { yPercent: -amount },
        {
          yPercent: amount,
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      )
    })
    return () => ctx.revert()
  }, [containerRef, targetRef, amount, prefersReducedMotion])
}

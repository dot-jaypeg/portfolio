import { useEffect, useRef } from 'react'
import { gsap, SplitText } from '../lib/gsap'

export function Preloader({ onComplete }: { onComplete: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const wordmarkRef = useRef<HTMLParagraphElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const split = new SplitText(wordmarkRef.current, { type: 'chars' })
      const counter = { value: 0 }

      const tl = gsap.timeline({
        onComplete: () => onComplete(),
      })

      tl.set(rootRef.current, { autoAlpha: 1 })
        .from(split.chars, {
          opacity: 0,
          y: 60,
          rotateZ: 4,
          stagger: 0.04,
          duration: 0.7,
          ease: 'power3.out',
        })
        .fromTo(
          lineRef.current,
          { scaleX: 0 },
          { scaleX: 1, duration: 1.1, ease: 'power2.inOut' },
          '<',
        )
        .to(
          counter,
          {
            value: 100,
            duration: 1.1,
            ease: 'power2.inOut',
            onUpdate: () => {
              if (counterRef.current) {
                counterRef.current.textContent = String(
                  Math.round(counter.value),
                ).padStart(3, '0')
              }
            },
          },
          '<',
        )
        .to({}, { duration: 0.35 })
        .to(split.chars, {
          opacity: 0,
          y: -40,
          stagger: 0.02,
          duration: 0.4,
          ease: 'power2.in',
        })
        .to(lineRef.current, { opacity: 0, duration: 0.3 }, '<')
        .to(
          panelRef.current,
          { yPercent: -100, duration: 0.9, ease: 'expo.inOut' },
          '-=0.1',
        )
        .set(rootRef.current, { autoAlpha: 0 })

      return () => split.revert()
    })

    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      ref={rootRef}
      className="invisible fixed inset-0 z-[100]"
      aria-hidden="true"
    >
      <div
        ref={panelRef}
        className="absolute inset-0 flex h-full w-full flex-col items-center justify-center overflow-hidden bg-ink px-8 py-8 md:px-14 md:py-12"
      >
        <p
          ref={wordmarkRef}
          className="font-display text-[22vw] leading-none font-bold tracking-[-0.06em] text-cream italic md:text-[18vw]"
        >
          .jaypeg
        </p>

        {/* Full-width bar anchored to the very bottom of the screen
            (matching the 5blox reference) instead of a short centered
            rule under the wordmark -- reuses the exact base-line +
            origin-left scaleX fill pattern already used for every other
            scroll-progress bar on the site (CinematicIntro, Journey). */}
        <div className="absolute inset-x-8 bottom-8 h-px bg-cream/15 md:inset-x-14 md:bottom-12">
          <div
            ref={lineRef}
            className="h-full w-full origin-left scale-x-0 bg-cream"
          />
        </div>
        <p className="font-body absolute right-8 bottom-11 text-[10px] tracking-[0.22em] text-cream/50 uppercase md:right-14 md:bottom-16">
          [ Loading — <span ref={counterRef}>000</span> ]
        </p>
      </div>
    </div>
  )
}

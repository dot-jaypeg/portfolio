import { useEffect, useRef } from 'react'
import { gsap, SplitText } from '../lib/gsap'

export function Preloader({ onComplete }: { onComplete: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const wordmarkRef = useRef<HTMLParagraphElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLParagraphElement>(null)

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
        .to(counterRef.current, { opacity: 0, duration: 0.3 }, '<')
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
        className="absolute inset-0 flex h-full w-full flex-col items-center justify-center gap-8 overflow-hidden bg-ink"
      >
        <p
          ref={wordmarkRef}
          className="font-display text-[22vw] leading-none font-bold tracking-[-0.06em] text-cream italic md:text-[18vw]"
        >
          .jaypeg
        </p>
        <div ref={lineRef} className="h-px w-40 origin-left bg-cream/40 md:w-64" />
        <p
          ref={counterRef}
          className="font-body text-xs tracking-[0.22em] text-cream/50"
        >
          000
        </p>
      </div>
    </div>
  )
}

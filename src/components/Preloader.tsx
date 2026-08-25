import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'

export function Preloader({ onComplete }: { onComplete: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const wordmarkRef = useRef<HTMLParagraphElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          onComplete()
        },
      })

      tl.set(rootRef.current, { autoAlpha: 1 })
        .from(wordmarkRef.current, {
          opacity: 0,
          y: 24,
          duration: 0.8,
          ease: 'power3.out',
        })
        .to(wordmarkRef.current, {
          opacity: 0,
          y: -24,
          duration: 0.5,
          ease: 'power2.in',
          delay: 0.5,
        })
        .to(
          panelRef.current,
          {
            yPercent: -100,
            duration: 0.9,
            ease: 'expo.inOut',
          },
          '-=0.1',
        )
        .set(rootRef.current, { autoAlpha: 0 })
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
      <div ref={panelRef} className="absolute inset-0 flex h-full w-full items-center justify-center bg-ink">
        <p
          ref={wordmarkRef}
          className="font-display text-2xl font-bold tracking-tighter text-cream italic"
        >
          .jaypeg
        </p>
      </div>
    </div>
  )
}

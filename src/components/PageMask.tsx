import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'

// A full-screen curtain wipe used in place of a visible smooth-scroll
// when Nav jumps somewhere far away (e.g. back to #top from deep in
// the Journey track) -- covers the screen, jumps the scroll position
// instantly while hidden, then uncovers, so the destination just
// appears instead of scrolling past everything in between.
export function PageMask() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.__maskTransition = (jump: () => void) => {
      const el = ref.current
      if (!el) {
        jump()
        return
      }
      gsap.set(el, { scaleY: 0, transformOrigin: 'top' })
      gsap.to(el, {
        scaleY: 1,
        duration: 0.45,
        ease: 'power3.inOut',
        onComplete: () => {
          jump()
          gsap.set(el, { transformOrigin: 'bottom' })
          gsap.to(el, {
            scaleY: 0,
            duration: 0.5,
            delay: 0.05,
            ease: 'power3.inOut',
          })
        },
      })
    }
    return () => {
      window.__maskTransition = undefined
    }
  }, [])

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed inset-0 z-[95] bg-ink"
      style={{ transform: 'scaleY(0)' }}
    />
  )
}

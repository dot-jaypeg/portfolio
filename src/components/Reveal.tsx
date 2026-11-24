import { useEffect, useRef, type ReactNode } from 'react'
import { gsap } from '../lib/gsap'

export function Reveal({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current!
    const ctx = gsap.context(() => {
      gsap.from(el, {
        opacity: 0,
        y: 32,
        duration: 0.9,
        delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          // Not 'top 85%' -- a real, confirmed bug: for an element this
          // close to the very end of the page (Contact's email/social
          // block, the last thing on the whole site), the browser's own
          // max scroll position gets clamped to `documentHeight -
          // viewportHeight` well before the element's top could ever
          // geometrically reach 85% down the viewport, on any screen
          // short enough that the footer's own `min-h-screen` roughly
          // matches the viewport height (confirmed directly: mobile
          // viewports in the ~800-900px range never satisfied this,
          // permanently stuck at opacity:0 -- the entire email/
          // Instagram/location block was invisible). 'top bottom' fires
          // the moment any part of the element starts entering from the
          // bottom edge, which is reachable at ANY scroll position,
          // including the document's own max.
          start: 'top bottom',
          toggleActions: 'play none none reverse',
        },
      })
    })
    return () => ctx.revert()
  }, [delay])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}

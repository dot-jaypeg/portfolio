import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'

export function Divider() {
  const lineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = lineRef.current!
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1,
          ease: 'power3.inOut',
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
        },
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <div className="mx-auto max-w-[1600px] px-6 md:px-10">
      <div ref={lineRef} className="h-px w-full origin-left bg-cream/20" />
    </div>
  )
}

import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { EXPERTISE } from '../data/expertise'

const REPEL_RADIUS = 90
const REPEL_STRENGTH = 40

export function ExpertisePills() {
  const pillRefs = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    const pills = pillRefs.current.filter(
      (el): el is HTMLSpanElement => el !== null,
    )

    // Idle wobble uses rotation only (never x/y) so it can't fight the
    // cursor-repulsion tweens below, which own x/y -- GSAP composes
    // independent transform sub-properties on the same element fine,
    // but two separate tweens both driving the same sub-property (e.g.
    // two "y" tweens) just stomp on each other instead of combining.
    const idleTweens = pills.map((pill) =>
      gsap.to(pill, {
        rotation: gsap.utils.random(-4, 4),
        duration: gsap.utils.random(2, 3.5),
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: gsap.utils.random(0, 1),
      }),
    )

    const setters = pills.map((pill) => ({
      x: gsap.quickTo(pill, 'x', { duration: 0.4, ease: 'power3' }),
      y: gsap.quickTo(pill, 'y', { duration: 0.4, ease: 'power3' }),
    }))

    const handleMove = (e: MouseEvent) => {
      pills.forEach((pill, i) => {
        const rect = pill.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        const dx = cx - e.clientX
        const dy = cy - e.clientY
        const dist = Math.hypot(dx, dy)

        if (dist < REPEL_RADIUS) {
          const force = (1 - dist / REPEL_RADIUS) * REPEL_STRENGTH
          const angle = Math.atan2(dy, dx)
          setters[i].x(Math.cos(angle) * force)
          setters[i].y(Math.sin(angle) * force)
        } else {
          setters[i].x(0)
          setters[i].y(0)
        }
      })
    }

    window.addEventListener('mousemove', handleMove)

    return () => {
      window.removeEventListener('mousemove', handleMove)
      idleTweens.forEach((tween) => tween.kill())
    }
  }, [])

  return (
    <div className="flex flex-wrap gap-2">
      {EXPERTISE.map((item, i) => (
        <span
          key={item}
          ref={(el) => {
            pillRefs.current[i] = el
          }}
          className="font-body inline-block rounded-full border border-cream/20 px-3 py-1.5 text-xs tracking-widest text-cream/70 uppercase transition-colors duration-300 hover:border-cream hover:bg-cream hover:text-ink"
        >
          {item}
        </span>
      ))}
    </div>
  )
}

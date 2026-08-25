import { useEffect, useRef, useState } from 'react'
import { gsap } from '../lib/gsap'

export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const [label, setLabel] = useState<string | null>(null)
  // Lazy initializer runs synchronously during the first render, so the
  // cursor div (and therefore dotRef.current) already exists by the time
  // the effect below runs -- setting this from inside the effect instead
  // left a render where `enabled` was still false and the div didn't
  // exist yet, so gsap.quickTo(dotRef.current, ...) targeted null.
  const [enabled] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches,
  )

  useEffect(() => {
    if (!enabled) return
    document.documentElement.classList.add('custom-cursor-active')

    const dot = dotRef.current!
    const quickX = gsap.quickTo(dot, 'x', { duration: 0.35, ease: 'power3' })
    const quickY = gsap.quickTo(dot, 'y', { duration: 0.35, ease: 'power3' })

    const handleMove = (e: MouseEvent) => {
      quickX(e.clientX)
      quickY(e.clientY)
    }

    const handleOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest<HTMLElement>(
        '[data-cursor]',
      )
      setLabel(target?.dataset.cursor ?? null)
    }

    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseover', handleOver)

    return () => {
      document.documentElement.classList.remove('custom-cursor-active')
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseover', handleOver)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div
      ref={dotRef}
      className="pointer-events-none fixed top-0 left-0 z-[99] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
    >
      <div
        className="flex items-center justify-center rounded-full bg-cream transition-[width,height] duration-200"
        style={{
          width: label ? 72 : 14,
          height: label ? 72 : 14,
          mixBlendMode: 'difference',
        }}
      >
        {label && (
          <span className="font-body text-[10px] tracking-widest text-ink uppercase">
            {label}
          </span>
        )}
      </div>
    </div>
  )
}

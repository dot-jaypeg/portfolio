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
    // mix-blend-mode has to live on THIS element, not a nested child --
    // position:fixed + z-index already put this div in its own stacking
    // context, so a blend-mode on a descendant only blends within that
    // isolated context (i.e. against nothing) instead of the real page
    // content behind it. That was the previous bug: the dot rendered as
    // plain cream, never actually inverting.
    <div
      ref={dotRef}
      className="pointer-events-none fixed top-0 left-0 z-[99] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center mix-blend-difference"
    >
      <div
        // Fixed white/black, not bg-cream/text-ink -- those resolve
        // through the site's crossfading --bg/--fg variables, so the
        // dot's own fill was flipping to match whatever the current
        // section's foreground color was. Since a section's foreground
        // and background are always exact complements by design,
        // difference-blending the dot against its own backdrop produced
        // the same washed-out constant color everywhere, regardless of
        // section -- it happened to read fine against near-black
        // sections but lost almost all contrast against near-white
        // ("craft") ones. A fixed white fill differences cleanly
        // against any backdrop instead.
        className="flex items-center justify-center rounded-full bg-white transition-[width,height] duration-200"
        style={{
          width: label ? 72 : 14,
          height: label ? 72 : 14,
        }}
      >
        {label && (
          <span className="font-body text-[10px] tracking-wider text-black uppercase">
            {label}
          </span>
        )}
      </div>
    </div>
  )
}

import { useState } from 'react'

// Lazy initializer, same pattern as Journey's desktop-breakpoint check
// and Cursor's pointer-precision check -- runs synchronously on first
// render so there's no frame where motion plays before this is known.
export function usePrefersReducedMotion() {
  const [prefersReducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  return prefersReducedMotion
}

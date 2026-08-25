import { useState } from 'react'
import { JourneyDesktop } from './JourneyDesktop'
import { JourneyMobile } from './JourneyMobile'

// Computed once at mount, not re-checked on resize -- same accepted
// trade-off Cursor.tsx already makes for its own desktop-only gating.
export function Journey() {
  const [isDesktop] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches,
  )

  return isDesktop ? <JourneyDesktop /> : <JourneyMobile />
}

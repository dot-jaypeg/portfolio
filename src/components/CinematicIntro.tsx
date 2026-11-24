import { useState } from 'react'
import { CinematicIntroDesktop } from './CinematicIntroDesktop'
import { CinematicIntroMobile } from './CinematicIntroMobile'

// Same computed-once-at-mount pattern Journey.tsx already uses for its
// own desktop/mobile branch (see that file's own comment) -- per direct
// request, mobile drops the horizontal scroll-jacked scene sequence
// entirely in favor of a plain vertical stack, the same way Journey
// already splits into JourneyDesktop/JourneyMobile.
export function CinematicIntro() {
  const [isDesktop] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches,
  )

  return isDesktop ? <CinematicIntroDesktop /> : <CinematicIntroMobile />
}

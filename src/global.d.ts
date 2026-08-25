import type Lenis from 'lenis'
import type { ScrollTrigger } from 'gsap/ScrollTrigger'

declare global {
  interface Window {
    __lenis?: Lenis
    __journeyScrollTrigger?: ScrollTrigger | null
    __chaptersMenuOpen?: boolean
    __markAutoAdvanceInput?: () => void
  }
}

export {}

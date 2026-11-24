import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '../lib/gsap'

export function useSmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1 - Math.pow(2, -10 * t)),
      // Lenis only smooths wheel input by default (`syncTouch` is false
      // out of the box) -- touch scrolling was passed straight through
      // as raw native scroll position updates instead. Every scroll-
      // scrubbed animation on the site (the --bg/--fg crossfades, the
      // chapter/scene parallax drift) reads its progress off exactly
      // that position, so on mobile specifically every one of them fed
      // off the native scroll's own often-chunky, bursty updates during
      // momentum scrolling -- reading as an abrupt snap instead of a
      // smooth fade for color transitions, and as barely-there motion
      // for anything else scrubbed. Desktop's mouse-wheel users never
      // hit this at all, which is exactly why it went unnoticed until
      // reported directly on a real phone.
      syncTouch: true,
    })

    lenis.on('scroll', ScrollTrigger.update)
    window.__lenis = lenis

    const update = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(update)
      lenis.destroy()
      window.__lenis = undefined
    }
  }, [])
}

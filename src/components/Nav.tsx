import type { MouseEvent } from 'react'
import { ScrollTrigger } from '../lib/gsap'
import { getChapterScrollOffset } from '../lib/journeyScroll'
import { WORK_COUNT } from '../data/journeyChapters'
import { SoundToggle } from './SoundToggle'

const LINKS = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

// Work/About now live inside Journey's pinned horizontal track on
// desktop, so their DOM elements freeze at wherever the pin left them
// once you've scrolled past -- same issue #top already has for
// CinematicIntro. Route those two through the chapter-offset math
// instead; on mobile (or before the ScrollTrigger initializes),
// getChapterScrollOffset returns null and this falls back to the plain
// element lookup, which is correct there since Journey never pins.
//
// `WORK_COUNT + 1`, not `WORK_COUNT` -- a real bug found in a later
// sweep: this was never updated when the ViewAllPanel chapter was
// inserted into JOURNEY_CHAPTERS between the case studies and About,
// so About's real index shifted by one and clicking "About" was
// silently landing on View All instead (confirmed directly).
const CHAPTER_INDEX: Record<string, number> = {
  '#work': 0,
  '#about': WORK_COUNT + 1,
}

export function Nav() {
  const handleClick =
    (href: string) => (e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault()
      // Without this, Journey's auto-advance loop (if it happened to be
      // running) kept calling its own immediate scrollTo every tick and
      // completely overrode this click's jump -- confirmed directly:
      // clicking About while auto-advance was active didn't navigate
      // anywhere, it just kept crawling through Work instead.
      window.__markAutoAdvanceInput?.()
      // Nav jumps cover the screen and jump instantly underneath rather
      // than smooth-scrolling past everything in between -- scrolling
      // "Home" from deep in the Journey track used to visibly crawl
      // backwards through every chapter it had already shown.
      const jump = () => {
        // #top is GSAP-pinned for its scroll-jacked scene sequence, so
        // once you've scrolled past it, its own element settles at the
        // frozen end-of-pin position in the doc flow (the last scene),
        // not y=0 -- scrolling "to the element" would land on that last
        // frame instead of back at "Hello.". Going straight to the top
        // of the document sidesteps that entirely.
        if (href === '#top') {
          window.__lenis?.scrollTo(0, { immediate: true })
        } else if (href in CHAPTER_INDEX && getChapterScrollOffset(CHAPTER_INDEX[href]) != null) {
          window.__lenis?.scrollTo(getChapterScrollOffset(CHAPTER_INDEX[href])!, {
            immediate: true,
          })
        } else {
          const target = document.querySelector(href)
          if (target) window.__lenis?.scrollTo(target as HTMLElement, { immediate: true })
        }
        // A real bug this jump can trigger: landing exactly on a
        // ScrollTrigger's own progress:0 boundary (e.g. "Work", which
        // jumps straight to Journey chapter 0) can be a no-perceptible-
        // change event from GSAP's own point of view if that trigger had
        // never been active before and was already reporting progress:0
        // by default -- confirmed directly (a MutationObserver on
        // --nav-fg showed zero writes for ~1.8s after such a jump, stuck
        // showing whatever color the PREVIOUS section left behind, until
        // Journey's own auto-advance loop eventually nudged the scroll
        // position and incidentally triggered a real update). Forcing a
        // global recompute makes every active trigger's onUpdate fire
        // immediately regardless of whether GSAP thinks anything changed
        // -- but only AFTER a frame, not synchronously here: Lenis's own
        // `scrollTo(..., {immediate:true})` still applies the actual
        // scroll position on its own next animation-frame tick even
        // though it skips the smooth-scroll animation, so calling this
        // synchronously recomputed against the STALE pre-jump position
        // and did nothing (confirmed directly -- nav-fg was still stuck
        // 1.5s after the real scroll had already landed).
        requestAnimationFrame(() => ScrollTrigger.update())
      }
      window.__maskTransition ? window.__maskTransition(jump) : jump()
    }

  return (
    <header className="fixed top-0 z-50 flex w-full items-center justify-between px-6 py-6 md:px-10">
      <a
        href="#top"
        onClick={handleClick('#top')}
        data-cursor="Home"
        className="font-display text-2xl font-bold tracking-[-0.06em] text-cream italic md:text-3xl"
      >
        .jaypeg
      </a>
      <nav>
        <ul className="flex items-center gap-6 md:gap-8">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={handleClick(link.href)}
                className="font-body relative text-xs tracking-[0.14em] text-[var(--nav-fg)] uppercase transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-teal after:transition-transform after:duration-300 after:content-[''] hover:text-teal hover:after:scale-x-100"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <SoundToggle />
          </li>
        </ul>
      </nav>
    </header>
  )
}

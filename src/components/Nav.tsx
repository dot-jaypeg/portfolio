import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { getChapterScrollOffset } from '../lib/journeyScroll'
import { WORK_COUNT } from '../data/journeyChapters'
import { useMaskNavigate } from '../hooks/useMaskNavigate'
import { SoundToggle } from './SoundToggle'

// "Work" is a real route now (the /work accordion gallery is the
// official project page), not a same-page scroll jump -- it's a real
// router Link (not one of these section anchors), rendered separately
// below, routed through the same curtain-wipe transition via
// useMaskNavigate so going to a whole new page feels like the same
// transition as jumping between sections on the homepage.
const SECTION_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

// About still lives inside Journey's pinned horizontal track on
// desktop, so its DOM element freezes at wherever the pin left it once
// you've scrolled past -- same issue #top already has for
// CinematicIntro. Route it through the chapter-offset math instead;
// on mobile (or before the ScrollTrigger initializes),
// getChapterScrollOffset returns null and this falls back to the plain
// element lookup, which is correct there since Journey never pins.
//
// `WORK_COUNT + 1`, not `WORK_COUNT` -- a real bug found in a later
// sweep: this was never updated when the ViewAllPanel chapter was
// inserted into JOURNEY_CHAPTERS between the case studies and About,
// so About's real index shifted by one and clicking "About" was
// silently landing on View All instead (confirmed directly).
const CHAPTER_INDEX: Record<string, number> = {
  '#about': WORK_COUNT + 1,
}

const NAV_LINK_CLASS =
  "font-body relative text-xs tracking-[0.14em] text-[var(--nav-fg)] uppercase transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-teal after:transition-transform after:duration-300 after:content-[''] hover:text-teal hover:after:scale-x-100"

// Two bars that cross into an X when open -- a plain CSS rotate/
// translate on each bar rather than a separate icon swap, so the
// morph itself animates instead of popping between two static glyphs.
function MenuIcon({ open }: { open: boolean }) {
  return (
    <span className="relative flex h-4 w-6 flex-col justify-between md:hidden" aria-hidden="true">
      <span
        className={`h-px w-full bg-[var(--nav-fg)] transition-transform duration-300 ease-out ${open ? 'translate-y-[7px] rotate-45' : ''}`}
      />
      <span
        className={`h-px w-full bg-[var(--nav-fg)] transition-transform duration-300 ease-out ${open ? '-translate-y-[7px] -rotate-45' : ''}`}
      />
    </span>
  )
}

// True once Home's own sections actually exist and are safe to jump
// to -- `#top`/Journey's chapters are GSAP-pinned, so their offsets
// only resolve correctly once JourneyDesktop's ScrollTrigger has set
// up (getChapterScrollOffset returns null until then); Contact is a
// plain, never-pinned section, so it just needs to exist in the DOM.
const isSectionReady = (href: string) =>
  href in CHAPTER_INDEX ? getChapterScrollOffset(CHAPTER_INDEX[href]) != null : !!document.querySelector(href)

export function Nav() {
  const maskNavigate = useMaskNavigate()
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)
  const overlayLinksRef = useRef<HTMLDivElement>(null)

  // Locks background scroll while the menu is open (the standard
  // mobile-menu convention) and animates the overlay itself -- a plain
  // fade/scale on the backdrop plus a staggered rise on the links,
  // matching the word-reveal stagger CinematicIntro/Journey already use
  // elsewhere on the site rather than a generic instant show/hide.
  useEffect(() => {
    const overlay = overlayRef.current
    const links = overlayLinksRef.current
    if (!overlay || !links) return
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    const ctx = gsap.context(() => {
      if (menuOpen) {
        gsap.set(overlay, { display: 'flex' })
        gsap.fromTo(overlay, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, ease: 'power2.out' })
        gsap.fromTo(
          links.children,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, delay: 0.1, ease: 'power3.out' },
        )
      } else {
        gsap.to(overlay, {
          autoAlpha: 0,
          duration: 0.25,
          ease: 'power2.in',
          onComplete: () => gsap.set(overlay, { display: 'none' }),
        })
      }
    })
    return () => ctx.revert()
  }, [menuOpen])

  const scrollToSection = (href: string) => {
    // #top is GSAP-pinned for its scroll-jacked scene sequence, so once
    // you've scrolled past it, its own element settles at the frozen
    // end-of-pin position in the doc flow (the last scene), not y=0 --
    // scrolling "to the element" would land on that last frame instead
    // of back at "Hello.". Going straight to the top of the document
    // sidesteps that entirely.
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
    // ScrollTrigger's own progress:0 boundary can be a no-perceptible-
    // change event from GSAP's own point of view if that trigger had
    // never been active before and was already reporting progress:0 by
    // default -- confirmed directly (a MutationObserver on --nav-fg
    // showed zero writes for ~1.8s after such a jump, stuck showing
    // whatever color the PREVIOUS section left behind, until Journey's
    // own auto-advance loop eventually nudged the scroll position and
    // incidentally triggered a real update). Forcing a global recompute
    // makes every active trigger's onUpdate fire immediately regardless
    // of whether GSAP thinks anything changed -- but only AFTER a
    // frame, not synchronously here: Lenis's own `scrollTo(...,
    // {immediate:true})` still applies the actual scroll position on
    // its own next animation-frame tick even though it skips the
    // smooth-scroll animation, so calling this synchronously recomputed
    // against the STALE pre-jump position and did nothing (confirmed
    // directly -- nav-fg was still stuck 1.5s after the real scroll had
    // already landed).
    requestAnimationFrame(() => ScrollTrigger.update())
  }

  const handleClick =
    (href: string) => (e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault()
      // Without this, Journey's auto-advance loop (if it happened to be
      // running) kept calling its own immediate scrollTo every tick and
      // completely overrode this click's jump -- confirmed directly:
      // clicking About while auto-advance was active didn't navigate
      // anywhere, it just kept crawling through Work instead.
      window.__markAutoAdvanceInput?.()

      // Nav now also renders on /work and /gallery, which have no
      // "#top"/"#about"/"#contact" DOM at all (and on /gallery, no
      // Lenis instance either) -- jumping straight to scrollToSection
      // there would silently do nothing. Navigate home first and poll
      // (rAF, same pattern AllWork's old "Back" link used) until the
      // Preloader has actually finished AND the target section itself
      // is ready, then jump -- firing into a half-initialized homepage
      // either lands on the wrong offset or does nothing at all.
      if (pathname !== '/') {
        maskNavigate('/', () => {
          const tryScroll = () => {
            const preloaderDone = document.body.style.overflow !== 'hidden'
            if (preloaderDone && isSectionReady(href)) {
              scrollToSection(href)
            } else {
              requestAnimationFrame(tryScroll)
            }
          }
          requestAnimationFrame(tryScroll)
        })
        return
      }

      // Nav jumps cover the screen and jump instantly underneath rather
      // than smooth-scrolling past everything in between -- scrolling
      // "Home" from deep in the Journey track used to visibly crawl
      // backwards through every chapter it had already shown.
      const jump = () => scrollToSection(href)
      if (window.__maskTransition) {
        window.__maskTransition(jump)
      } else {
        jump()
      }
    }

  // Every mobile-menu link needs to close the overlay on the way out --
  // `setMenuOpen(false)` alone isn't enough: that only SCHEDULES the
  // closing effect, which resets `document.body.style.overflow`
  // asynchronously, but `handleClick`'s own `pathname !== '/'` branch
  // polls that SAME property (via the preloader check above) to decide
  // whether the homepage has finished loading yet. Clearing it
  // synchronously here, before that polling can ever start, is what
  // keeps the two from racing.
  const closeMenu = () => {
    setMenuOpen(false)
    document.body.style.overflow = ''
  }

  return (
    <>
      <header className="fixed top-0 z-50 flex w-full items-center justify-between px-6 py-6 md:px-10">
        <a
          href="#top"
          onClick={handleClick('#top')}
          data-cursor="Home"
          className="font-display text-2xl font-bold tracking-[-0.06em] text-cream italic md:text-3xl"
        >
          .jaypeg
        </a>
        {/* Desktop nav -- the full inline list, unchanged. Collapses
            into MenuIcon's hamburger toggle below `md`: this exact row
            of five items (four links plus the sound toggle) had no
            mobile layout at all before, forced into one line regardless
            of viewport width -- confirmed directly as a real bug: on a
            390px-wide screen it ran straight off the right edge of the
            screen, "Contact" clipped and partly overlapping the logo. */}
        <nav className="hidden md:block">
          <ul className="flex items-center gap-8">
            <li>
              <Link
                to="/work"
                onClick={(e) => {
                  e.preventDefault()
                  maskNavigate('/work')
                }}
                className={NAV_LINK_CLASS}
              >
                Work
              </Link>
            </li>
            <li>
              <Link
                to="/gallery"
                onClick={(e) => {
                  e.preventDefault()
                  maskNavigate('/gallery')
                }}
                className={NAV_LINK_CLASS}
              >
                Gallery
              </Link>
            </li>
            {SECTION_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} onClick={handleClick(link.href)} className={NAV_LINK_CLASS}>
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <SoundToggle />
            </li>
          </ul>
        </nav>
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          // The icon itself is small (h-4 w-6) by design -- padding
          // grows the actual TAP target to a real touch-friendly size
          // (confirmed directly: without it, this measured 24x16px,
          // well under the ~44x44px baseline every mobile design
          // guideline recommends) without changing how the icon looks.
          className="relative z-[60] -m-3 p-3 md:hidden"
        >
          <MenuIcon open={menuOpen} />
        </button>
      </header>

      {/* Full-screen mobile menu -- hidden via `display:none` at rest
          (set in the effect above, not a Tailwind class) so GSAP can
          animate it in/out rather than it just popping. `invisible`
          here is only the SSR/no-JS fallback starting point; the effect
          takes over the instant it mounts. Large, stacked, bold links
          instead of shrinking the desktop row down -- this is a real
          tap target on a touch device, not a miniaturized version of
          the hover-driven desktop nav. Fixed ink/cream, not `bg-ink`/
          `text-cream` -- same reasoning as AboutStatementPanel/
          ViewAllPanel's own fixed colors: those resolve through the
          page's crossfading --bg/--fg vars, which can be ANYTHING
          depending on which section the menu happens to get opened
          from (About's inverted cream bg, Jayden's red, etc.) --
          independent of whatever section is currently on screen is
          exactly what a menu that overlays the whole page needs.
          `z-40`, not `z-50` -- a real, confirmed bug: at equal z-index
          with the header, this being LATER in the DOM painted it on
          top of the header's own button, covering it entirely. There
          was no way to close the menu once open -- the toggle button
          was still there and still working, just invisible and
          unclickable underneath this overlay. Staying below the
          header's z-50 keeps the button (and its own z-[60] within
          the header) reachable the whole time the menu is open. */}
      <div
        ref={overlayRef}
        className="invisible fixed inset-0 z-40 hidden flex-col justify-center bg-[#161616] px-8 md:hidden"
      >
        <div ref={overlayLinksRef} className="flex flex-col items-start gap-6">
          <Link
            to="/work"
            onClick={(e) => {
              e.preventDefault()
              closeMenu()
              maskNavigate('/work')
            }}
            className="font-display text-5xl font-bold tracking-[-0.04em] text-[#fffff0] uppercase"
          >
            Work
          </Link>
          <Link
            to="/gallery"
            onClick={(e) => {
              e.preventDefault()
              closeMenu()
              maskNavigate('/gallery')
            }}
            className="font-display text-5xl font-bold tracking-[-0.04em] text-[#fffff0] uppercase"
          >
            Gallery
          </Link>
          {SECTION_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => {
                closeMenu()
                handleClick(link.href)(e)
              }}
              className="font-display text-5xl font-bold tracking-[-0.04em] text-[#fffff0] uppercase"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </>
  )
}

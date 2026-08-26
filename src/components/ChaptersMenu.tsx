import { useEffect, useRef, useState } from 'react'
import { gsap, Draggable } from '../lib/gsap'
import { CASE_STUDIES, type CaseStudy } from '../data/caseStudies'
import { WORK_COUNT } from '../data/journeyChapters'
import { getChapterScrollOffset } from '../lib/journeyScroll'

const pad = (num: number) => String(num).padStart(2, '0')

function WorkRow({ cs, index }: { cs: CaseStudy; index: number }) {
  return (
    <div
      data-project-index={index}
      className="flex h-[26vh] w-full flex-col items-center justify-center gap-3 border-b border-cream/10 px-6 text-center"
    >
      <span className="font-body text-xs tracking-[0.22em] text-teal uppercase">
        {pad(index + 1)}/{pad(WORK_COUNT)}
      </span>
      <span className="font-display text-[7vw] font-bold tracking-[-0.06em] text-cream uppercase md:text-[4.5vw]">
        {cs.title}
      </span>
      <span className="font-body text-xs tracking-wider text-cream/50 uppercase">
        {cs.category}
      </span>
    </div>
  )
}

export function ChaptersMenu() {
  const [open, setOpen] = useState(false)
  // Held mounted an extra beat past `open` so the close animation has
  // something to animate before the overlay actually leaves the DOM --
  // toggling display off immediately on `open === false` would cut the
  // reverse tween off after one frame.
  const [mounted, setMounted] = useState(false)
  const iconRef = useRef<HTMLButtonElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  // Desktop-only, same matchMedia gating precedent as Cursor.tsx --
  // there's no pinned Journey track to jump within on mobile.
  const [isDesktop] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches,
  )
  // The trigger has nothing to do until there's an actual chapter to
  // jump to, so gate on Journey's own section entering view rather than
  // on the intro leaving it -- #top settles into normal document flow
  // once its pin releases (matching the frozen last-pin position, per
  // the same mechanics Nav's #top special-case already accounts for),
  // so it keeps reporting "intersecting" for a full extra viewport
  // height after the intro is visually done, which left a dead zone
  // where you'd already be looking at Work but the button hadn't
  // appeared yet.
  const [journeyInView, setJourneyInView] = useState(false)

  const handleJump = (index: number) => {
    window.__markAutoAdvanceInput?.()
    const offset = getChapterScrollOffset(index)
    if (offset != null) window.__lenis?.scrollTo(offset)
    closeMenu()
  }

  // Flagged globally so Journey's own auto-advance loop can pause while
  // this overlay is open -- otherwise the page could keep scrolling
  // underneath while the user is looking at the work list instead.
  const openMenu = () => {
    window.__chaptersMenuOpen = true
    setMounted(true)
    setOpen(true)
  }
  const closeMenu = () => {
    window.__chaptersMenuOpen = false
    setOpen(false)
  }

  useEffect(() => {
    if (!isDesktop) return
    const journey = document.getElementById('journey')
    if (!journey) return
    const observer = new IntersectionObserver(
      ([entry]) => setJourneyInView(entry.isIntersecting),
      { threshold: 0 },
    )
    observer.observe(journey)
    return () => observer.disconnect()
  }, [isDesktop])

  // Morphs the 2x2 dot grid into an X (the universal "close" shape) --
  // each dot rotates in place and the pair on the leading diagonal
  // slides slightly to meet its partner, so the icon itself communicates
  // open/close state instead of just sitting there identically in both.
  useEffect(() => {
    const icon = iconRef.current
    if (!icon) return
    const dots = icon.querySelectorAll('span')
    gsap.to(dots, {
      rotate: open ? 45 : 0,
      x: open ? (i: number) => (i % 2 === 0 ? 3 : -3) : 0,
      y: open ? (i: number) => (i < 2 ? 3 : -3) : 0,
      duration: 0.45,
      stagger: 0.03,
      ease: 'power3.inOut',
    })
  }, [open])

  useEffect(() => {
    if (!mounted || !overlayRef.current) return
    if (open) {
      gsap.fromTo(
        overlayRef.current,
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power2.out' },
      )
    } else {
      gsap.to(overlayRef.current, {
        autoAlpha: 0,
        y: 16,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => setMounted(false),
      })
    }
  }, [open, mounted])

  // The list renders CASE_STUDIES twice back to back, so its full
  // scrollHeight is exactly two of these "set" heights -- moving by one
  // set height and wrapping back is visually seamless, same technique
  // the old horizontal WorkCarousel used for its marquee, just vertical.
  useEffect(() => {
    if (!mounted) return
    const track = trackRef.current
    if (!track) return
    const setHeight = track.scrollHeight / 2
    const SPEED = 36 // px/s, slow and readable -- matches the site's other auto-advances

    let marquee: gsap.core.Tween

    // Rows drift upward (top-to-bottom reading order), so y animates
    // DOWN toward -setHeight and instantly resets to 0 to repeat --
    // seamless because set two (the clone) sits at exactly the position
    // set one occupies at y: 0, so the reset is visually identical to
    // the frame before it.
    const startMarquee = (fromY: number) => {
      const remaining = -setHeight - fromY
      return gsap.to(track, {
        y: -setHeight,
        duration: Math.max(Math.abs(remaining) / SPEED, 0.1),
        ease: 'none',
        repeat: -1,
        onRepeat: () => gsap.set(track, { y: 0 }),
      })
    }

    gsap.set(track, { y: 0 })
    marquee = startMarquee(0)

    const [draggable] = Draggable.create(track, {
      type: 'y',
      inertia: true,
      cursor: 'grab',
      activeCursor: 'grabbing',
      onPress() {
        marquee.pause()
      },
      onThrowComplete() {
        const current = gsap.getProperty(track, 'y') as number
        const wrapped = gsap.utils.wrap(-setHeight, 0)(current)
        gsap.set(track, { y: wrapped })
        marquee.kill()
        marquee = startMarquee(wrapped)
      },
      // Draggable tells a real click/tap (no meaningful movement) apart
      // from a drag release, which a plain onClick on the track couldn't
      // do -- without this, releasing a drag anywhere near a row would
      // also fire a jump to that row.
      onClick() {
        const target = this.pointerEvent.target as HTMLElement
        const row = target.closest('[data-project-index]')
        if (row) handleJump(Number(row.getAttribute('data-project-index')))
      },
    })

    return () => {
      marquee.kill()
      draggable.kill()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted])

  if (!isDesktop || !journeyInView) return null

  return (
    <>
      <button
        ref={iconRef}
        type="button"
        onClick={openMenu}
        aria-label="View all work"
        data-cursor="View All"
        className="fixed bottom-8 left-8 z-40 grid grid-cols-2 gap-1 text-cream/60 transition-colors hover:text-cream md:bottom-16 md:left-16"
      >
        <span className="h-1.5 w-1.5 border border-current" />
        <span className="h-1.5 w-1.5 border border-current" />
        <span className="h-1.5 w-1.5 border border-current" />
        <span className="h-1.5 w-1.5 border border-current" />
      </button>

      {mounted && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-[70] overflow-hidden bg-ink/95"
        >
          <button
            type="button"
            onClick={closeMenu}
            className="font-body fixed top-6 right-6 z-10 text-xs tracking-[0.22em] text-cream/60 uppercase transition-colors hover:text-cream md:top-10 md:right-10"
          >
            (Close)
          </button>

          <div
            className="absolute inset-0 overflow-hidden"
            data-cursor="Drag"
          >
            <div ref={trackRef} className="absolute inset-x-0 top-0 flex flex-col">
              {CASE_STUDIES.map((cs, i) => (
                <WorkRow key={cs.slug} cs={cs} index={i} />
              ))}
              {CASE_STUDIES.map((cs, i) => (
                <WorkRow key={`${cs.slug}-clone`} cs={cs} index={i} />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

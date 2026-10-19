import { useLayoutEffect, useRef } from 'react'
import { PROJECTS, type ProjectImage } from '../data/projects'
import { ProjectMedia } from './ProjectMedia'
import { gsap, Observer } from '../lib/gsap'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

const COLUMN_COUNT = 5
// The first 3 stay visible at every width; the last 2 are hidden below
// md (see the column's className below) -- that alone takes the layout
// from 5 bleeding-off-both-edges columns down to 3 flush ones on
// mobile, matching the reference's own mobile treatment, with no extra
// branching logic anywhere else in this component.
const MOBILE_VISIBLE_COLUMNS = 3

// Every image/gif/video across all placeholder projects, flattened
// into one pool -- this canvas is purely decorative filler (see
// Gallery.tsx for why it isn't wired up to browse any one project), so
// it draws from everything rather than being tied to a single project.
const MEDIA_POOL: ProjectImage[] = PROJECTS.flatMap((p) => [p.cover, ...p.images])

type Tile = { kind: 'media'; media: ProjectImage; key: string } | { kind: 'wordmark'; key: string }

function buildColumns(): Tile[][] {
  const columns: Tile[][] = Array.from({ length: COLUMN_COUNT }, () => [])
  MEDIA_POOL.forEach((media, i) => {
    columns[i % COLUMN_COUNT].push({ kind: 'media', media, key: `${i}` })
  })
  // The site's own wordmark as one of the tiles in the flow, the same
  // way the reference uses its own name as a tile rather than a fixed
  // overlay -- dropped into the middle column.
  columns[Math.floor(COLUMN_COUNT / 2)].splice(1, 0, { kind: 'wordmark', key: 'wordmark' })
  return columns
}

const COLUMNS = buildColumns()

function MoodboardTile({ tile }: { tile: Tile }) {
  if (tile.kind === 'wordmark') {
    return (
      <div className="flex aspect-square items-center justify-center bg-teal">
        <span className="font-display text-[14vw] font-bold tracking-[-0.06em] text-ink italic md:text-[4vw]">
          .jaypeg
        </span>
      </div>
    )
  }
  return <ProjectMedia media={tile.media} decorative />
}

// A column's own list, rendered twice back to back -- the seamless-
// loop trick this whole canvas depends on. Scrolling a column up by
// exactly one copy's height (its `period`, measured after mount) looks
// identical to not having scrolled at all, because the second copy is
// now sitting exactly where the first one started.
function MoodboardColumn({
  tiles,
  stripRef,
  hiddenOnMobile,
}: {
  tiles: Tile[]
  stripRef: (el: HTMLDivElement | null) => void
  hiddenOnMobile: boolean
}) {
  return (
    <div className={`flex-1 overflow-hidden ${hiddenOnMobile ? 'hidden md:block' : ''}`}>
      <div ref={stripRef} className="flex flex-col gap-3 md:gap-4">
        {[...tiles, ...tiles].map((tile, i) => (
          <div key={`${tile.key}-${i}`} className="shrink-0">
            <MoodboardTile tile={tile} />
          </div>
        ))}
      </div>
    </div>
  )
}

// The infinite, continuously-drifting mood-board backdrop from the
// reference (juliajohnson.com) -- a handful of columns of tiles,
// each looping seamlessly and drifting at its own speed for depth,
// driven by wheel/touch/drag input rather than real page scroll (the
// reference's own body never actually scrolls either -- confirmed
// directly: its scrollHeight stays pinned at one viewport's height no
// matter how far you "scroll"). GSAP's Observer plugin is the
// dedicated tool for exactly this -- already registered in lib/gsap.ts
// and unused until now.
export function MoodboardCanvas() {
  const prefersReducedMotion = usePrefersReducedMotion()
  const stageRef = useRef<HTMLDivElement>(null)
  const stripRefs = useRef<(HTMLDivElement | null)[]>([])

  useLayoutEffect(() => {
    // Static instead of animated for reduced-motion -- a continuously
    // drifting, scroll-hijacking canvas is the opposite of what that
    // preference asks for, so this skips Observer/the ticker entirely
    // rather than trying to tone the motion down.
    if (prefersReducedMotion || !stageRef.current) return

    const strips = stripRefs.current.slice(0, COLUMN_COUNT)
    // Each strip holds its tiles TWICE (see MoodboardColumn), so half
    // its measured height is one real copy's worth -- that's the
    // distance after which wrapping is seamless.
    const periods = strips.map((strip) => (strip ? strip.scrollHeight / 2 : 0))
    // A small per-column stagger seed so columns don't all start
    // perfectly aligned -- without it every column shows its first
    // tile in the same row at rest, reading as a plain grid instead of
    // the reference's scattered, offset look.
    const phases = strips.map((_, i) => i * 140)

    let rawY = 0
    let currentY = 0
    let frameId = 0

    const tick = () => {
      // Lerped toward the raw input target each frame instead of
      // jumping straight to it -- this is what gives the drift its
      // soft, momentum-like feel instead of tracking the wheel 1:1.
      currentY += (rawY - currentY) * 0.08
      strips.forEach((strip, i) => {
        const period = periods[i]
        if (!strip || !period) return
        const speed = 0.85 + (i % 3) * 0.2
        gsap.set(strip, { y: gsap.utils.wrap(-period, 0, currentY * speed + phases[i]) })
      })
      frameId = requestAnimationFrame(tick)
    }
    frameId = requestAnimationFrame(tick)

    const observer = Observer.create({
      target: stageRef.current,
      type: 'wheel,touch,pointer',
      // Scrolling/dragging down should feel like pulling content UP,
      // same as a normal page -- deltaY is positive for a downward
      // wheel tick, so it's subtracted to make the strips' own y go
      // more negative (upward) in response.
      onChange: (self) => {
        rawY -= self.deltaY
      },
      preventDefault: true,
    })

    return () => {
      cancelAnimationFrame(frameId)
      observer.kill()
    }
  }, [prefersReducedMotion])

  return (
    <div
      ref={stageRef}
      // aria-hidden -- this canvas conveys no information (see
      // ProjectMedia's `decorative` prop and Gallery.tsx for why it
      // isn't a navigable gallery); a screen reader stepping through
      // dozens of near-duplicate decorative tiles would be pure noise.
      aria-hidden="true"
      // select-none -- dragging to pan with a mouse would otherwise
      // also trigger the browser's native text-selection highlight on
      // the placeholder labels, a distracting artifact confirmed
      // directly while testing drag input.
      className="relative h-screen w-screen touch-none overflow-hidden bg-ink select-none"
    >
      <div className="absolute inset-y-0 left-0 flex w-full gap-3 md:-left-[10vw] md:w-[120vw] md:gap-4">
        {COLUMNS.map((tiles, i) => (
          <MoodboardColumn
            key={i}
            tiles={tiles}
            hiddenOnMobile={i >= MOBILE_VISIBLE_COLUMNS}
            stripRef={(el) => {
              stripRefs.current[i] = el
            }}
          />
        ))}
      </div>
    </div>
  )
}

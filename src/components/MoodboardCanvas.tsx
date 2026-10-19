import { useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { PROJECTS, type ProjectImage } from '../data/projects'
import { ProjectMedia } from './ProjectMedia'
import { gsap, Observer } from '../lib/gsap'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

type Tile = { kind: 'media'; media: ProjectImage; key: string } | { kind: 'wordmark'; key: string }

// Every image/gif/video across all placeholder projects, flattened
// into one pool and used TWICE over -- this canvas is purely
// decorative filler (see Gallery.tsx for why it isn't wired up to
// browse any one project), so it draws from everything rather than
// being tied to a single project. Using the pool twice just gives the
// underlying pattern more content before it visibly repeats itself;
// the canvas itself already loops infinitely regardless (see PATTERN
// below).
const MEDIA_POOL: ProjectImage[] = PROJECTS.flatMap((p) => [p.cover, ...p.images])

function buildTileList(): Tile[] {
  const tiles: Tile[] = [...MEDIA_POOL, ...MEDIA_POOL].map((media, i) => ({
    kind: 'media',
    media,
    key: `${i}`,
  }))
  // The site's own wordmark as one of the tiles, the same way the
  // reference uses its own name as a tile in the flow rather than a
  // fixed overlay -- dropped roughly in the middle of the list so the
  // packer below places it wherever the shortest column happens to be
  // at that point, same as any other tile.
  tiles.splice(Math.floor(tiles.length / 2), 0, { kind: 'wordmark', key: 'wordmark' })
  return tiles
}

interface PlacedTile {
  tile: Tile
  x: number
  y: number
  width: number
}
interface Pattern {
  placed: PlacedTile[]
  width: number
  height: number
}

// Classic masonry packing: each tile goes into whichever column is
// currently shortest, with its own height derived from its real aspect
// ratio rather than a fixed row height -- that variation (not just
// different scroll speeds) is what reads as an organic layout instead
// of a uniform grid.
function packMasonry(tiles: Tile[], columns: number, columnWidth: number, gap: number): Pattern {
  const colHeights = new Array(columns).fill(0)
  const placed = tiles.map((tile): PlacedTile => {
    // The wordmark gets a taller-than-wide slot (not a plain square) so
    // it reads as a deliberate, larger feature tile rather than just
    // another photo-shaped box.
    const aspect = tile.kind === 'wordmark' ? 0.75 : tile.media.width / tile.media.height
    const height = columnWidth / aspect
    let col = 0
    for (let i = 1; i < columns; i++) if (colHeights[i] < colHeights[col]) col = i
    const placedTile: PlacedTile = { tile, x: col * (columnWidth + gap), y: colHeights[col], width: columnWidth }
    colHeights[col] += height + gap
    return placedTile
  })
  return {
    placed,
    width: columns * (columnWidth + gap) - gap,
    height: Math.max(...colHeights) - gap,
  }
}

const DESKTOP_LAYOUT = { columns: 6, columnWidth: 280, gap: 20 }
const MOBILE_LAYOUT = { columns: 4, columnWidth: 100, gap: 8 }
const DESKTOP_BREAKPOINT = '(min-width: 768px)'

// The pattern is repeated in a 3x3 block around the wrapped pan
// position so the viewport stays fully covered no matter where that
// position currently sits -- with a 1-pattern margin on every side,
// covering the worst case only needs the pattern itself to be at least
// half the viewport's size, which comfortably holds even on very wide
// desktop monitors at the sizes above.
const PATTERN_REPEATS = [-1, 0, 1]

function MoodboardTile({ placed }: { placed: PlacedTile }) {
  if (placed.tile.kind === 'wordmark') {
    const style: CSSProperties = { position: 'absolute', left: placed.x, top: placed.y, width: placed.width }
    return (
      <div style={{ ...style, aspectRatio: '0.75' }} className="flex items-center justify-center bg-teal">
        <span className="font-display text-2xl font-bold tracking-[-0.06em] text-ink italic md:text-4xl">
          .jaypeg
        </span>
      </div>
    )
  }
  // No explicit height here -- ProjectMedia reserves its own via
  // aspect-ratio from the SAME media.width/height the packer above
  // used to compute column heights, so the two stay geometrically
  // consistent without this duplicating that math.
  return (
    <div style={{ position: 'absolute', left: placed.x, top: placed.y, width: placed.width }}>
      <ProjectMedia media={placed.tile.media} decorative />
    </div>
  )
}

// The infinite, continuously-drifting mood-board backdrop from the
// reference (juliajohnson.com) -- confirmed directly: its own canvas
// never stops moving even with zero interaction (not just after an
// idle timeout), its body never really scrolls (scrollHeight stays
// pinned at one viewport no matter how far you "scroll"), and nothing
// in it is a link. GSAP's Observer plugin stands in for real scroll,
// already registered in lib/gsap.ts and unused until now.
export function MoodboardCanvas() {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [isDesktop] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(DESKTOP_BREAKPOINT).matches,
  )
  const stageRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const pattern = useMemo(() => {
    const layout = isDesktop ? DESKTOP_LAYOUT : MOBILE_LAYOUT
    return packMasonry(buildTileList(), layout.columns, layout.columnWidth, layout.gap)
  }, [isDesktop])

  useLayoutEffect(() => {
    // Static instead of animated for reduced-motion -- a continuously
    // drifting, scroll-hijacking canvas is the opposite of what that
    // preference asks for, so this skips Observer/the ticker entirely
    // rather than trying to tone the motion down. (With only the [0,0]
    // pattern copy rendered in that case -- see the JSX below -- there's
    // nothing for a transform to do anyway.)
    if (prefersReducedMotion || !stageRef.current || !wrapperRef.current) return

    const wrapper = wrapperRef.current
    const { width: patternWidth, height: patternHeight } = pattern
    // A gentle constant drift, always applied -- this is what keeps the
    // canvas "carouseling" on its own with zero input, matching the
    // reference's own always-on movement rather than an idle-after-
    // timeout behavior.
    const AUTO_VX = -16
    const AUTO_VY = -24

    let targetX = 0
    let targetY = 0
    let currentX = 0
    let currentY = 0
    let last = performance.now()
    let frameId = 0

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      targetX += AUTO_VX * dt
      targetY += AUTO_VY * dt
      // Lerped toward the target rather than jumping straight to it --
      // this is what gives the drift (and the user's own input) a
      // soft, organic feel instead of tracking 1:1 every frame.
      currentX += (targetX - currentX) * 0.1
      currentY += (targetY - currentY) * 0.1
      gsap.set(wrapper, {
        x: gsap.utils.wrap(-patternWidth, 0, currentX),
        y: gsap.utils.wrap(-patternHeight, 0, currentY),
      })
      frameId = requestAnimationFrame(tick)
    }
    frameId = requestAnimationFrame(tick)

    const observer = Observer.create({
      target: stageRef.current,
      type: 'wheel,touch,pointer',
      onChange: (self) => {
        // Dragging (touch/pointer) reads right when content follows the
        // finger/cursor directly; wheel/trackpad-scroll reads right with
        // the usual inverted convention (scrolling down reveals what's
        // below). Observer's own isDragging flag is what lets one
        // handler serve both without their directions fighting.
        if (self.isDragging) {
          targetX += self.deltaX
          targetY += self.deltaY
        } else {
          targetX -= self.deltaX
          targetY -= self.deltaY
        }
      },
      preventDefault: true,
    })

    return () => {
      cancelAnimationFrame(frameId)
      observer.kill()
    }
  }, [prefersReducedMotion, pattern])

  const repeats = prefersReducedMotion ? [0] : PATTERN_REPEATS

  return (
    <div
      ref={stageRef}
      // aria-hidden -- this canvas conveys no information (see
      // ProjectMedia's `decorative` prop and Gallery.tsx for why it
      // isn't a navigable gallery); a screen reader stepping through
      // dozens of near-duplicate decorative tiles would be pure noise.
      aria-hidden="true"
      // select-none -- dragging to pan would otherwise also trigger the
      // browser's native text-selection highlight on the placeholder
      // labels, a distracting artifact confirmed directly while testing
      // drag input on the previous (column-based) version of this.
      className="relative h-screen w-screen touch-none overflow-hidden bg-ink select-none"
    >
      <div ref={wrapperRef} className="absolute inset-0">
        {repeats.flatMap((rx) =>
          repeats.map((ry) => (
            <div
              key={`${rx}-${ry}`}
              style={{
                position: 'absolute',
                left: rx * pattern.width,
                top: ry * pattern.height,
                width: pattern.width,
                height: pattern.height,
              }}
            >
              {pattern.placed.map((placed, i) => (
                <MoodboardTile key={i} placed={placed} />
              ))}
            </div>
          )),
        )}
      </div>
    </div>
  )
}

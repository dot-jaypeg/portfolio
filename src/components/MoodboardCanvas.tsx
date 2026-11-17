import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { GALLERY_PHOTOS, CATEGORY_LABEL, type GalleryPhoto } from '../data/galleryPhotos'
import { ProjectMedia } from './ProjectMedia'
import { gsap, Observer } from '../lib/gsap'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

type Tile = { kind: 'media'; media: GalleryPhoto; key: string } | { kind: 'wordmark'; key: string }

// The real photography pool (event/sports, graduation, landscape &
// nature -- see src/data/galleryPhotos.ts). One pass through it is
// already 111 distinct photos -- plenty not to feel repetitive within
// a single pattern cycle, unlike the old handful of placeholder
// projects this used to draw from (which needed doubling up just to
// feel substantial).
const MEDIA_POOL: GalleryPhoto[] = GALLERY_PHOTOS

function buildTileList(): Tile[] {
  const tiles: Tile[] = MEDIA_POOL.map((media, i) => ({
    kind: 'media',
    media,
    key: `${i}`,
  }))
  // The site's own wordmark as one of the tiles, the same way the
  // reference uses its own name as a tile in the flow rather than a
  // fixed overlay -- dropped roughly in the middle of the list, same
  // cell size as every other tile (see packGrid below).
  tiles.splice(Math.floor(tiles.length / 2), 0, { kind: 'wordmark', key: 'wordmark' })
  return tiles
}

interface PlacedTile {
  tile: Tile
  x: number
  y: number
  width: number
  height: number
}
interface Pattern {
  placed: PlacedTile[]
  width: number
  height: number
}

// A strict, uniform grid -- every tile the same fixed cell size
// (object-cover crops whatever the real photo's own aspect ratio is to
// fit), laid out row-major rather than masonry-packed by real aspect
// ratio. The previous masonry version let each column's real photos
// run to a different total height, which meant shorter columns fell
// short of the tallest one and left a gap right where the infinite
// pattern repeated -- a real, confirmed seam. A uniform grid can't
// have that problem: every row is the same height by construction, so
// the pattern tiles seamlessly with no special-casing needed.
function packGrid(tiles: Tile[], columns: number, cellWidth: number, cellHeight: number, gap: number): Pattern {
  const placed = tiles.map((tile, i): PlacedTile => {
    const col = i % columns
    const row = Math.floor(i / columns)
    return { tile, x: col * (cellWidth + gap), y: row * (cellHeight + gap), width: cellWidth, height: cellHeight }
  })
  const rows = Math.ceil(tiles.length / columns)
  return {
    placed,
    width: columns * (cellWidth + gap) - gap,
    height: rows * (cellHeight + gap) - gap,
  }
}

// A 4:5 cell -- portrait enough to suit this pool's mostly-portrait
// photos without cropping the landscape ones down too aggressively.
const DESKTOP_LAYOUT = { columns: 6, cellWidth: 280, cellHeight: 350, gap: 20 }
const MOBILE_LAYOUT = { columns: 4, cellWidth: 100, cellHeight: 125, gap: 8 }
const DESKTOP_BREAKPOINT = '(min-width: 768px)'

// The pattern is repeated in a 3x3 block around the wrapped pan
// position so the viewport stays fully covered no matter where that
// position currently sits -- with a 1-pattern margin on every side,
// covering the worst case only needs the pattern itself to be at least
// half the viewport's size, which comfortably holds even on very wide
// desktop monitors at the sizes above.
const PATTERN_REPEATS = [-1, 0, 1]

function MoodboardTile({ placed, onSelect }: { placed: PlacedTile; onSelect: (photo: GalleryPhoto) => void }) {
  if (placed.tile.kind === 'wordmark') {
    const style: CSSProperties = { position: 'absolute', left: placed.x, top: placed.y, width: placed.width, height: placed.height }
    return (
      <div style={style} className="flex items-center justify-center bg-teal">
        <span className="font-display text-2xl font-bold tracking-[-0.06em] text-ink italic md:text-4xl">
          .jaypeg
        </span>
      </div>
    )
  }
  const media = placed.tile.media
  return (
    <button
      type="button"
      onClick={() => onSelect(media)}
      // tabIndex -1 -- the canvas itself is aria-hidden (see the note
      // on the root element below), so these would otherwise still be
      // real stops in the keyboard Tab order despite being invisible
      // to assistive tech, a dead/confusing focus trail through
      // however many tiles are currently mounted.
      tabIndex={-1}
      data-cursor="View"
      className="group absolute left-0 top-0 block cursor-pointer overflow-hidden"
      style={{ left: placed.x, top: placed.y, width: placed.width, height: placed.height }}
    >
      <ProjectMedia media={media} decorative heightOverride={placed.height} />
    </button>
  )
}

// The infinite, continuously-drifting mood-board backdrop from the
// reference (juliajohnson.com) -- confirmed directly: its own canvas
// never stops moving even with zero interaction (not just after an
// idle timeout), its body never really scrolls (scrollHeight stays
// pinned at one viewport no matter how far you "scroll"). GSAP's
// Observer plugin stands in for real scroll, already registered in
// lib/gsap.ts.
//
// Unlike the very first pass at this, clicking a tile now DOES do
// something -- it scales up into a centered lightbox with that
// photo's category (Events & Sports / Graduation / Natural &
// Landscape), matching what was asked for directly. The wall itself
// stays a decorative backdrop (aria-hidden, no stable reading order --
// tiles repeat and drift), but the opened lightbox is real, focusable
// content.
export function MoodboardCanvas() {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [isDesktop] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(DESKTOP_BREAKPOINT).matches,
  )
  const stageRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const imgWrapRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const pausedRef = useRef(false)
  const [selected, setSelected] = useState<GalleryPhoto | null>(null)

  const pattern = useMemo(() => {
    const layout = isDesktop ? DESKTOP_LAYOUT : MOBILE_LAYOUT
    return packGrid(buildTileList(), layout.columns, layout.cellWidth, layout.cellHeight, layout.gap)
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
      if (!pausedRef.current) {
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
      }
      frameId = requestAnimationFrame(tick)
    }
    frameId = requestAnimationFrame(tick)

    const observer = Observer.create({
      target: stageRef.current,
      type: 'wheel,touch,pointer',
      onChange: (self) => {
        // Frozen while a lightbox is open -- scrolling/dragging behind
        // it would otherwise shift the wall around invisibly, which
        // then jumps to a new position the instant it closes.
        if (pausedRef.current) return
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

  useEffect(() => {
    pausedRef.current = selected !== null
  }, [selected])

  // Escape closes the lightbox from anywhere, same as clicking out.
  useEffect(() => {
    if (!selected) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelected(null)
    }
    window.addEventListener('keydown', handleKey)
    closeButtonRef.current?.focus()
    return () => window.removeEventListener('keydown', handleKey)
  }, [selected])

  useEffect(() => {
    if (!selected || !overlayRef.current || !imgWrapRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: prefersReducedMotion ? 0 : 0.35, ease: 'power2.out' })
      gsap.fromTo(
        imgWrapRef.current,
        { opacity: 0, scale: 0.92 },
        { opacity: 1, scale: 1, duration: prefersReducedMotion ? 0 : 0.45, ease: 'power3.out' },
      )
    })
    return () => ctx.revert()
  }, [selected, prefersReducedMotion])

  const repeats = prefersReducedMotion ? [0] : PATTERN_REPEATS

  return (
    <>
      <div
        ref={stageRef}
        // aria-hidden -- this canvas conveys no information on its own
        // (see ProjectMedia's `decorative` prop); a screen reader
        // stepping through dozens of repeating, drifting tiles would be
        // pure noise. The lightbox a click opens (below) is real
        // content and isn't part of this hidden subtree.
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
                  <MoodboardTile key={i} placed={placed} onSelect={setSelected} />
                ))}
              </div>
            )),
          )}
        </div>
      </div>

      {selected && (
        <div
          ref={overlayRef}
          onClick={() => setSelected(null)}
          className="fixed inset-0 z-[90] flex flex-col items-center justify-center gap-6 bg-ink/90 px-6 backdrop-blur-sm"
        >
          <button
            ref={closeButtonRef}
            type="button"
            onClick={() => setSelected(null)}
            aria-label="Close"
            className="font-body absolute top-6 right-6 text-xs tracking-[0.22em] text-cream/60 uppercase transition-colors hover:text-cream"
          >
            Close [X]
          </button>
          <div ref={imgWrapRef} className="flex flex-col items-center gap-5">
            <img
              src={selected.src}
              alt={selected.alt}
              style={{ aspectRatio: `${selected.width} / ${selected.height}` }}
              className="max-h-[75vh] max-w-[90vw] object-contain"
            />
            <p className="font-body text-xs tracking-[0.25em] text-cream/70 uppercase">
              {CATEGORY_LABEL[selected.category]}
            </p>
          </div>
        </div>
      )}
    </>
  )
}

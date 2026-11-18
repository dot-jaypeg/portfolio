import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { GALLERY_PHOTOS, CATEGORY_LABEL, type GalleryPhoto } from '../data/galleryPhotos'
import { ProjectMedia } from './ProjectMedia'
import { gsap, Observer } from '../lib/gsap'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

type Tile = { kind: 'media'; media: GalleryPhoto; key: string } | { kind: 'wordmark'; key: string }

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b)
}

// galleryPhotos.ts lists photos grouped by category/filename, so
// photos from the same shoot (same lighting, same background) sit
// right next to each other on disk -- up to 14 in a row, confirmed
// directly. Side by side in the grid, a run like that reads as one
// blended/overlapping section rather than a wall of distinct photos.
// A fixed-stride reorder (a golden-ratio interleave) spreads
// originally-adjacent photos apart without needing to parse filenames
// for "which shoot is this" -- confirmed directly too: it drops that
// same longest run from 14 to 1.
function interleave<T>(items: T[]): T[] {
  const n = items.length
  if (n < 3) return items
  let stride = Math.round(n * 0.618)
  while (gcd(stride, n) !== 1) stride += 1
  return Array.from({ length: n }, (_, i) => items[(i * stride) % n])
}

// The real photography pool (event/sports, graduation, landscape &
// nature -- see src/data/galleryPhotos.ts). One pass through it is
// already 111 distinct photos -- plenty not to feel repetitive within
// a single pattern cycle, unlike the old handful of placeholder
// projects this used to draw from (which needed doubling up just to
// feel substantial).
const MEDIA_POOL: GalleryPhoto[] = interleave(GALLERY_PHOTOS)

function buildTileList(): Tile[] {
  const tiles: Tile[] = MEDIA_POOL.map((media, i) => ({
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

interface ColumnTile {
  tile: Tile
  y: number
  height: number
}
interface ColumnData {
  tiles: ColumnTile[]
  // Total content height of this one column, no trailing gap --
  // every column gets its OWN value here, not a shared one across
  // the whole grid (see the note on packColumns below).
  height: number
}

// Classic masonry packing -- each tile goes into whichever column is
// currently shortest, sized at this column's fixed width and whatever
// height its own real aspect ratio calls for at that width. Nothing
// crops or stretches any tile to make columns match: object-cover had
// nothing to crop in the first place once the box's aspect ratio
// already equals the photo's own, so every photo renders at exactly
// the ratio it was shot at.
//
// That means columns legitimately end up different total heights --
// real photos' aspect ratios don't divide evenly. Rather than forcing
// them to match (which only ever worked by cropping something), each
// column loops on ITS OWN height independently (see the per-column
// `y` transform in MoodboardCanvas) instead of the whole grid sharing
// one pattern height. No shared height to match means no seam to
// close in the first place.
function packColumns(tiles: Tile[], columns: number, columnWidth: number, gap: number): ColumnData[] {
  const cols: ColumnData[] = Array.from({ length: columns }, () => ({ tiles: [], height: 0 }))
  tiles.forEach((tile) => {
    // The wordmark gets a taller-than-wide slot (not a plain square) so
    // it reads as a deliberate, larger feature tile rather than just
    // another photo-shaped box.
    const aspect = tile.kind === 'wordmark' ? 0.75 : tile.media.width / tile.media.height
    const height = columnWidth / aspect
    let col = 0
    for (let c = 1; c < columns; c++) if (cols[c].height < cols[col].height) col = c
    cols[col].tiles.push({ tile, y: cols[col].height, height })
    cols[col].height += height + gap
  })
  cols.forEach((c) => {
    c.height -= gap
  })
  return cols
}

// Noticeably more generous than a tight editorial grid -- closer to
// the breathing room juliajohnson.com's own mood-board reference
// leaves around each image -- so the wall reads as a loose scatter of
// distinct photos, not packed tiles with barely a seam between them.
const DESKTOP_LAYOUT = { columns: 5, columnWidth: 320, gap: 48 }
const MOBILE_LAYOUT = { columns: 3, columnWidth: 120, gap: 20 }
const DESKTOP_BREAKPOINT = '(min-width: 768px)'

// Horizontal repeats of the whole multi-column block, so panning
// sideways always has another copy ready to slide into view -- see
// the `xWrapperRef` transform in MoodboardCanvas. Vertical looping is
// handled per-column instead (each one wraps on its own height), so
// there's no equivalent vertical repeat needed here.
const RX = [-1, 0, 1]

function MoodboardTile({
  tile,
  y,
  width,
  height,
  onSelect,
}: {
  tile: Tile
  y: number
  width: number
  height: number
  onSelect: (photo: GalleryPhoto) => void
}) {
  if (tile.kind === 'wordmark') {
    const style: CSSProperties = { position: 'absolute', left: 0, top: y, width, height }
    return (
      <div style={style} className="flex flex-col items-center justify-center gap-4 bg-teal">
        <span className="font-display text-2xl font-bold tracking-[-0.06em] text-ink italic md:text-4xl">
          .jaypeg
        </span>
        <a
          href="mailto:design.jaypeg@gmail.com?subject=Photoshoot%20Booking%20Request"
          data-cursor="Email"
          className="font-body rounded-full border border-ink/40 px-4 py-2 text-[10px] font-medium tracking-[0.18em] text-ink uppercase transition-colors duration-300 hover:bg-ink hover:text-teal"
        >
          Contact
        </a>
      </div>
    )
  }
  const media = tile.media
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
      className="group absolute left-0 block cursor-pointer overflow-hidden"
      style={{ top: y, width, height }}
    >
      <ProjectMedia media={media} decorative heightOverride={height} />
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
  const xWrapperRef = useRef<HTMLDivElement>(null)
  const columnRefs = useRef<(HTMLDivElement | null)[]>([])
  const overlayRef = useRef<HTMLDivElement>(null)
  const imgWrapRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const pausedRef = useRef(false)
  const [selected, setSelected] = useState<GalleryPhoto | null>(null)

  const layout = isDesktop ? DESKTOP_LAYOUT : MOBILE_LAYOUT
  const cols = useMemo(
    () => packColumns(buildTileList(), layout.columns, layout.columnWidth, layout.gap),
    [layout.columns, layout.columnWidth, layout.gap],
  )
  // Deliberately NOT "columns * (columnWidth + gap) - gap" -- that
  // would put the last column's right edge exactly at the next
  // block's left edge, closing the gap to zero right where the
  // horizontal repeat seams (every `columns` columns while panning
  // sideways), while every other column-to-column gap stays the
  // configured size. Keeping the trailing gap in this width is what
  // makes that seam match every other gap instead of disappearing.
  const blockWidth = layout.columns * (layout.columnWidth + layout.gap)

  const rxList = prefersReducedMotion ? [0] : RX
  const dupList = prefersReducedMotion ? [0] : [0, 1]

  useLayoutEffect(() => {
    // Static instead of animated for reduced-motion -- a continuously
    // drifting, scroll-hijacking canvas is the opposite of what that
    // preference asks for, so this skips Observer/the ticker entirely
    // rather than trying to tone the motion down. (With only one
    // column copy and one horizontal block rendered in that case --
    // see the JSX below -- there's nothing for a transform to do
    // anyway.)
    if (prefersReducedMotion || !stageRef.current || !xWrapperRef.current) return

    const xWrapper = xWrapperRef.current
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
        gsap.set(xWrapper, { x: gsap.utils.wrap(-blockWidth, 0, currentX) })
        // Each column wraps on its OWN height (+ the gap that would
        // otherwise sit between the real content and its own looped
        // copy) -- not a value shared across columns, since they
        // legitimately aren't the same height (see packColumns).
        cols.forEach((col, c) => {
          const period = col.height + layout.gap
          const y = gsap.utils.wrap(-period, 0, currentY)
          for (let rxIndex = 0; rxIndex < rxList.length; rxIndex++) {
            const el = columnRefs.current[rxIndex * layout.columns + c]
            if (el) gsap.set(el, { y })
          }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefersReducedMotion, cols, blockWidth, layout.columns, layout.gap])

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
        <div ref={xWrapperRef} className="absolute inset-0">
          {rxList.map((rx, rxIndex) => (
            <div
              key={rx}
              style={{ position: 'absolute', left: rx * blockWidth, top: 0, width: blockWidth, height: '100%' }}
            >
              {cols.map((col, c) => (
                <div
                  key={c}
                  ref={(el) => {
                    columnRefs.current[rxIndex * layout.columns + c] = el
                  }}
                  style={{ position: 'absolute', left: c * (layout.columnWidth + layout.gap), top: 0, width: layout.columnWidth }}
                >
                  {dupList.flatMap((dup) =>
                    col.tiles.map((ct, ti) => (
                      <MoodboardTile
                        key={`${dup}-${ti}`}
                        tile={ct.tile}
                        y={dup * (col.height + layout.gap) + ct.y}
                        width={layout.columnWidth}
                        height={ct.height}
                        onSelect={setSelected}
                      />
                    )),
                  )}
                </div>
              ))}
            </div>
          ))}
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

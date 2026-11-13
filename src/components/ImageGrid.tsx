import { useEffect, useRef } from 'react'
import type { ProjectImage } from '../data/projectDetails'
import { useScrollParallax } from '../hooks/useScrollParallax'

export type ImageGridLayout = 'full-bleed' | 'full-page' | 'two-up' | 'trio' | 'cluster' | 'contained'

// Plays once its container scrolls into view, pauses once it scrolls
// back out -- starts muted (autoplay triggered by scroll, not a real
// user gesture, so browsers won't allow it unmuted), but keeps native
// controls so a visitor can unmute or scrub manually.
function AutoplayInViewVideo({ image, className }: { image: ProjectImage; className: string }) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.play().catch(() => {})
        } else {
          el.pause()
        }
      },
      { threshold: 0.5 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <video
      ref={ref}
      src={image.video}
      poster={image.poster}
      controls
      muted
      preload="metadata"
      aria-label={image.alt}
      className={className}
    />
  )
}

// Renders whichever of `video`/`src` the entry actually has, or the
// dashed placeholder box when it has neither -- for a chapter whose
// real asset hasn't been supplied yet. `alt` doubles as that box's own
// label text in that case.
//
// `videoMode: 'loop'` is a silent, autoplaying background loop (no
// controls) -- for ambient UI/environment footage. `'autoplay'` plays
// once scrolled into view (see AutoplayInViewVideo above). The
// default, 'controls', is a plain user-initiated player with a poster
// frame -- for an actual trailer, which shouldn't autodownload.
function Media({ image, className }: { image: ProjectImage; className: string }) {
  if (image.video) {
    if (image.videoMode === 'loop') {
      return (
        <video
          src={image.video}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-label={image.alt}
          className={className}
        />
      )
    }
    if (image.videoMode === 'autoplay') {
      return <AutoplayInViewVideo image={image} className={className} />
    }
    return (
      <video src={image.video} poster={image.poster} controls preload="none" aria-label={image.alt} className={className} />
    )
  }
  if (image.src) {
    return (
      <img
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        loading="lazy"
        decoding="async"
        className={className}
      />
    )
  }
  return (
    <div className="flex h-full w-full items-center justify-center border border-dashed border-cream/15">
      <span className="font-body px-6 text-center text-[10px] tracking-[0.22em] text-cream/30 uppercase">{image.alt}</span>
    </div>
  )
}

// The `full-page` treatment, with a subtle parallax drift -- the
// media sits in an oversized (130%), absolutely-positioned wrapper so
// a vertical `yPercent` swing always has slack to move within without
// ever revealing an empty edge. Animates the wrapper, not the <img>/
// <video> directly, so this stays agnostic to whichever media type
// `Media` actually renders (including the ones that manage their own
// ref internally, like AutoplayInViewVideo).
function FullPageMedia({ image, tall }: { image: ProjectImage; tall: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  useScrollParallax(containerRef, wrapperRef, 10)

  return (
    <figure>
      <div
        ref={containerRef}
        className={`relative ${tall ? 'h-[150vh]' : 'h-[92vh]'} w-full overflow-hidden bg-cream/5`}
      >
        <div ref={wrapperRef} className="absolute inset-x-0 top-[-15%] h-[130%] w-full">
          <Media image={image} className="h-full w-full object-cover" />
        </div>
      </div>
      {image.caption && (
        <figcaption className="font-body mx-auto mt-4 max-w-xl px-6 text-center text-xs tracking-[0.08em] text-cream/40 md:px-0">
          {image.caption}
        </figcaption>
      )}
    </figure>
  )
}

// `card` false drops the rounded bg-cream/5 backdrop entirely -- for
// a transparent-background cutout (a sticker render, a logo mark)
// where that backdrop would show as an unwanted grey box around the
// art instead of just the art sitting on the page.
//
// `tilt`, only meaningful with `interactive`, alternates the hover
// rotation's direction so a row of stickers doesn't all lean the same
// way -- a literal class per direction, not a computed one, since
// Tailwind needs the full utility name present in source text.
const TILT_CLASS = { left: 'hover:-rotate-3', right: 'hover:rotate-3' } as const

function Figure({
  image,
  rounded,
  card,
  interactive,
  tilt = 'right',
}: {
  image: ProjectImage
  rounded: boolean
  card: boolean
  // Subtle scale + tilt on hover -- opt-in, for a cluster of sticker
  // cutouts specifically, not every image on the site.
  interactive?: boolean
  tilt?: 'left' | 'right'
}) {
  const hasMedia = Boolean(image.src || image.video)
  return (
    <figure>
      <div
        className={`${card ? `overflow-hidden bg-cream/5 ${rounded ? 'rounded-2xl' : ''}` : 'overflow-hidden'} ${interactive ? `transition-transform duration-300 ease-out hover:scale-110 ${TILT_CLASS[tilt]}` : ''}`}
        style={{ aspectRatio: hasMedia ? `${image.width} / ${image.height}` : '4 / 3' }}
      >
        <Media image={image} className="h-full w-full object-cover" />
      </div>
      {image.caption && (
        <figcaption className="font-body mx-auto mt-4 max-w-xl px-6 text-center text-xs tracking-[0.08em] text-cream/40 md:px-0">
          {image.caption}
        </figcaption>
      )}
    </figure>
  )
}

// Literal, statically-greppable class strings -- Tailwind's scanner
// needs the full utility name to appear in source text, so this can't
// be built with a template literal like `w-${size}`.
const CLUSTER_SIZE_CLASS: Record<NonNullable<ProjectImage['size']>, string> = {
  sm: 'w-[46%] sm:w-56 md:w-60',
  md: 'w-[62%] sm:w-72 md:w-80',
  lg: 'w-[78%] sm:w-96 md:w-[26rem]',
  xl: 'w-[88%] sm:w-[28rem] md:w-[32rem]',
}

// A gentle alternating vertical nudge per position, purely for the
// "organic, staggered" feel requested for a wall of mixed-size cutouts
// -- a `translate`, not a margin, so it shifts the image without also
// pushing extra empty space into the row beneath it. Natural flex-wrap
// + items-end already staggers somewhat since each image's rendered
// height differs with its width; this just exaggerates it a little.
const CLUSTER_OFFSET_CLASS = ['md:translate-y-0', 'md:translate-y-8', 'md:-translate-y-4'] as const

// `full-bleed` is edge-to-edge, sized by the image's own aspect ratio
// -- real photography. `full-page` is also edge-to-edge but sized to
// the viewport instead (cropping via object-cover as needed), for a
// single image meant to fill the whole screen the way
// littletroop.com/work/rocco's own product shots do -- `tall` swaps
// its box from one viewport height to 1.5x, for a square/portrait
// source that a plain viewport-height crop cuts too aggressively.
// `contained`, `two-up`, and `trio` are rounded cards sitting on the
// page with a gutter -- the treatment every graphic/deliverable image
// on the littletroop.com reference actually uses (confirmed directly:
// even their "full width" poster grids are gapped rounded cards, not
// true edge-to-edge bleed -- only their lead photography bleeds).
// `cluster` is a free-wrapping, mixed-size arrangement (each image's
// own `size`) for a looser, more organic grouping than the fixed
// two-up/trio grids.
export function ImageGrid({
  layout,
  images,
  card = true,
  tall = false,
}: {
  layout: ImageGridLayout
  images: ProjectImage[]
  // Set false for a chapter whose images are transparent cutouts
  // (see `Figure`'s own note) rather than photography/mockups.
  card?: boolean
  // `full-page` only -- see the note above.
  tall?: boolean
}) {
  if (images.length === 0) return null

  if (layout === 'contained') {
    return (
      <div className="mx-auto mt-6 max-w-2xl px-6 md:px-10">
        <Figure image={images[0]} rounded card={card} />
      </div>
    )
  }

  if (layout === 'two-up') {
    return (
      <div className="mx-auto mt-6 grid max-w-6xl grid-cols-1 gap-8 px-6 sm:grid-cols-2 md:gap-10 md:px-10">
        {images.slice(0, 2).map((image, i) => (
          <Figure key={`${image.alt}-${i}`} image={image} rounded card={card} />
        ))}
      </div>
    )
  }

  if (layout === 'trio') {
    return (
      <div className="mx-auto mt-6 grid max-w-6xl grid-cols-1 gap-8 px-6 sm:grid-cols-3 md:gap-8 md:px-10">
        {images.slice(0, 3).map((image, i) => (
          <Figure key={`${image.alt}-${i}`} image={image} rounded card={card} />
        ))}
      </div>
    )
  }

  if (layout === 'cluster') {
    return (
      <div className="mx-auto mt-6 flex max-w-7xl flex-wrap items-end justify-center gap-x-8 gap-y-10 px-6 md:px-10">
        {images.map((image, i) => (
          <div
            key={`${image.alt}-${i}`}
            className={`${CLUSTER_SIZE_CLASS[image.size ?? 'md']} ${CLUSTER_OFFSET_CLASS[i % CLUSTER_OFFSET_CLASS.length]}`}
          >
            <Figure image={image} rounded card={card} interactive tilt={i % 2 === 0 ? 'right' : 'left'} />
          </div>
        ))}
      </div>
    )
  }

  if (layout === 'full-page') {
    // No top margin -- unlike the other layouts, full-page images are
    // meant to butt up flush against whatever's above/below them (see
    // ProjectChapter, which also skips its own gap between consecutive
    // full-page `moreImages` blocks).
    return (
      <div className="w-full">
        <FullPageMedia image={images[0]} tall={tall} />
      </div>
    )
  }

  return (
    <div className="mt-6 w-full">
      <Figure image={images[0]} rounded={false} card={card} />
    </div>
  )
}

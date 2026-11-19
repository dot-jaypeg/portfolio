import { useEffect, useRef, type RefObject } from 'react'
import type { ProjectImage } from '../data/projectDetails'
import { useScrollParallax } from '../hooks/useScrollParallax'

export type ImageGridLayout =
  | 'full-bleed'
  | 'full-page'
  | 'full-page-two-up'
  | 'full-page-trio'
  | 'two-up'
  | 'trio'
  | 'cluster'
  | 'contained'
  | 'grid-3'
  | 'phone-row'
  | 'macbook-row'

// Plays once its container scrolls into view, pauses once it scrolls
// back out -- starts muted (autoplay triggered by scroll, not a real
// user gesture, so browsers won't allow it unmuted), but keeps native
// controls so a visitor can unmute or scrub manually.
function AutoplayInViewVideo({
  image,
  className,
  observeRef,
}: {
  image: ProjectImage
  className: string
  // Defaults to observing the <video> itself. FullPageMedia/
  // FullPageMediaRow pass their own visible clipping container
  // instead -- the video there sits inside an oversized (130%)
  // parallax wrapper, so observing the video's OWN (also oversized)
  // box can never clear a 0.5 intersection ratio with much margin:
  // confirmed directly, even at perfect alignment it peaks around
  // 0.51, right at the threshold's edge, so ordinary scroll jitter
  // flickers play/pause instead of settling. Observing the real
  // container (sized to the viewport, not inflated for parallax
  // slack) gives a stable ratio instead.
  observeRef?: RefObject<HTMLElement | null>
}) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const el = ref.current
    const target = observeRef?.current ?? el
    if (!el || !target) return
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
    observer.observe(target)
    return () => observer.disconnect()
  }, [observeRef])

  return (
    <video
      ref={ref}
      src={image.video}
      poster={image.poster}
      controls
      muted
      preload="metadata"
      aria-label={image.alt}
      // Clicking the video itself unmutes (or re-mutes) it -- quicker
      // than hunting for the native controls' own mute icon. Mutating
      // `el.muted` directly rather than through React state: `muted`
      // is only ever applied once at mount (browsers don't let a video
      // un-mute itself without a real user gesture, so it has to start
      // true for the scroll-triggered autoplay above to be allowed at
      // all), and this click IS that real gesture.
      //
      // `preventDefault` first -- a plain `controls` video's own
      // native click handling toggles play/pause on top of whatever a
      // page's own click listener does, confirmed directly (mute
      // alone worked, but so did an unasked-for pause every time).
      // This only suppresses THAT default; clicks on the native
      // controls bar itself (scrub bar, volume, fullscreen) aren't
      // routed through this handler's default action at all.
      onClick={(e) => {
        e.preventDefault()
        const el = ref.current
        if (el) el.muted = !el.muted
      }}
      className={`cursor-pointer ${className}`}
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
function Media({
  image,
  className,
  observeRef,
}: {
  image: ProjectImage
  className: string
  // See AutoplayInViewVideo's own note -- only meaningful when
  // `videoMode === 'autoplay'`.
  observeRef?: RefObject<HTMLElement | null>
}) {
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
      return <AutoplayInViewVideo image={image} className={className} observeRef={observeRef} />
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
      <div ref={containerRef} className={`relative ${tall ? 'h-[150vh]' : 'h-[92vh]'} w-full overflow-hidden`}>
        <div ref={wrapperRef} className="absolute inset-x-0 top-[-15%] h-[130%] w-full">
          <Media
            image={image}
            className={`h-full w-full ${image.fit === 'contain' ? 'object-contain' : 'object-cover'}`}
            observeRef={containerRef}
          />
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

// Same flush, parallaxing treatment as `FullPageMedia`, split into 2
// equal-width side-by-side columns instead of one full-width image --
// each column gets its own oversized wrapper/parallax drift, scrubbed
// off the same shared container so they both move together. No
// backdrop fill behind either (unlike FullPageMedia/this used to
// have) -- was only ever visible as a stray light-grey bar once a
// `fit: 'contain'` image left empty space to show it through, and
// looked like an accident rather than an intentional card backdrop.
function FullPageMediaRow({ images, tall }: { images: ProjectImage[]; tall: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const wrapperRefA = useRef<HTMLDivElement>(null)
  const wrapperRefB = useRef<HTMLDivElement>(null)
  // Each column's own visible clipping box -- passed to `autoplay`
  // videos as what to actually measure intersection against, instead
  // of their own oversized (130%) wrapper (see AutoplayInViewVideo's
  // note on why that one alone is too unreliable a target).
  const boxRefA = useRef<HTMLDivElement>(null)
  const boxRefB = useRef<HTMLDivElement>(null)
  useScrollParallax(containerRef, wrapperRefA, 10)
  useScrollParallax(containerRef, wrapperRefB, 10)

  const slots = [
    { wrapperRef: wrapperRefA, boxRef: boxRefA },
    { wrapperRef: wrapperRefB, boxRef: boxRefB },
  ]

  return (
    <div ref={containerRef} className={`flex w-full ${tall ? 'h-[150vh]' : 'h-[92vh]'}`}>
      {images.map((image, i) => {
        const { wrapperRef, boxRef } = slots[i]
        return (
          <div key={i} ref={boxRef} className="relative h-full w-1/2 overflow-hidden">
            <div ref={wrapperRef} className="absolute inset-x-0 top-[-15%] h-[130%] w-full">
              <Media
                image={image}
                className={`h-full w-full ${image.fit === 'contain' ? 'object-contain' : 'object-cover'}`}
                observeRef={boxRef}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

// A flush row of 2-3 images sized by their OWN aspect ratio instead of
// a forced viewport-height box -- for flat marks/icons already cropped
// to matching ratios, where `FullPageMediaRow`'s parallaxing box would
// mostly show empty letterboxed space above/below the actual content
// rather than the mark itself (confirmed directly: three logo/icon
// images at ~1.5 ratio inside a 92-150vh column left most of the
// column empty). No parallax here either, since there's no tall photo
// to drift -- the whole point is the box already matches the content.
function FlushMediaRow({ images }: { images: ProjectImage[] }) {
  const widthClass = images.length >= 3 ? 'w-1/3' : 'w-1/2'
  return (
    <div className="flex w-full">
      {images.map((image, i) => (
        <div
          key={i}
          className={`relative ${widthClass} overflow-hidden`}
          style={{ aspectRatio: `${image.width ?? 3} / ${image.height ?? 2}` }}
        >
          <Media image={image} className="h-full w-full object-cover" />
        </div>
      ))}
    </div>
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
  card,
  interactive,
  tilt = 'right',
}: {
  image: ProjectImage
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
        className={`${card ? 'overflow-hidden bg-cream/5' : 'overflow-hidden'} ${interactive ? `transition-transform duration-300 ease-out hover:scale-110 ${TILT_CLASS[tilt]}` : ''}`}
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

// A literal phone-shaped frame around a screenshot or video -- always
// a fixed 9:16 screen, regardless of the source image's own ratio
// (object-cover crops to fill it), so every phone mockup on the page
// reads as the same device instead of a different shape per image.
// `rounded-[2.75rem]` + the thick bezel are a deliberate exception to
// the rest of the site's sharp corners, since this is describing an
// actual phone's shape, not a generic card. A real screenshot (A7X's)
// already carries its own status bar and app chrome, so the frame
// alone is enough; a flat graphic or plain video (Deftones', the
// vinyl clip) needs `image.phoneChrome` to draw a fake status bar and
// home indicator on top, or it just reads as a framed rectangle
// instead of a phone screen.
function PhoneMockup({ image }: { image: ProjectImage }) {
  return (
    <div className="mx-auto w-full max-w-[320px]">
      <div
        className="relative overflow-hidden rounded-[2.75rem] border-[10px] border-ink bg-ink shadow-2xl shadow-black/50 ring-1 ring-cream/10"
        style={{ aspectRatio: '9 / 16' }}
      >
        <Media image={image} className="h-full w-full object-cover" />
        {image.phoneChrome && (
          <>
            <div className="absolute inset-x-0 top-0 flex items-center justify-between px-6 pt-2 text-[11px] font-semibold text-cream mix-blend-difference">
              <span>9:41</span>
              <span className="flex h-[9px] w-[19px] items-center rounded-[3px] border border-cream p-[1.5px]">
                <span className="h-full w-[70%] rounded-[1px] bg-cream" />
              </span>
            </div>
            <div className="absolute inset-x-0 top-1 flex justify-center">
              <div className="h-5 w-24 rounded-full bg-ink" />
            </div>
            <div className="absolute inset-x-0 bottom-1.5 flex justify-center">
              <div className="h-1 w-28 rounded-full bg-cream/70" />
            </div>
          </>
        )}
      </div>
      {image.caption && (
        <p className="font-body mt-3 text-center text-xs tracking-[0.08em] text-cream/40">{image.caption}</p>
      )}
    </div>
  )
}

// A laptop-shaped frame -- a thick screen bezel (with a camera dot)
// sitting on a thin tapered base/hinge bar, for a screenshot that's
// itself a full browser window rather than a phone screen. Same
// sharp-corners exception as `PhoneMockup`, for the same reason: this
// is describing a real device's shape.
function MacbookMockup({ image }: { image: ProjectImage }) {
  const hasMedia = Boolean(image.src || image.video)
  return (
    <div className="mx-auto w-full max-w-[720px]">
      <div className="relative overflow-hidden rounded-t-2xl border-[10px] border-b-0 border-ink bg-ink pt-2 shadow-2xl shadow-black/50 ring-1 ring-cream/10">
        <div className="absolute inset-x-0 top-0 flex justify-center pt-0.5">
          <div className="h-1.5 w-1.5 rounded-full bg-cream/20" />
        </div>
        <div style={{ aspectRatio: hasMedia ? `${image.width} / ${image.height}` : '16 / 9' }}>
          <Media image={image} className="h-full w-full object-cover" />
        </div>
      </div>
      <div className="h-3 bg-gradient-to-b from-cream/20 to-cream/5" />
      <div className="mx-auto h-1.5 w-32 rounded-b-xl bg-cream/15" />
      {image.caption && (
        <p className="font-body mt-4 text-center text-xs tracking-[0.08em] text-cream/40">{image.caption}</p>
      )}
    </div>
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
// `contained`, `two-up`, and `trio` are sharp-edged cards sitting on
// the page with a gutter. `cluster` is a free-wrapping, mixed-size
// arrangement (each image's own `size`) for a looser, more organic
// grouping than the fixed two-up/trio grids.
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
        <Figure image={images[0]} card={card} />
      </div>
    )
  }

  if (layout === 'two-up') {
    return (
      <div className="mx-auto mt-6 grid max-w-6xl grid-cols-1 gap-8 px-6 sm:grid-cols-2 md:gap-10 md:px-10">
        {images.slice(0, 2).map((image, i) => (
          <Figure key={`${image.alt}-${i}`} image={image} card={card} />
        ))}
      </div>
    )
  }

  if (layout === 'trio') {
    return (
      <div className="mx-auto mt-6 grid max-w-6xl grid-cols-1 gap-8 px-6 sm:grid-cols-3 md:gap-8 md:px-10">
        {images.slice(0, 3).map((image, i) => (
          <Figure key={`${image.alt}-${i}`} image={image} card={card} />
        ))}
      </div>
    )
  }

  if (layout === 'grid-3') {
    // A plain, even three-column grid -- every image the same
    // treatment, no tilt/stagger -- for a tidier, more deliberate feel
    // than `cluster`'s organic wrap (closer to the clean card-grid
    // reference the Contra dropdown sections were redone to match).
    return (
      <div className="mx-auto mt-6 grid max-w-6xl grid-cols-1 gap-8 px-6 sm:grid-cols-3 md:gap-10 md:px-10">
        {images.map((image, i) => (
          <Figure key={`${image.alt}-${i}`} image={image} card={card} />
        ))}
      </div>
    )
  }

  if (layout === 'phone-row') {
    // Centered row of phone-framed screenshots/videos -- wraps on
    // narrow viewports instead of a fixed column count, since each
    // phone has its own fixed max-width rather than sharing a grid
    // track. `max-w-6xl` (not -5xl) so three phones at this size fit
    // one row on a normal desktop viewport instead of wrapping to
    // 2-then-1. `mt-10`/`mb-10` (not just `mt-6`) -- this block is its
    // own self-contained unit of spacing now, since the chapter
    // wrapper around `moreImages` skips its usual margin for
    // `phone-row`/`macbook-row` (see ProjectChapter) to avoid doubling
    // up with this.
    return (
      <div className="mx-auto mt-10 mb-10 flex max-w-6xl flex-wrap justify-center gap-10 px-6 md:px-10">
        {images.map((image, i) => (
          <PhoneMockup key={`${image.alt}-${i}`} image={image} />
        ))}
      </div>
    )
  }

  if (layout === 'macbook-row') {
    return (
      <div className="mx-auto mt-10 mb-10 flex max-w-6xl flex-wrap justify-center gap-10 px-6 md:px-10">
        {images.map((image, i) => (
          <MacbookMockup key={`${image.alt}-${i}`} image={image} />
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
            <Figure image={image} card={card} interactive tilt={i % 2 === 0 ? 'right' : 'left'} />
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

  if (layout === 'full-page-two-up') {
    return (
      <div className="w-full">
        <FullPageMediaRow images={images.slice(0, 2)} tall={tall} />
      </div>
    )
  }

  if (layout === 'full-page-trio') {
    return (
      <div className="w-full">
        <FlushMediaRow images={images.slice(0, 3)} />
      </div>
    )
  }

  return (
    <div className="mt-6 w-full">
      <Figure image={images[0]} card={card} />
    </div>
  )
}

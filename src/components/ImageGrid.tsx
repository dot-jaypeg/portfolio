import { useEffect, useRef, type CSSProperties, type RefObject } from 'react'
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
  | 'full-width'
  | 'row-match-height'

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
      // In-page sizing can be `object-cover`/`object-contain` cropped
      // or letterboxed to fit whatever box it's sitting in, but the
      // browser's own fullscreen view should always show the file's
      // real aspect ratio untouched -- `object-contain` there
      // letterboxes instead of cropping, for landscape and portrait
      // sources alike.
      className={`cursor-pointer ${className} [&:fullscreen]:object-contain [&:-webkit-full-screen]:object-contain`}
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
      <video
        src={image.video}
        poster={image.poster}
        controls
        preload="none"
        aria-label={image.alt}
        // See AutoplayInViewVideo's own note -- same fullscreen
        // override, same reason.
        className={`${className} [&:fullscreen]:object-contain [&:-webkit-full-screen]:object-contain`}
      />
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

// A literal phone-shaped frame -- always a fixed, real-iPhone screen
// ratio (~9:19.5), plus a Dynamic Island cutout, so this reads as an
// actual device regardless of what's inside. A7X's screenshots are
// already shot at this exact ratio, so object-cover is a no-op crop
// for them; a more square ~9:16 source normally gets cropped to fit
// too, unless `image.fit: 'contain'` says to letterbox it instead
// (Deftones' story graphics, whose own background is already near-
// black, so the letterbox bars disappear into the phone's bezel
// instead of reading as empty space). `rounded-[2.75rem]` is a
// deliberate exception to the rest of the site's sharp corners --
// it's describing an actual phone's shape, not a generic card.
function PhoneMockup({ image }: { image: ProjectImage }) {
  return (
    // Fixed width, not `w-full max-w-[...]` -- that combination's
    // `mx-auto` was a flex-item auto-margin self-centering trick that
    // fought with a sibling link column (see `linksInline`), grabbing
    // all the row's free space as its own margin instead of leaving
    // `justify-center` on the parent to center the whole group. The
    // parent row already centers a lone phone the same way.
    <div className="w-[260px] shrink-0">
      <div
        className="relative overflow-hidden rounded-[2.75rem] border-[4px] border-cream/20 bg-ink shadow-xl shadow-black/40"
        style={{ aspectRatio: '9 / 19.5' }}
      >
        <Media image={image} className={`h-full w-full ${image.fit === 'contain' ? 'object-contain' : 'object-cover'}`} />
        <div className="absolute inset-x-0 top-[10px] flex justify-center">
          <div className="h-[9px] w-[72px] rounded-full bg-ink" />
        </div>
        {image.storyOverlay && <InstagramStoryChrome username={image.storyOverlay} />}
      </div>
      {image.caption && (
        <p className="font-body mt-3 text-center text-xs tracking-[0.08em] text-cream/40">{image.caption}</p>
      )}
    </div>
  )
}

// Drawn-on Instagram Story UI -- a progress segment, account row, and
// reply bar -- for a flat graphic that was never actually
// screenshotted inside the app (A7X's real screenshots already carry
// all of this baked in, so they never need it). `mix-blend-difference`
// on the text/icons keeps them legible against whatever's directly
// behind them, light or dark, without needing a scrim.
function InstagramStoryChrome({ username }: { username: string }) {
  return (
    <div className="pointer-events-none absolute inset-0 text-cream mix-blend-difference">
      <div className="absolute inset-x-3 top-[22px] h-[2px] overflow-hidden rounded-full bg-cream/40">
        <div className="h-full w-full bg-cream" />
      </div>
      <div className="absolute inset-x-3 top-[30px] flex items-center gap-2">
        <div className="h-6 w-6 shrink-0 rounded-full border border-cream/70" />
        <span className="font-body text-[11px] font-semibold">{username}</span>
        <span className="font-body text-[11px] opacity-60">17h</span>
        <span className="ml-auto text-[13px] leading-none opacity-80">&times;</span>
      </div>
      <div className="absolute inset-x-3 bottom-3 flex items-center gap-2">
        <div className="font-body flex-1 truncate rounded-full border border-cream/50 px-3 py-1.5 text-[10px] opacity-70">
          Send message
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0">
          <path
            d="M12 21s-7-4.35-9.5-8.5C.5 9 2 5 6 5c2 0 3.5 1.2 4 2.5.5-1.3 2-2.5 4-2.5 4 0 5.5 4 3.5 7.5C19 16.65 12 21 12 21Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0">
          <path d="M21 3 2 11l7 3 3 7 9-18Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      </div>
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
  inlineLinks,
  accent,
}: {
  layout: ImageGridLayout
  images: ProjectImage[]
  // Set false for a chapter whose images are transparent cutouts
  // (see `Figure`'s own note) rather than photography/mockups.
  card?: boolean
  // `full-page` only -- see the note above.
  tall?: boolean
  // `phone-row` only -- see ProjectImageBlock's `linksInline` note.
  inlineLinks?: { label: string; href: string }[]
  accent?: string
}) {
  if (images.length === 0) return null

  if (layout === 'contained') {
    return (
      <div className="mx-auto mt-6 max-w-2xl px-6 md:px-10">
        <Figure image={images[0]} card={card} />
      </div>
    )
  }

  if (layout === 'full-width') {
    // Like `contained`, but no max-width cap -- fills the same width
    // the chapter's own text column does (just `px-6 md:px-10`), for
    // a wide single image (a diagram, a node graph) that reads as too
    // small boxed into `contained`'s narrower column but doesn't need
    // `full-bleed`'s true edge-to-edge treatment either.
    return (
      <div className="mt-6 w-full px-6 md:px-10">
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

  if (layout === 'row-match-height') {
    // For images whose own aspect ratios differ too much for `two-up`'s
    // equal-width columns to look balanced (e.g. one tall single-device
    // mockup next to one wide multi-device mockup) -- matching width
    // left the narrower one looking much bigger/smaller than the other
    // depending on which axis got padded. Matching height instead (each
    // image keeps its own real aspect ratio, auto width) means neither
    // needs artificial padding to "look the same size".
    return (
      <div className="mt-10 mb-10 flex flex-wrap items-end justify-center gap-10 px-6 md:px-10">
        {images.map((image, i) => (
          <Media key={`${image.alt}-${i}`} image={image} className="h-[68vh] max-h-[820px] w-auto" />
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
    // track. `mt-10`/`mb-10` (not just `mt-6`) -- this block is its
    // own self-contained unit of spacing now, since the chapter
    // wrapper around `moreImages` skips its usual margin for
    // `phone-row`/`macbook-row` (see ProjectChapter) to avoid doubling
    // up with this.
    //
    // With `inlineLinks` (a lone phone plus a button column, Incubus'
    // case), center-align reads as an arbitrary floating pair in the
    // middle of the page -- `justify-start`, and dropping the
    // `mx-auto`/`max-w-5xl` centering, lines its left edge up with
    // the chapter text above it and the nav/logo above that instead
    // (both just `px-6 md:px-10`, no max-width of their own).
    return (
      <div
        className={`mt-10 mb-10 flex flex-wrap items-center gap-10 px-6 md:px-10 ${inlineLinks ? 'justify-start' : 'mx-auto max-w-5xl justify-center'}`}
      >
        {images.map((image, i) => (
          <PhoneMockup key={`${image.alt}-${i}`} image={image} />
        ))}
        {inlineLinks && inlineLinks.length > 0 && (
          <div className="flex flex-col gap-4">
            {inlineLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                style={{ '--pill-accent': accent, '--pill-fg': accent, borderColor: `${accent}66` } as CSSProperties}
                className="font-geist rounded-full border px-6 py-3 text-center text-xs font-medium tracking-wider text-[var(--pill-fg)] uppercase transition-colors duration-300 hover:bg-[var(--pill-accent)] hover:text-ink"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
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

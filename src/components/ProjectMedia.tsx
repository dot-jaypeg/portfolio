import { useState } from 'react'
import type { ProjectImage } from '../data/projects'

// Shared by MoodboardCanvas and ProjectDetail -- one place that knows
// how to render any of the three media types, reserve its layout space via
// aspect-ratio (no CLS once it loads), and blur-up from a soft
// placeholder to the sharp asset. `src` is optional: every seed project
// is missing one right now, so this also doubles as the dashed
// placeholder box used elsewhere on the site (AllWork/WorkPanel) until
// real assets are dropped in.
export function ProjectMedia({
  media,
  priority = false,
  decorative = false,
}: {
  media: ProjectImage
  // Hero images are already in the viewport the instant the page
  // mounts -- lazy-loading those would just delay them for no reason,
  // so the detail page's hero passes this to load eagerly instead.
  priority?: boolean
  // MoodboardCanvas's tiles aren't a gallery of individually meaningful
  // photos -- they're decorative filler (see Gallery.tsx), so forcing
  // real alt text on them would make a screen reader announce dozens
  // of near-duplicate descriptions for content that conveys nothing.
  // The canvas itself is also aria-hidden; this covers the img tag too.
  decorative?: boolean
}) {
  const [loaded, setLoaded] = useState(false)
  const aspectRatio = `${media.width} / ${media.height}`

  if (!media.src) {
    return (
      <div
        style={{ aspectRatio }}
        className="flex items-center justify-center border border-dashed border-cream/15 bg-cream/5"
      >
        <span className="font-body px-4 text-center text-[10px] tracking-[0.22em] text-cream/25 uppercase">
          [ placeholder {media.type} ]
        </span>
      </div>
    )
  }

  // blur-none/opacity-100 only once the real asset has actually
  // decoded -- blur-md/opacity-0 before that is the "low-res
  // placeholder" the brief asks for, without needing a second,
  // separately-generated low-res source to swap in.
  const mediaClassName = `h-full w-full object-cover transition-all duration-700 group-hover:scale-105 ${
    loaded ? 'opacity-100 blur-none' : 'opacity-0 blur-md'
  }`

  return (
    <div style={{ aspectRatio }} className="relative overflow-hidden bg-cream/5">
      {media.type === 'video' ? (
        <video
          src={media.src}
          className={mediaClassName}
          autoPlay
          muted
          loop
          playsInline
          preload={priority ? 'auto' : 'metadata'}
          onLoadedData={() => setLoaded(true)}
        />
      ) : (
        <img
          src={media.src}
          alt={decorative ? '' : media.alt}
          className={mediaClassName}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setLoaded(true)}
        />
      )}
    </div>
  )
}

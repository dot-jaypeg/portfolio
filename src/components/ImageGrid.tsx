import type { ProjectImage } from '../data/projectDetails'

function Figure({ image, padded }: { image: ProjectImage; padded: boolean }) {
  return (
    <figure>
      <img
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        loading="lazy"
        decoding="async"
        style={{ aspectRatio: `${image.width} / ${image.height}` }}
        className="h-auto w-full object-cover"
      />
      {image.caption && (
        <figcaption className={`font-body mt-3 text-xs tracking-[0.08em] text-cream/40 ${padded ? '' : 'px-6 md:px-10'}`}>
          {image.caption}
        </figcaption>
      )}
    </figure>
  )
}

// Three layouts, matched to the brief's "mix full-bleed images, two-up
// image pairs, and contained single images for rhythm" -- `contained`
// sits inside the same max-w column as the chapter copy, `full-bleed`
// and `two-up` break out to the full viewport width.
export function ImageGrid({ layout, images }: { layout: 'full-bleed' | 'two-up' | 'contained'; images: ProjectImage[] }) {
  if (images.length === 0) return null

  if (layout === 'contained') {
    return (
      <div className="mx-auto mt-10 max-w-3xl px-6 md:px-10">
        <Figure image={images[0]} padded />
      </div>
    )
  }

  if (layout === 'two-up') {
    return (
      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-1">
        {images.slice(0, 2).map((image) => (
          <Figure key={image.src} image={image} padded={false} />
        ))}
      </div>
    )
  }

  return (
    <div className="mt-10 w-full">
      <Figure image={images[0]} padded={false} />
    </div>
  )
}

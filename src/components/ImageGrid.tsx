import type { ProjectImage } from '../data/projectDetails'

export type ImageGridLayout = 'full-bleed' | 'full-page' | 'two-up' | 'trio' | 'contained'

// Images with no `src` are a deliberate placeholder -- the project
// hasn't supplied that asset yet. Renders the same dashed-box
// convention ProjectCard already uses for a missing cover, with
// `alt` doing double duty as the box's own label text.
//
// `card` false drops the rounded bg-cream/5 backdrop entirely -- for
// a transparent-background cutout (a sticker render, a logo mark)
// where that backdrop would show as an unwanted grey box around the
// art instead of just the art sitting on the page.
function Figure({ image, rounded, card }: { image: ProjectImage; rounded: boolean; card: boolean }) {
  const hasImage = Boolean(image.src)
  return (
    <figure>
      <div
        className={card ? `overflow-hidden bg-cream/5 ${rounded ? 'rounded-2xl' : ''}` : 'overflow-hidden'}
        style={{ aspectRatio: hasImage ? `${image.width} / ${image.height}` : '4 / 3' }}
      >
        {hasImage ? (
          <img
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center border border-dashed border-cream/15">
            <span className="font-body px-6 text-center text-[10px] tracking-[0.22em] text-cream/30 uppercase">
              {image.alt}
            </span>
          </div>
        )}
      </div>
      {image.caption && (
        <figcaption className="font-body mx-auto mt-4 max-w-xl px-6 text-center text-xs tracking-[0.08em] text-cream/40 md:px-0">
          {image.caption}
        </figcaption>
      )}
    </figure>
  )
}

// `full-bleed` is edge-to-edge, sized by the image's own aspect ratio
// -- real photography. `full-page` is also edge-to-edge but sized to
// the viewport instead (cropping via object-cover as needed), for the
// rare single image meant to fill the whole screen the way
// littletroop.com/work/rocco's own product shots do. `contained`,
// `two-up`, and `trio` are rounded cards sitting on the page with a
// gutter -- the treatment every graphic/deliverable image on the
// littletroop.com reference actually uses (confirmed directly: even
// their "full width" poster grids are gapped rounded cards, not true
// edge-to-edge bleed -- only their lead photography bleeds).
export function ImageGrid({
  layout,
  images,
  card = true,
}: {
  layout: ImageGridLayout
  images: ProjectImage[]
  // Set false for a chapter whose images are transparent cutouts
  // (see `Figure`'s own note) rather than photography/mockups.
  card?: boolean
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

  if (layout === 'full-page') {
    const image = images[0]
    const hasImage = Boolean(image.src)
    return (
      <div className="mt-6 w-full">
        <figure>
          <div className="h-[92vh] w-full overflow-hidden bg-cream/5">
            {hasImage ? (
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center border border-dashed border-cream/15">
                <span className="font-body px-6 text-center text-[10px] tracking-[0.22em] text-cream/30 uppercase">
                  {image.alt}
                </span>
              </div>
            )}
          </div>
          {image.caption && (
            <figcaption className="font-body mx-auto mt-4 max-w-xl px-6 text-center text-xs tracking-[0.08em] text-cream/40 md:px-0">
              {image.caption}
            </figcaption>
          )}
        </figure>
      </div>
    )
  }

  return (
    <div className="mt-6 w-full">
      <Figure image={images[0]} rounded={false} card={card} />
    </div>
  )
}

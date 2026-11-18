import { Link } from 'react-router-dom'
import type { CaseStudy } from '../data/caseStudies'
import { useMaskNavigate } from '../hooks/useMaskNavigate'

// Shared by ProjectCard (the /work wall) and MoreProjects (every
// detail page's "View All" row) -- one place that knows how to pick
// between a /work-only video, a /work-only image override, or the
// plain `image` every other page on the site already uses, all sized
// at the cover's own native aspect ratio rather than cropped into a
// fixed box. `className` is the caller's own box/hover treatment.
export function ProjectCoverMedia({
  cs,
  className,
  objectPosition,
}: {
  cs: CaseStudy
  className: string
  // Only meaningful when the caller crops into a fixed box (MoreProjects)
  // rather than sizing the box to the cover's own native ratio (the
  // /work wall, which never needs this). Falls back to CSS's own
  // 'center' default when unset.
  objectPosition?: string
}) {
  const aspectRatio = cs.coverWidth && cs.coverHeight ? `${cs.coverWidth} / ${cs.coverHeight}` : '4 / 5'
  // /work-only override -- see the fields' own notes in caseStudies.ts.
  // A video wins when set; otherwise the work-specific image, falling
  // back to whatever `image` every other page on the site already uses.
  const coverImage = cs.workCoverImage ?? cs.image

  if (cs.workCoverVideo) {
    return (
      <video
        src={cs.workCoverVideo}
        poster={cs.workCoverPoster}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={`${cs.title} cover`}
        width={cs.coverWidth}
        height={cs.coverHeight}
        style={{ aspectRatio, objectPosition }}
        className={className}
      />
    )
  }
  if (coverImage) {
    return (
      <img
        src={coverImage}
        alt={`${cs.title} cover`}
        loading="lazy"
        decoding="async"
        width={cs.coverWidth}
        height={cs.coverHeight}
        style={{ aspectRatio, objectPosition }}
        className={className}
      />
    )
  }
  return (
    <div style={{ aspectRatio }} className="flex w-full items-center justify-center border border-dashed border-cream/15">
      <span className="font-body px-4 text-center text-[10px] tracking-[0.22em] text-cream/25 uppercase">
        [ placeholder image ]
      </span>
    </div>
  )
}

// A full-bleed masonry tile -- thomashedger.co.uk's own work page is
// just a wall of real photography at each cover's native aspect ratio,
// tightly gapped, no text sitting on the grid itself (title/category
// only show up once you're actually on the project page, same as this
// site already does). `alt` still carries the real description for
// assistive tech even though nothing's shown visually here.
export function ProjectCard({ cs }: { cs: CaseStudy }) {
  const maskNavigate = useMaskNavigate()
  const goToProject = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    maskNavigate(`/work/${cs.slug}`)
  }

  return (
    <Link
      to={`/work/${cs.slug}`}
      onClick={goToProject}
      data-cursor={cs.title}
      className="group relative mb-[6px] block w-full overflow-hidden bg-ink break-inside-avoid focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-teal"
    >
      <ProjectCoverMedia cs={cs} className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
    </Link>
  )
}

import { Link } from 'react-router-dom'
import type { CaseStudy } from '../data/caseStudies'
import { useMaskNavigate } from '../hooks/useMaskNavigate'

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
  const aspectRatio = cs.coverWidth && cs.coverHeight ? `${cs.coverWidth} / ${cs.coverHeight}` : '4 / 5'

  return (
    <Link
      to={`/work/${cs.slug}`}
      onClick={goToProject}
      data-cursor="View"
      className="group relative mb-[6px] block w-full overflow-hidden bg-ink break-inside-avoid focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-teal"
    >
      {cs.image ? (
        <img
          src={cs.image}
          alt={`${cs.title} cover`}
          loading="lazy"
          decoding="async"
          width={cs.coverWidth}
          height={cs.coverHeight}
          style={{ aspectRatio }}
          className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      ) : (
        <div style={{ aspectRatio }} className="flex w-full items-center justify-center border border-dashed border-cream/15">
          <span className="font-body px-4 text-center text-[10px] tracking-[0.22em] text-cream/25 uppercase">
            [ placeholder image ]
          </span>
        </div>
      )}
    </Link>
  )
}

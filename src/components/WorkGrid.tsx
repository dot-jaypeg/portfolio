import { CASE_STUDIES } from '../data/caseStudies'
import { ProjectCard } from './ProjectCard'

// Matches thomashedger.co.uk's own work page directly: a tight,
// full-bleed masonry wall of real cover photography, not the previous
// sticky-card-stack layout. CSS multi-column (plenty for the ten
// projects here -- no JS packing needed) rather than a JS-computed
// masonry: each column fills top-to-bottom before the next one
// starts, so visual order isn't strictly left-to-right row by row,
// but every tile is its own independent link, not sequential reading
// content, so that trade-off costs nothing here.
export function WorkGrid() {
  return (
    <div className="columns-1 gap-[6px] sm:columns-2 lg:columns-3">
      {CASE_STUDIES.map((cs) => (
        <ProjectCard key={cs.slug} cs={cs} />
      ))}
    </div>
  )
}

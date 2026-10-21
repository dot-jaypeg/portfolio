import { CASE_STUDIES } from '../data/caseStudies'
import { ProjectCard } from './ProjectCard'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

// Sticky card stack -- matches advancedmarketers.co/specialties'
// actual mechanic directly (confirmed from its own shipped JS *and*
// CSS, whose own comment literally says "the rows never fade"): every
// card is `position: sticky; top: 0` with an ascending z-index, under
// one shared parent, which is the entire reason later cards cover
// earlier ones -- no JavaScript at all, no fade, no crossfade, no
// entrance animation. Per direct request, the earlier wash/crossfade/
// tilt-blur polish layer built on top of this has been removed
// entirely -- cards just overlap.
export function ProjectStack() {
  const prefersReducedMotion = usePrefersReducedMotion()

  return (
    <div className="relative">
      {CASE_STUDIES.map((cs, i) => (
        <ProjectCard
          key={cs.slug}
          cs={cs}
          index={i}
          aspect={i % 2 === 0 ? '4/3' : '3/2'}
          stacked={!prefersReducedMotion}
        />
      ))}
    </div>
  )
}

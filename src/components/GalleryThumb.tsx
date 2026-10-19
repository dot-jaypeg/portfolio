import { Link } from 'react-router-dom'
import type { Project } from '../data/projects'
import { ProjectMedia } from './ProjectMedia'
import { useMaskNavigate } from '../hooks/useMaskNavigate'

export function GalleryThumb({
  project,
  hidden,
  animated,
}: {
  project: Project
  // display:none, not removed from the DOM -- Gallery's category filter
  // relies on these nodes staying mounted so GSAP Flip can detect them
  // entering/leaving when the filter changes (see Gallery.tsx).
  hidden: boolean
  // False under prefers-reduced-motion -- when true the thumb starts
  // hidden (opacity-0, translated down) for ScrollTrigger.batch to
  // reveal; skipping that class leaves it visible by default so it's
  // never depending on JS firing at all when motion is reduced.
  animated: boolean
}) {
  const maskNavigate = useMaskNavigate()
  // A real Flip shared-element morph from this thumbnail into the
  // detail page's hero would need its "from" rect to survive a full
  // route unmount/remount, and even then the curtain-wipe transition
  // below already covers the entire screen during that swap -- any
  // in-progress shared-element motion would be completely hidden
  // underneath the wipe, so there's nothing to show for the extra
  // complexity. Falling back to the same curtain-wipe every other
  // internal link on this site already uses instead.
  const goToProject = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    maskNavigate(`/gallery/${project.slug}`)
  }

  return (
    <li
      className={`gallery-thumb${hidden ? ' hidden' : ''}${animated ? ' translate-y-6 opacity-0' : ''}`}
    >
      <Link
        to={`/gallery/${project.slug}`}
        onClick={goToProject}
        data-cursor="View"
        className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal"
      >
        <ProjectMedia media={project.cover} />
        <div className="mt-3 flex items-baseline justify-between gap-2">
          <p className="font-body truncate text-xs tracking-[0.14em] text-cream uppercase">
            {project.title}
          </p>
          <p className="font-body shrink-0 text-[10px] tracking-[0.14em] text-cream/50 uppercase">
            {project.client}
          </p>
        </div>
      </Link>
    </li>
  )
}

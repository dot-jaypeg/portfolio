import { Link, useParams } from 'react-router-dom'
import { CASE_STUDIES } from '../data/caseStudies'
import { Cursor } from '../components/Cursor'
import { Grain } from '../components/Grain'
import { Nav } from '../components/Nav'
import { useMaskNavigate } from '../hooks/useMaskNavigate'
import { useSmoothScroll } from '../hooks/useSmoothScroll'
import { useScrollToTop } from '../hooks/useScrollToTop'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

// Placeholder pending approved copy -- see ProjectEntry.tsx for why
// this isn't cs.description (that field is also the homepage's real
// WorkPanel pull-quote text for the 5 featured case studies).
const PLACEHOLDER_BLURB =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua, ut enim ad minim veniam.'

// Detail page for /work/:slug -- moved here from the old /gallery/:slug
// (now retired) and rewired from the placeholder PROJECTS data onto
// the real CASE_STUDIES, per direct confirmation. No "Year" field and
// no stacked extra images below the cover: caseStudies.ts has neither:
// only a single cover image per project, no per-project year. Not
// invented here -- say the word if you want a richer detail page and
// real additional photos pulled in from the source project folders.
export function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>()
  const index = CASE_STUDIES.findIndex((p) => p.slug === slug)
  const project = index === -1 ? undefined : CASE_STUDIES[index]
  const maskNavigate = useMaskNavigate()

  useSmoothScroll()
  // Keyed on slug, not run once -- Prev/Next below change the :slug
  // param without unmounting this component (same route match), so an
  // empty-array reset would only ever fire for the first project a
  // visitor opens directly.
  useScrollToTop(slug)
  useDocumentMeta(
    project ? `${project.title} — .jaypeg` : 'Project not found — .jaypeg',
    project?.description ?? 'This project could not be found.',
  )

  if (!project) {
    return (
      <div className="min-h-screen bg-ink">
        <Cursor />
        <Grain />
        <Nav />
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
          <p className="font-display text-3xl font-bold tracking-[-0.04em] text-cream uppercase">
            Project not found
          </p>
          <Link
            to="/work"
            className="font-body text-xs tracking-[0.22em] text-cream/60 uppercase transition-colors hover:text-cream"
          >
            [Back to Work]
          </Link>
        </div>
      </div>
    )
  }

  const prev = CASE_STUDIES[(index - 1 + CASE_STUDIES.length) % CASE_STUDIES.length]
  const next = CASE_STUDIES[(index + 1) % CASE_STUDIES.length]
  const accent = project.accent ?? '#618c82'

  const goToProject = (targetSlug: string) => (e: { preventDefault: () => void }) => {
    e.preventDefault()
    maskNavigate(`/work/${targetSlug}`)
  }

  return (
    <div className="min-h-screen bg-ink">
      <Cursor />
      <Grain />
      <Nav />

      <main className="px-6 pt-32 pb-16 md:px-10 md:pt-40 md:pb-24">
        <p
          style={{ color: accent }}
          className="font-body mb-3 flex items-center gap-2 text-xs tracking-[0.22em] uppercase"
        >
          <span style={{ backgroundColor: accent }} className="h-px w-6" />
          {project.category}
        </p>
        <h1 className="font-display mb-6 max-w-4xl text-[11vw] leading-[0.9] font-bold tracking-[-0.04em] text-cream uppercase md:text-[6vw]">
          {project.title}
        </h1>
        <p className="font-body mb-10 max-w-xl text-sm leading-relaxed text-cream/70 md:mb-14">
          {PLACEHOLDER_BLURB}
        </p>

        <dl className="mb-10 flex flex-wrap gap-x-10 gap-y-3 md:mb-14">
          <div>
            <dt className="font-body text-[10px] tracking-[0.22em] text-cream/40 uppercase">Client</dt>
            <dd className="font-body text-xs tracking-[0.14em] text-cream uppercase">{project.client}</dd>
          </div>
          <div>
            <dt className="font-body text-[10px] tracking-[0.22em] text-cream/40 uppercase">Category</dt>
            <dd className="font-body text-xs tracking-[0.14em] text-cream uppercase">{project.category}</dd>
          </div>
        </dl>

        {project.image && (
          <div style={{ aspectRatio: '16 / 9' }} className="relative overflow-hidden bg-cream/5">
            <img
              src={project.image}
              alt={`${project.title} cover`}
              style={{ objectPosition: project.imagePosition ?? 'center' }}
              className="h-full w-full object-cover"
            />
          </div>
        )}
      </main>

      <nav
        aria-label="Project navigation"
        className="flex items-center justify-between border-t border-cream/10 px-6 py-8 md:px-10 md:py-10"
      >
        <Link
          to={`/work/${prev.slug}`}
          onClick={goToProject(prev.slug)}
          data-cursor="Prev"
          className="font-body max-w-[45%] truncate text-xs tracking-[0.14em] text-cream/60 uppercase transition-colors hover:text-cream"
        >
          ← {prev.title}
        </Link>
        <Link
          to={`/work/${next.slug}`}
          onClick={goToProject(next.slug)}
          data-cursor="Next"
          className="font-body max-w-[45%] truncate text-right text-xs tracking-[0.14em] text-cream/60 uppercase transition-colors hover:text-cream"
        >
          {next.title} →
        </Link>
      </nav>
    </div>
  )
}

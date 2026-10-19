import { Link, useParams } from 'react-router-dom'
import { PROJECTS } from '../data/projects'
import { Cursor } from '../components/Cursor'
import { Grain } from '../components/Grain'
import { ProjectMedia } from '../components/ProjectMedia'
import { useMaskNavigate } from '../hooks/useMaskNavigate'
import { useSmoothScroll } from '../hooks/useSmoothScroll'
import { useScrollToTop } from '../hooks/useScrollToTop'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>()
  const index = PROJECTS.findIndex((p) => p.slug === slug)
  const project = index === -1 ? undefined : PROJECTS[index]
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

  const goToGallery = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    maskNavigate('/gallery')
  }
  const goHome = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    maskNavigate('/')
  }

  if (!project) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-ink px-6 text-center">
        <Cursor />
        <Grain />
        <p className="font-display text-3xl font-bold tracking-[-0.04em] text-cream uppercase">
          Project not found
        </p>
        <Link
          to="/gallery"
          onClick={goToGallery}
          className="font-body text-xs tracking-[0.22em] text-cream/60 uppercase transition-colors hover:text-cream"
        >
          [Back to Gallery]
        </Link>
      </div>
    )
  }

  const prev = PROJECTS[(index - 1 + PROJECTS.length) % PROJECTS.length]
  const next = PROJECTS[(index + 1) % PROJECTS.length]

  const goToProject = (targetSlug: string) => (e: { preventDefault: () => void }) => {
    e.preventDefault()
    maskNavigate(`/gallery/${targetSlug}`)
  }

  return (
    <div className="min-h-screen bg-ink">
      <Cursor />
      <Grain />

      <header className="fixed inset-x-0 top-0 z-20 flex items-center justify-between px-6 py-6 md:px-10">
        <Link
          to="/"
          onClick={goHome}
          data-cursor="Home"
          className="font-display text-2xl font-bold tracking-[-0.06em] text-cream italic md:text-3xl"
        >
          .jaypeg
        </Link>
        <Link
          to="/gallery"
          onClick={goToGallery}
          className="font-body text-xs tracking-[0.22em] text-cream/60 uppercase transition-colors hover:text-cream"
        >
          [Back to Gallery]
        </Link>
      </header>

      <main className="px-6 pt-28 pb-16 md:px-10 md:pt-36 md:pb-24">
        <p className="font-body mb-3 flex items-center gap-2 text-xs tracking-[0.22em] text-teal uppercase">
          <span className="h-px w-6 bg-teal" />
          {project.category}
        </p>
        <h1 className="font-display mb-6 max-w-4xl text-[11vw] leading-[0.9] font-bold tracking-[-0.04em] text-cream uppercase md:text-[6vw]">
          {project.title}
        </h1>
        <p className="font-body mb-10 max-w-xl text-sm leading-relaxed text-cream/70 md:mb-14">
          {project.description}
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
          <div>
            <dt className="font-body text-[10px] tracking-[0.22em] text-cream/40 uppercase">Year</dt>
            <dd className="font-body text-xs tracking-[0.14em] text-cream uppercase">{project.year}</dd>
          </div>
        </dl>

        <div className="mb-4">
          <ProjectMedia media={project.cover} priority />
        </div>

        <div className="flex flex-col gap-4">
          {project.images.map((image, i) => (
            // key on index+alt -- alt alone repeats "image 1/2/3" text
            // shape across different projects, but combined with this
            // specific project's slug (closed over via `project`) it's
            // unique within this one list, which is all a key needs.
            <ProjectMedia key={`${project.slug}-${i}`} media={image} />
          ))}
        </div>
      </main>

      <nav
        aria-label="Project navigation"
        className="flex items-center justify-between border-t border-cream/10 px-6 py-8 md:px-10 md:py-10"
      >
        <Link
          to={`/gallery/${prev.slug}`}
          onClick={goToProject(prev.slug)}
          data-cursor="Prev"
          className="font-body max-w-[45%] truncate text-xs tracking-[0.14em] text-cream/60 uppercase transition-colors hover:text-cream"
        >
          ← {prev.title}
        </Link>
        <Link
          to={`/gallery/${next.slug}`}
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

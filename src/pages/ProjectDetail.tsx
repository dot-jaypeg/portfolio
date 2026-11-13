import { Link, useParams } from 'react-router-dom'
import { CASE_STUDIES } from '../data/caseStudies'
import { PROJECT_DETAILS } from '../data/projectDetails'
import { Cursor } from '../components/Cursor'
import { Grain } from '../components/Grain'
import { Nav } from '../components/Nav'
import { Contact } from '../components/Contact'
import { ProjectHero } from '../components/ProjectHero'
import { ProjectChapter } from '../components/ProjectChapter'
import { MoreProjects } from '../components/MoreProjects'
import { useSmoothScroll } from '../hooks/useSmoothScroll'
import { useScrollToTop } from '../hooks/useScrollToTop'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

// One template, driven entirely by data: every project supplies its own
// hero copy, tags, links, and chapters (src/data/projectDetails.ts) --
// this component has no per-project branches at all.
export function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>()
  const project = CASE_STUDIES.find((p) => p.slug === slug)
  const detail = project ? PROJECT_DETAILS[project.slug] : undefined

  useSmoothScroll()
  useScrollToTop(slug)
  useDocumentMeta(
    project ? `${project.title} — .jaypeg` : 'Project not found — .jaypeg',
    detail?.intro ?? project?.description ?? 'This project could not be found.',
  )

  if (!project || !detail) {
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

  const accent = project.accent ?? '#618c82'

  return (
    <div className="min-h-screen bg-ink">
      <Cursor />
      <Grain />
      <Nav />

      <main>
        <ProjectHero project={project} detail={detail} />

        {/* Left column reads as a quiet spec sheet (role, client) --
            the narrative paragraph sits in its own wider column to the
            right, instead of running the full width of the page. */}
        <div className="grid grid-cols-1 gap-x-16 gap-y-10 px-6 pt-4 pb-4 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:px-10 md:pt-6">
          <div className="font-geist space-y-7 text-sm md:pt-1 md:text-base">
            <div className="grid grid-cols-[6rem_1fr] gap-x-6">
              <p className="italic text-cream/35">Role</p>
              <div className="space-y-1 text-cream/70">
                {detail.tags.map((tag) => (
                  <p key={tag}>{tag}</p>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-[6rem_1fr] gap-x-6">
              <p className="italic text-cream/35">Client</p>
              <p className="text-cream/70">{project.client}</p>
            </div>
          </div>

          <p className="font-geist text-lg leading-relaxed font-light tracking-tight text-cream md:text-xl lg:text-2xl">
            {detail.intro}
          </p>
        </div>

        {detail.brandMark && (
          <div className="flex justify-center px-6 py-4 md:py-6">
            <img
              src={detail.brandMark.src}
              alt={detail.brandMark.alt}
              className="h-48 w-auto opacity-80 invert md:h-96"
              loading="lazy"
              decoding="async"
            />
          </div>
        )}

        {detail.chapters.map((chapter, i) => (
          <ProjectChapter key={i} chapter={chapter} accent={accent} />
        ))}

        <MoreProjects currentSlug={project.slug} />
      </main>

      <Contact />
    </div>
  )
}

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

        <div className="px-6 pt-4 pb-4 md:px-10 md:pt-6">
          <p className="font-geist max-w-[90rem] text-lg leading-relaxed font-light tracking-tight text-cream/70 md:text-xl lg:text-2xl">
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

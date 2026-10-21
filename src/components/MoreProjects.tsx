import { Link } from 'react-router-dom'
import { CASE_STUDIES } from '../data/caseStudies'
import { useMaskNavigate } from '../hooks/useMaskNavigate'

export function MoreProjects({ currentSlug }: { currentSlug: string }) {
  const maskNavigate = useMaskNavigate()
  const others = CASE_STUDIES.filter((p) => p.slug !== currentSlug).slice(0, 3)

  const goTo = (slug: string) => (e: { preventDefault: () => void }) => {
    e.preventDefault()
    maskNavigate(`/work/${slug}`)
  }

  return (
    <section className="border-t border-cream/10 px-6 py-16 md:px-10 md:py-24">
      <div className="mb-10 flex items-center justify-between">
        <h2 className="font-display text-xl font-bold tracking-[-0.02em] text-cream uppercase md:text-2xl">
          More Work
        </h2>
        <Link
          to="/work"
          className="font-body text-xs tracking-[0.2em] text-cream/60 uppercase transition-colors hover:text-cream"
        >
          View All {'→'}
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-8">
        {others.map((p) => (
          <Link
            key={p.slug}
            to={`/work/${p.slug}`}
            onClick={goTo(p.slug)}
            className="group block focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-teal"
          >
            <div className="overflow-hidden bg-cream/5" style={{ aspectRatio: '4 / 3' }}>
              {p.image && (
                <img
                  src={p.image}
                  alt={`${p.title} cover`}
                  loading="lazy"
                  decoding="async"
                  style={{ objectPosition: p.imagePosition ?? 'center' }}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}
            </div>
            <p className="mt-4 font-body text-xs tracking-[0.18em] text-cream/40 uppercase">{p.category}</p>
            <h3 className="font-display mt-1 text-lg font-bold tracking-[-0.02em] text-cream uppercase">
              {p.title}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  )
}

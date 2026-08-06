import { useState } from 'react'
import { categories, projects, type Category } from '../data/projects'

export function Projects() {
  const [active, setActive] = useState<Category>('All Work')

  const visible =
    active === 'All Work'
      ? projects
      : projects.filter((project) => project.category === active)

  return (
    <section id="work" className="mx-auto max-w-6xl px-6 pb-24 md:px-10">
      <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <h2 className="font-heading text-sm font-bold lowercase tracking-widest text-ink-soft">
          selected work
        </h2>
        <ul className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <li key={category}>
              <button
                type="button"
                onClick={() => setActive(category)}
                className={`rounded-full px-4 py-1.5 font-heading text-sm font-bold lowercase tracking-wide transition-colors ${
                  active === category
                    ? 'bg-ink text-cream'
                    : 'border border-line text-ink-soft hover:border-ink hover:text-ink'
                }`}
              >
                {category}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((project) => (
          <article key={project.slug} className="group">
            <div className="aspect-[4/3] overflow-hidden rounded-xl border border-line bg-cream-soft">
              <img
                src={project.cover}
                alt={project.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
            </div>
            <div className="mt-4 flex items-start justify-between gap-4">
              <h3 className="font-heading text-lg font-normal text-ink">
                {project.title}
              </h3>
              <span className="font-alt shrink-0 text-sm text-ink-soft">
                {project.year}
              </span>
            </div>
            <p className="mt-1 text-sm text-ink-soft">{project.client}</p>
            <p className="font-heading mt-2 text-xs font-bold lowercase tracking-wide text-accent">
              {project.services}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}

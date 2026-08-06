import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { categories, projects, type Category } from '../data/projects'

export function Projects() {
  const [active, setActive] = useState<Category>('All Work')
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null)

  const visible =
    active === 'All Work'
      ? projects
      : projects.filter((project) => project.category === active)

  const hovered = projects.find((project) => project.slug === hoveredSlug)

  return (
    <section id="work" className="mx-auto max-w-6xl px-6 pb-24 md:px-10">
      <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <h2 className="font-heading text-[21px] font-normal tracking-tight text-tertiary">
          Selected Work
        </h2>
        <ul className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <li key={category}>
              <button
                type="button"
                onClick={() => setActive(category)}
                className={`rounded-full px-4 py-1.5 font-heading text-sm font-bold lowercase transition-colors ${
                  active === category
                    ? 'bg-secondary text-primary'
                    : 'border border-tertiary/40 text-tertiary hover:border-secondary hover:text-secondary'
                }`}
              >
                {category}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <ul className="border-t border-tertiary/20">
        {visible.map((project, i) => (
          <li key={project.slug} className="border-b border-tertiary/20">
            <button
              type="button"
              onMouseEnter={() => setHoveredSlug(project.slug)}
              onMouseLeave={() => setHoveredSlug(null)}
              className="flex w-full items-baseline justify-between gap-6 py-6 text-left"
            >
              <span className="font-alt text-sm text-tertiary">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="font-heading flex-1 text-2xl font-normal text-secondary transition-colors md:text-4xl">
                {project.title}
              </span>
              <span className="hidden shrink-0 text-sm text-tertiary md:inline">
                {project.client}
              </span>
              <span className="font-alt shrink-0 text-sm text-tertiary">
                {project.year}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <AnimatePresence>
        {hovered && (
          <motion.div
            key={hovered.slug}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="pointer-events-none fixed inset-0 z-40"
          >
            <img
              src={hovered.cover}
              alt=""
              className="h-full w-full object-cover opacity-30"
            />
            <div className="absolute bottom-16 left-6 right-6 md:bottom-20 md:left-10 md:right-10">
              <p className="font-heading inline-block rounded-lg bg-primary/70 px-4 py-3 text-4xl font-normal text-secondary backdrop-blur-sm md:text-6xl">
                {hovered.title}
              </p>
              <p className="font-heading mt-2 inline-block rounded-lg bg-primary/70 px-4 py-2 text-sm font-bold lowercase text-tertiary backdrop-blur-sm">
                {hovered.services}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { categories, projects, type Category } from '../data/projects'
import { FadeIn } from './FadeIn'

export function Projects() {
  const [active, setActive] = useState<Category>('All Work')
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null)

  const visible =
    active === 'All Work'
      ? projects
      : projects.filter((project) => project.category === active)

  const hovered = projects.find((project) => project.slug === hoveredSlug)

  return (
    <section
      id="work"
      className="mx-auto max-w-6xl px-6 pt-16 pb-24 md:px-10 md:pt-24"
    >
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

      <ul className="flex flex-col">
        {visible.map((project, i) => {
          const isHovered = hoveredSlug === project.slug
          return (
            <li key={project.slug}>
              <FadeIn>
                <button
                  type="button"
                  onMouseEnter={() => setHoveredSlug(project.slug)}
                  onMouseLeave={() => setHoveredSlug(null)}
                  className="flex w-full flex-wrap items-baseline gap-x-3 gap-y-1 py-3 text-left"
                >
                  <span className="font-alt text-base text-tertiary">
                    {String(i + 1).padStart(2, '0')}.
                  </span>
                  <span
                    className={`font-heading text-xl font-normal transition-colors duration-300 md:text-2xl ${
                      isHovered ? 'text-secondary' : 'text-secondary/90'
                    }`}
                  >
                    {project.title}
                  </span>
                  <motion.span
                    initial={false}
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="font-alt text-sm text-tertiary"
                  >
                    {project.client} — {project.year} — {project.services}
                  </motion.span>
                </button>
              </FadeIn>
            </li>
          )
        })}
      </ul>

      <AnimatePresence>
        {hovered && (
          <motion.img
            key={hovered.slug}
            src={hovered.cover}
            alt=""
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.12 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="pointer-events-none fixed inset-0 z-0 h-full w-full object-cover"
          />
        )}
      </AnimatePresence>
    </section>
  )
}

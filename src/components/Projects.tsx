import { useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { categories, projects, type Category, type Project } from '../data/projects'

function ProjectCard({
  project,
  tall,
  isHovered,
  isDimmed,
  onHover,
  onHoverEnd,
}: {
  project: Project
  tall: boolean
  isHovered: boolean
  isDimmed: boolean
  onHover: () => void
  onHoverEnd: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])

  return (
    <article
      onMouseEnter={onHover}
      onMouseLeave={onHoverEnd}
      className={`flex h-full flex-col ${tall ? 'row-span-2' : ''}`}
    >
      <div
        ref={ref}
        className="relative flex-1 overflow-hidden rounded-xl border border-tertiary/20 bg-tertiary/10"
      >
        <motion.img
          src={project.cover}
          alt={project.title}
          loading="lazy"
          style={{ y }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="absolute inset-0 h-[130%] w-full object-cover"
        />
        <motion.div
          className="absolute inset-0 bg-secondary"
          initial={false}
          animate={{ opacity: isDimmed ? 0.8 : 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          style={{ pointerEvents: 'none' }}
        />
      </div>
      <motion.div
        initial={false}
        animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 6 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <div className="mt-3 flex items-start justify-between gap-4">
          <h3 className="font-heading text-lg font-normal text-secondary">
            {project.title}
          </h3>
          <span className="font-alt shrink-0 text-sm text-tertiary">
            {project.year}
          </span>
        </div>
        <p className="mt-0.5 text-sm text-tertiary">{project.client}</p>
        <p className="font-heading mt-0.5 text-xs font-bold lowercase text-tertiary">
          {project.services}
        </p>
      </motion.div>
    </article>
  )
}

export function Projects() {
  const [active, setActive] = useState<Category>('All Work')
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null)

  const visible =
    active === 'All Work'
      ? projects
      : projects.filter((project) => project.category === active)

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

      <div className="grid grid-flow-row-dense grid-cols-1 auto-rows-[300px] gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((project, i) => (
          <ProjectCard
            key={project.slug}
            project={project}
            tall={i % 4 === 0}
            isHovered={hoveredSlug === project.slug}
            isDimmed={hoveredSlug !== null && hoveredSlug !== project.slug}
            onHover={() => setHoveredSlug(project.slug)}
            onHoverEnd={() => setHoveredSlug(null)}
          />
        ))}
      </div>
    </section>
  )
}

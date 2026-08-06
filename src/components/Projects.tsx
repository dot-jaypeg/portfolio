import { useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { categories, projects, type Category, type Project } from '../data/projects'

function ProjectCard({ project }: { project: Project }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])

  return (
    <article>
      <div
        ref={ref}
        className="relative aspect-[4/3] overflow-hidden rounded-xl border border-tertiary/20 bg-tertiary/10"
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
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <h3 className="font-heading text-lg font-normal text-secondary">
          {project.title}
        </h3>
        <span className="font-alt shrink-0 text-sm text-tertiary">
          {project.year}
        </span>
      </div>
      <p className="mt-1 text-sm text-tertiary">{project.client}</p>
      <p className="font-heading mt-2 text-xs font-bold lowercase text-accent">
        {project.services}
      </p>
    </article>
  )
}

export function Projects() {
  const [active, setActive] = useState<Category>('All Work')

  const visible =
    active === 'All Work'
      ? projects
      : projects.filter((project) => project.category === active)

  return (
    <section id="work" className="mx-auto max-w-6xl px-6 pb-24 md:px-10">
      <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <h2 className="font-heading text-3xl font-normal tracking-tight text-tertiary md:text-4xl">
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

      <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  )
}

import { useRef, type ReactNode } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import mePhoto from '../assets/images/about/me.gif'
import { BlockLink } from './BlockLink'
import { EXPERTISE } from '../data/expertise'

const STACK = [
  'Photoshop',
  'Illustrator',
  'InDesign',
  'Unreal',
  'Figma',
  'After Effects',
  'Lightroom Classic',
  'Premiere Pro',
  'CapCut',
  'Canva',
  'Visual Studio Code',
]

const CREDENTIALS = [
  {
    title: 'Creative Technologist',
    company: 'Advanced Marketers',
    dates: '2026 — Present',
  },
  {
    title: 'Marketing Operations',
    company: 'Brand Innovators Strategy Group',
    dates: '2026',
  },
  {
    title: 'Digital Marketing & Music Management',
    company: 'Velvet Hammer Music & Management Group',
    dates: '2025',
  },
  {
    title: 'Junior UX/UI & Graphic Designer',
    company: 'MARQUI Labs',
    dates: '2023 — 2024',
  },
]

function FadeIn({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.25, 1, 0.25])

  return (
    <motion.p ref={ref} style={{ opacity }} className={className}>
      {children}
    </motion.p>
  )
}

export function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-6 pb-24 md:px-10">
      <h2 className="font-heading text-[21px] font-normal tracking-tight text-tertiary">
        A Little About Me…
      </h2>

      <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-[220px_1fr] md:gap-16">
        <div className="flex flex-col gap-4">
          <div className="aspect-[4/5] w-full max-w-[220px] overflow-hidden rounded-xl border border-tertiary/20">
            <img
              src={mePhoto}
              alt="Jayden Ramirez"
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-2 font-heading text-sm font-bold lowercase text-tertiary">
            <BlockLink
              href="https://www.linkedin.com/in/jaydenramirez-design"
              target="_blank"
              rel="noreferrer"
            >
              linkedin ↗
            </BlockLink>
            <BlockLink
              href="https://open.spotify.com/user/g0x9bgn3drywnj4nomeu9ek11?si=5e216c1d498d4a24"
              target="_blank"
              rel="noreferrer"
            >
              spotify ↗
            </BlockLink>
            <BlockLink
              href="https://drive.google.com/file/d/1Ahew8Y5ZVXMA8cAMo7_uslweZygII046/view"
              target="_blank"
              rel="noreferrer"
            >
              resume ↗
            </BlockLink>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <FadeIn className="max-w-2xl font-heading text-3xl leading-snug font-normal tracking-tight text-secondary md:text-4xl">
            I'm an experienced multidisciplinary designer who loves working
            right at the intersection of branding, digital marketing, and
            visual storytelling.
          </FadeIn>
          <FadeIn className="max-w-2xl text-lg leading-relaxed text-secondary">
            Running my own freelance business,{' '}
            <span className="font-heading font-bold lowercase">
              .jaypeg studios
            </span>
            , and building my foundation at Chapman taught me how to approach
            creative challenges from all angles.
          </FadeIn>
          <FadeIn className="max-w-2xl text-lg leading-relaxed text-secondary">
            Because I draw from a really wide toolkit — whether making art
            for a published Steam game or using my photography and
            videography background to tell a brand's story — I can easily
            adapt to any project and help push a team's creative vision
            forward.
          </FadeIn>
        </div>
      </div>

      <ul className="mt-10 flex flex-wrap justify-center gap-2">
        {EXPERTISE.map((item) => (
          <li
            key={item}
            className="rounded-full bg-accent px-3 py-1.5 font-heading text-sm font-bold lowercase text-primary"
          >
            {item}
          </li>
        ))}
      </ul>

      <div className="mt-20 grid grid-cols-1 gap-6 md:grid-cols-[220px_1fr] md:gap-16">
        <h3 className="font-heading text-sm font-bold lowercase text-tertiary">
          the stack
        </h3>
        <ul className="grid grid-cols-2 gap-y-3 text-lg text-secondary sm:grid-cols-3">
          {STACK.map((tool) => (
            <li key={tool}>{tool}</li>
          ))}
        </ul>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-[220px_1fr] md:gap-16">
        <h3 className="font-heading text-sm font-bold lowercase text-tertiary">
          my credentials
        </h3>
        <ul className="flex flex-col gap-6">
          {CREDENTIALS.map((role) => (
            <li key={role.title}>
              <p className="font-heading text-lg font-bold text-secondary">
                {role.title}
              </p>
              <p className="mt-0.5 text-sm text-tertiary">
                {role.company} | {role.dates}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

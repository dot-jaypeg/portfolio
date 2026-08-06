import { useRef, type ReactNode } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import mePhoto from '../assets/images/about/me.gif'
import { BlockLink } from './BlockLink'
import { EXPERTISE } from '../data/expertise'

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
          <FadeIn className="font-heading text-3xl leading-snug font-normal tracking-tight text-secondary md:text-4xl">
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

      <ul className="mt-10 flex flex-wrap gap-1.5">
        {EXPERTISE.map((item) => (
          <li
            key={item}
            className="rounded-full bg-accent px-2.5 py-1 font-heading text-xs font-bold lowercase text-primary"
          >
            {item}
          </li>
        ))}
      </ul>
    </section>
  )
}

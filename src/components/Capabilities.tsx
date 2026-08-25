import { EXPERTISE } from '../data/expertise'
import { STACK } from '../data/stack'
import { CREDENTIALS } from '../data/credentials'
import { Reveal } from './Reveal'

export function Capabilities() {
  return (
    <section id="about" className="mx-auto max-w-[1600px] px-6 py-24 md:px-10 md:py-32">
      <Reveal>
        <p className="font-body text-xs tracking-[0.3em] text-teal uppercase">
          About
        </p>
      </Reveal>

      <Reveal delay={0.05} className="mt-8 max-w-3xl">
        <p className="font-display text-3xl leading-snug font-bold text-cream uppercase md:text-5xl">
          Multidisciplinary designer working across branding, digital
          marketing, and visual storytelling.
        </p>
      </Reveal>

      <Reveal delay={0.1} className="mt-10 max-w-2xl">
        <p className="font-body text-base leading-relaxed text-cream/70">
          Running my own freelance business, .jaypeg studios, and building my
          foundation at Chapman taught me how to approach creative challenges
          from all angles. I draw from a wide toolkit — whether making art
          for a published Steam game or using my photography and videography
          background to tell a brand's story.
        </p>
      </Reveal>

      <Reveal delay={0.15} className="mt-10 flex flex-wrap gap-2">
        {EXPERTISE.map((item) => (
          <span
            key={item}
            className="font-body rounded-full border border-cream/20 px-3 py-1.5 text-xs tracking-widest text-cream/70 uppercase"
          >
            {item}
          </span>
        ))}
      </Reveal>

      <div className="mt-24 grid grid-cols-1 gap-6 md:grid-cols-2">
        <Reveal>
          <h3 className="font-body text-xs tracking-[0.2em] text-cream/50 uppercase">
            The Stack
          </h3>
        </Reveal>
        <Reveal>
          <ul className="font-display flex flex-col gap-4 text-sm font-bold tracking-tight text-cream uppercase">
            {STACK.map((tool) => (
              <li key={tool}>{tool}</li>
            ))}
          </ul>
        </Reveal>
      </div>

      <div className="mt-20 grid grid-cols-1 gap-6 md:grid-cols-2">
        <Reveal>
          <h3 className="font-body text-xs tracking-[0.2em] text-cream/50 uppercase">
            Credentials
          </h3>
        </Reveal>
        <ul className="flex flex-col gap-8">
          {CREDENTIALS.map((role, i) => (
            <li key={role.title}>
              <Reveal delay={i * 0.05}>
                <p className="font-display text-sm font-bold tracking-wide text-cream uppercase">
                  {role.title}
                </p>
                <p className="font-body mt-1.5 flex items-center gap-2 text-sm tracking-wide text-cream/50 uppercase">
                  <span>{role.company}</span>
                  <span className="inline-block h-1.5 w-1.5 shrink-0 bg-red" />
                  <span>{role.dates}</span>
                </p>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

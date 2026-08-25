import type { ReactNode } from 'react'
import { CASE_STUDIES, type CaseStudy } from './caseStudies'
import { STACK } from './stack'
import { CREDENTIALS } from './credentials'
import { ExpertisePills } from '../components/ExpertisePills'

const pad = (num: number) => String(num).padStart(2, '0')

export interface JourneyChapter {
  key: string
  eyebrow: string
  bg: string
  fg: string
  render: () => ReactNode
}

export const WORK_COUNT = CASE_STUDIES.length
export const ABOUT_COUNT = 2
export const TOTAL_CHAPTERS = WORK_COUNT + ABOUT_COUNT

// `min-h-screen` (not `h-full`) deliberately: on desktop these panels
// sit inside JourneyDesktop's `h-screen` flex-row track, where it's
// equivalent to filling the track exactly. On mobile (JourneyMobile),
// the same components render directly in normal block flow with no
// fixed-height ancestor -- `h-full` would collapse to 0 there, while
// `min-h-screen` still gives each stacked chapter a full-viewport
// "interstitial" feel without depending on an ancestor's height. This
// is why the identical JSX works unmodified in both contexts.
function WorkPanel({
  cs,
  eyebrow,
  id,
}: {
  cs: CaseStudy
  eyebrow: string
  id?: string
}) {
  return (
    <div
      id={id}
      className="chapter-panel relative flex min-h-screen w-screen shrink-0 items-center gap-12 px-8 py-24 md:px-20"
    >
      <div className="relative aspect-[4/5] w-[38vw] max-w-xl shrink-0 overflow-hidden">
        <div className="chapter-media font-body absolute inset-[-8%] flex items-center justify-center border border-dashed border-cream/20 text-xs tracking-[0.3em] text-cream/30 uppercase select-none">
          [ placeholder image ]
        </div>
      </div>
      <div className="chapter-copy max-w-xl">
        <p className="font-body text-xs tracking-[0.3em] text-teal uppercase">
          {eyebrow}
        </p>
        <h2 className="chapter-headline font-display mt-4 text-[7vw] leading-[0.9] font-bold tracking-tighter text-cream uppercase md:text-[5vw]">
          {cs.title}
        </h2>
        <p className="font-body mt-6 max-w-md text-sm leading-relaxed text-cream/60">
          {cs.description}
        </p>
        <p className="font-body mt-4 text-xs tracking-widest text-teal uppercase">
          {cs.category}
        </p>
      </div>
    </div>
  )
}

function AboutStatementPanel({
  eyebrow,
  id,
}: {
  eyebrow: string
  id?: string
}) {
  return (
    <div
      id={id}
      className="chapter-panel relative flex min-h-screen w-screen shrink-0 flex-col justify-center gap-8 px-8 py-24 md:px-20"
    >
      <div className="chapter-copy max-w-4xl">
        <p className="font-body text-xs tracking-[0.3em] text-teal uppercase">
          {eyebrow}
        </p>
        <h2 className="chapter-headline font-display mt-4 text-[9vw] leading-[0.9] font-bold tracking-tighter text-cream uppercase md:text-[6vw]">
          Multidisciplinary Designer.
        </h2>
        <p className="font-body mt-8 max-w-xl text-base leading-relaxed text-cream/70">
          A designer working across branding, digital marketing, and visual
          storytelling. Running my own freelance business, .jaypeg studios,
          and building my foundation at Chapman taught me how to approach
          creative challenges from all angles. I draw from a wide toolkit —
          whether making art for a published Steam game or using my
          photography and videography background to tell a brand's story.
        </p>
        <div className="mt-10">
          <ExpertisePills />
        </div>
      </div>
    </div>
  )
}

function AboutCredentialsPanel({ eyebrow }: { eyebrow: string }) {
  return (
    <div className="chapter-panel relative flex min-h-screen w-screen shrink-0 items-center gap-16 px-8 py-24 md:px-20">
      <div className="chapter-copy max-w-4xl">
        <p className="font-body text-xs tracking-[0.3em] text-teal uppercase">
          {eyebrow}
        </p>
        <h2 className="chapter-headline font-display mt-4 text-[6vw] leading-[0.9] font-bold tracking-tighter text-cream uppercase md:text-[4vw]">
          Stack &amp; Credentials
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-2">
          <div>
            <h3 className="font-body text-xs tracking-[0.2em] text-cream/50 uppercase">
              The Stack
            </h3>
            <ul className="font-display mt-4 flex flex-col gap-3 text-sm font-bold tracking-tight text-cream uppercase">
              {STACK.map((tool) => (
                <li key={tool}>{tool}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-body text-xs tracking-[0.2em] text-cream/50 uppercase">
              Credentials
            </h3>
            <ul className="mt-4 flex flex-col gap-6">
              {CREDENTIALS.map((role) => (
                <li key={role.title}>
                  <p className="font-display text-sm font-bold tracking-wide text-cream uppercase">
                    {role.title}
                  </p>
                  <p className="font-body mt-1.5 flex items-center gap-2 text-sm tracking-wide text-cream/50 uppercase">
                    <span>{role.company}</span>
                    <span className="inline-block h-1.5 w-1.5 shrink-0 bg-red" />
                    <span>{role.dates}</span>
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export const JOURNEY_CHAPTERS: JourneyChapter[] = [
  ...CASE_STUDIES.map((cs, i) => {
    const eyebrow = `${pad(i + 1)} — Work`
    return {
      key: cs.slug,
      eyebrow,
      bg: '#161616',
      fg: '#fffcef',
      render: () => (
        <WorkPanel cs={cs} eyebrow={eyebrow} id={i === 0 ? 'work' : undefined} />
      ),
    }
  }),
  {
    key: 'about-statement',
    eyebrow: `${pad(WORK_COUNT + 1)} — About`,
    bg: '#fffcef',
    fg: '#161616',
    render: () => (
      <AboutStatementPanel
        eyebrow={`${pad(WORK_COUNT + 1)} — About`}
        id="about"
      />
    ),
  },
  {
    key: 'about-credentials',
    eyebrow: `${pad(WORK_COUNT + 2)} — About`,
    bg: '#fffcef',
    fg: '#161616',
    render: () => (
      <AboutCredentialsPanel eyebrow={`${pad(WORK_COUNT + 2)} — About`} />
    ),
  },
]

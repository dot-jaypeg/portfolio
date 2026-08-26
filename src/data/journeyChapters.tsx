import type { ReactNode } from 'react'
import { CASE_STUDIES, type CaseStudy } from './caseStudies'
import { STACK } from './stack'
import { CREDENTIALS } from './credentials'
import { ExpertisePills } from '../components/ExpertisePills'
import meGif from '../assets/images/about/me.gif'

const pad = (num: number) => String(num).padStart(2, '0')

export interface JourneyChapter {
  key: string
  eyebrow: string
  bg: string
  fg: string
  render: () => ReactNode
}

// Only a curated subset gets a full chapter in the main scroll-jacked
// Journey -- anyone manually scrolling through Work would otherwise
// pass every single case study, not just the highlights. The "View All"
// overlay (ChaptersMenu) still lists the complete CASE_STUDIES set
// separately; it isn't driven by this featured subset.
const FEATURED_CASE_STUDIES = CASE_STUDIES.slice(0, 5)

export const WORK_COUNT = FEATURED_CASE_STUDIES.length
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
        {cs.image ? (
          <img
            src={cs.image}
            alt={cs.title}
            data-parallax-amount={cs.imageParallax ?? 8}
            className="chapter-media absolute max-w-none object-cover"
            style={{
              inset: `-${cs.imageParallax ?? 8}%`,
              width: `${100 + (cs.imageParallax ?? 8) * 2}%`,
              height: `${100 + (cs.imageParallax ?? 8) * 2}%`,
            }}
          />
        ) : (
          <div className="chapter-media font-body absolute inset-[-8%] flex items-center justify-center border border-dashed border-cream/20 text-xs tracking-[0.22em] text-cream/30 uppercase select-none">
            [ placeholder image ]
          </div>
        )}
      </div>
      <div className="chapter-copy max-w-xl">
        <p className="font-body text-xs tracking-[0.22em] text-teal uppercase">
          {eyebrow}
        </p>
        <h2 className="chapter-headline font-display mt-4 text-[7vw] leading-[0.9] font-bold tracking-[-0.06em] text-cream uppercase md:text-[5vw]">
          {cs.title}
        </h2>
        <p className="font-body mt-6 max-w-md text-sm leading-relaxed text-cream/60">
          {cs.description}
        </p>
        <p className="font-body mt-4 text-xs tracking-wider text-teal uppercase">
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
      className="chapter-panel relative flex min-h-screen w-screen shrink-0 items-center gap-12 px-8 py-24 md:px-20"
    >
      <div className="chapter-copy max-w-2xl">
        <p className="font-body text-xs tracking-[0.22em] text-teal uppercase">
          {eyebrow}
        </p>
        <h2 className="chapter-headline font-display mt-4 text-[7vw] leading-[0.95] font-bold tracking-[-0.06em] text-cream uppercase md:text-[5vw]">
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
      <div className="group relative ml-auto hidden w-[26vw] max-w-sm shrink-0 md:block">
        {/* A real polaroid card, not just a photo box -- fixed off-white
            paper color (not `bg-cream`, which resolves to the
            crossfading --fg and would go BLACK on this panel, since
            About's fg is ink) and a fixed shadow color, both
            deliberately independent of the site's per-section color
            inversion the way Cursor.tsx's dot fill is, since a physical
            object's own paper/shadow shouldn't invert with the page.
            Tilted at rest like it was tossed down; hovering straightens
            it out, lifts it slightly, and deepens the shadow -- the
            "picking it up off the table" cue. */}
        <div className="rotate-[-4deg] bg-[#f2efe6] p-3 pb-9 shadow-xl shadow-black/25 transition-all duration-500 ease-out group-hover:-translate-y-1 group-hover:rotate-0 group-hover:shadow-2xl group-hover:shadow-black/35">
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-ink">
            {/* The decorative star/camera stickers sit very close to the
                gif's own edges (within ~5-7% at the tightest point), so the
                default 8% swing's oversize would clip into them regardless
                of how the source crop is adjusted -- there just isn't 8%
                of disposable margin around them to work with. Cropped out
                most (not all) of the gif's original polaroid-style border,
                keeping a thin sliver as the swing's bleed margin, and
                dialed the swing itself down to a smaller, safer amount that
                fits the room actually available without touching them.
                `max-w-none` is required, not decorative -- Tailwind's own
                preflight sets `img { max-width: 100% }`, which was silently
                capping this element's WIDTH at 100% regardless of the 106%
                utility (confirmed directly: computed width equaled the
                container's exactly, while computed height correctly came
                out to 106%, since only width has a competing max-width
                rule). That one-sided cap is what was actually clipping the
                stickers, more than any crop choice. */}
            <img
              src={meGif}
              alt="Jayden Ramirez"
              data-parallax-amount="3"
              className="chapter-media absolute inset-[-3%] h-[106%] w-[106%] max-w-none object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function AboutCredentialsPanel({ eyebrow }: { eyebrow: string }) {
  return (
    <div className="chapter-panel relative flex min-h-screen w-screen shrink-0 items-center gap-16 px-8 py-24 md:px-20">
      <div className="chapter-copy max-w-4xl">
        <p className="font-body text-xs tracking-[0.22em] text-teal uppercase">
          {eyebrow}
        </p>
        <h2 className="chapter-headline font-display mt-4 text-[6vw] leading-[0.9] font-bold tracking-[-0.06em] text-cream uppercase md:text-[4vw]">
          Stack &amp; Credentials
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-2">
          <div>
            <h3 className="font-body text-xs tracking-[0.14em] text-cream/50 uppercase">
              The Stack
            </h3>
            <ul className="font-display mt-4 flex flex-col gap-3 text-sm font-bold tracking-[-0.06em] text-cream uppercase">
              {STACK.map((tool) => (
                <li key={tool}>{tool}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-body text-xs tracking-[0.14em] text-cream/50 uppercase">
              Credentials
            </h3>
            <ul className="mt-4 flex flex-col gap-6">
              {CREDENTIALS.map((role) => (
                <li key={role.title}>
                  <p className="font-display text-sm font-bold tracking-normal text-cream uppercase">
                    {role.title}
                  </p>
                  <p className="font-body mt-1.5 flex items-center gap-2 text-sm tracking-normal text-cream/50 uppercase">
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
  ...FEATURED_CASE_STUDIES.map((cs, i) => {
    const eyebrow = `${pad(i + 1)} — ${cs.client}`
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

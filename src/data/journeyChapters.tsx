import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
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
// Journey -- anyone manually scrolling through Work would otherwise pass
// every single case study, not just the highlights. The full CASE_STUDIES
// set (including the still-placeholder 06-10 entries) lives on the
// dedicated /work page instead, linked from the ViewAllPanel chapter
// right after this featured run ends.
const FEATURED_CASE_STUDIES = CASE_STUDIES.slice(0, 5)

export const WORK_COUNT = FEATURED_CASE_STUDIES.length
export const ABOUT_COUNT = 2
// +1 for the ViewAllPanel chapter sitting between Work and About.
export const TOTAL_CHAPTERS = WORK_COUNT + 1 + ABOUT_COUNT

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
  index,
  id,
}: {
  cs: CaseStudy
  index: number
  id?: string
}) {
  // Turned up the "fun"/unpredictable dial a level past the last pass --
  // three specific devices borrowed straight from the references:
  // (1) sides ALTERNATE per case study (flex-row-reverse on odd indices)
  // instead of every chapter running the identical image-left/text-right
  // layout -- that repetition across 5 back-to-back chapters was a big
  // part of why it read as flat/orderly rather than scattered.
  // (2) the title now actually fills the available width (`flex-1`
  // instead of a `max-w-xl` cap that left a dead black gap on the
  // right), at a genuinely loud size.
  // (3) a rotated vertical strip and an oversized quotation mark, both
  // in an accent color that alternates teal/red by index -- a direct
  // callback to the reference's rotated colored text strip and pull-quote
  // treatment, using colors already in this site's palette rather than
  // introducing their yellow.
  const flipped = index % 2 === 1
  const accent = index % 2 === 0 ? 'text-teal' : 'text-red'
  return (
    <div
      id={id}
      className={`chapter-panel relative flex min-h-screen w-screen shrink-0 items-start gap-8 px-8 md:px-20 ${flipped ? 'flex-row-reverse' : ''}`}
    >
      <div className="relative w-[38vw] max-w-xl shrink-0 self-stretch overflow-hidden">
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
              objectPosition: cs.imagePosition ?? 'center',
            }}
          />
        ) : (
          <div className="chapter-media font-body absolute inset-[-8%] flex items-center justify-center border border-dashed border-cream/20 text-xs tracking-[0.22em] text-cream/30 uppercase select-none">
            [ placeholder image ]
          </div>
        )}
      </div>
      <div className="hidden shrink-0 self-stretch items-center justify-center md:flex">
        <span
          className={`font-body whitespace-nowrap text-xs tracking-[0.4em] uppercase [writing-mode:vertical-rl] ${accent}`}
        >
          Selected Work
        </span>
      </div>
      <div className="chapter-copy flex max-w-3xl flex-1 flex-col justify-between self-stretch py-16 md:py-24">
        <div>
          <div className="font-body flex flex-wrap items-baseline gap-x-3 gap-y-1 text-xs tracking-[0.2em] uppercase">
            <span className={accent}>({pad(index + 1)})</span>
            <span className="text-cream/60">{cs.client}</span>
            <span className="text-cream/30">—</span>
            <span className="text-cream/60">{cs.category}</span>
          </div>
          <h2 className="chapter-headline font-display mt-8 text-[10vw] leading-[0.78] font-bold tracking-[-0.05em] text-cream uppercase md:text-[6.5vw]">
            {cs.title}
          </h2>
        </div>
        <p className="font-body max-w-lg text-lg leading-relaxed text-cream/70">
          <span className={`font-display mr-1 align-top text-3xl ${accent}`}>
            &ldquo;
          </span>
          {cs.description}
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
      {/* Fixed-color layer (not the crossfading --bg var) so the
          Work -> About boundary's clip-mask wipe reveals a genuine hard
          color edge instead of whatever shade the page-wide crossfade
          happens to be mid-interpolating at that exact scroll position --
          same "physical object, doesn't invert" reasoning as the polaroid
          card's own fixed paper color below. Clipped/scaled for free
          along with the rest of this panel, since it's just another
          child of the element the crossover tween already targets. */}
      <div className="pointer-events-none absolute inset-0 bg-[#fffff0]" />
      <div className="chapter-copy relative max-w-2xl">
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

function ViewAllPanel({ eyebrow }: { eyebrow: string }) {
  return (
    <div className="chapter-panel relative flex min-h-screen w-screen shrink-0 items-center justify-center overflow-hidden px-8 text-center">
      {/* Fixed ink, mirroring the fixed cream layer on AboutStatementPanel
          right after this one -- together they give the boundary's
          clip-mask wipe a genuine hard color edge (ink -> cream) instead
          of relying on the page-wide --bg crossfade, which interpolates
          gradually and wouldn't read as a sharp mask. */}
      <div className="pointer-events-none absolute inset-0 bg-[#161616]" />
      {/* Oversized numeral drifting behind the headline -- reuses the
          exact same data-parallax-amount xPercent swing every other
          chapter's `.chapter-media` gets (JourneyDesktop doesn't care
          whether that class is on a photo or plain text), giving this
          otherwise flat single-color panel some real depth instead of
          sitting completely static while every other chapter has a
          moving layer. */}
      <span
        aria-hidden="true"
        data-parallax-amount="18"
        className="chapter-media font-display pointer-events-none absolute inset-0 flex items-center justify-center text-[48vw] leading-none font-bold tracking-[-0.04em] text-cream/[0.04] uppercase select-none"
      >
        {pad(WORK_COUNT + 1)}
      </span>
      {/* `.chapter-copy` -- the same wrapper class gives this its own
          subtle -4/4 xPercent drift too, same as every other chapter's
          copy block, so the headline moves at a visibly different rate
          than the numeral behind it (the actual parallax cue, not just
          one layer moving). */}
      <div className="chapter-copy relative flex flex-col items-center gap-6">
        <p className="font-body text-xs tracking-[0.32em] text-teal uppercase">
          {eyebrow}
        </p>
        {/* The link itself carries `.chapter-headline` -- SplitText
            doesn't care what element it targets, and this IS the
            panel's headline moment, not a caption underneath one. */}
        <Link
          to="/work"
          data-cursor="View All"
          className="chapter-headline font-display group inline-flex items-center gap-4 text-[13vw] leading-[0.82] font-bold tracking-[-0.05em] text-cream uppercase transition-colors duration-300 hover:text-teal md:text-[8vw]"
        >
          View All
          <span
            aria-hidden="true"
            className="inline-block transition-transform duration-300 ease-out group-hover:translate-x-3"
          >
            →
          </span>
        </Link>
        <p className="font-body max-w-md text-sm leading-relaxed text-cream/50">
          Every case study, past and present, in one place.
        </p>
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
      fg: '#fffff0',
      render: () => (
        <WorkPanel cs={cs} index={i} id={i === 0 ? 'work' : undefined} />
      ),
    }
  }),
  {
    key: 'view-all',
    eyebrow: `${pad(WORK_COUNT + 1)} — Selected Work`,
    bg: '#161616',
    fg: '#fffff0',
    render: () => (
      <ViewAllPanel eyebrow={`${pad(WORK_COUNT + 1)} — Selected Work`} />
    ),
  },
  {
    key: 'about-statement',
    eyebrow: `${pad(WORK_COUNT + 2)} — About`,
    bg: '#fffff0',
    fg: '#161616',
    render: () => (
      <AboutStatementPanel
        eyebrow={`${pad(WORK_COUNT + 2)} — About`}
        id="about"
      />
    ),
  },
  {
    key: 'about-credentials',
    eyebrow: `${pad(WORK_COUNT + 3)} — About`,
    bg: '#fffff0',
    fg: '#161616',
    render: () => (
      <AboutCredentialsPanel eyebrow={`${pad(WORK_COUNT + 3)} — About`} />
    ),
  },
]

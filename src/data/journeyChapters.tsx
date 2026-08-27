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
          {cs.client}
        </span>
      </div>
      <div className="chapter-copy flex max-w-3xl flex-1 flex-col justify-between self-stretch py-16 md:py-24">
        <div>
          <div className="font-body flex flex-wrap items-baseline gap-x-3 gap-y-1 text-xs tracking-[0.2em] uppercase">
            <span className={accent}>[{pad(index + 1)}]</span>
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
      {/* Fixed cream, mirroring ViewAllPanel's own fixed ink layer right
          before this one -- see that comment for why the shared soft
          --bg crossfade can't produce the hard pushing edge this
          boundary needs on its own. */}
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

function ViewAllPanel() {
  // Sized exactly like a case study's own cover-photo column
  // (w-[38vw] max-w-xl, self-stretch to the full page height) instead
  // of spanning the whole panel -- this divider should read as one more
  // "cover" in the same rhythm as the chapters before it, not a
  // full-bleed interstitial. `bg-teal` (a static accent color, not the
  // crossfading --bg var) gives the column its own fixed identity, the
  // same way WorkPanel's accent colors don't invert with the page.
  return (
    <div className="chapter-panel relative flex min-h-screen w-screen shrink-0 items-center gap-8 px-8 md:px-20">
      {/* Fixed ink, covering the WHOLE panel (not just the teal
          column) -- not the crossfading --bg var. The Work -> About
          boundary is meant to read as About's own panel physically
          pushing this one out of frame as the track slides them, and
          that only reads as a hard edge if each panel carries its own
          solid, non-interpolating color; the shared soft --bg crossfade
          blends the whole viewport uniformly regardless of which panel
          is on screen, so it can't produce a moving edge on its own. */}
      <div className="pointer-events-none absolute inset-0 bg-[#161616]" />
      <div className="relative flex w-[38vw] max-w-xl shrink-0 items-center justify-center self-stretch overflow-hidden bg-teal">
        {/* A high-impact vertical divider, after the Le Mans Classic
            reference's own yellow "LE MANS MOTORS CLUB" panel -- massive
            rotated type interrupting the horizontal reading flow to mark
            a real section break, rather than a conventional
            horizontally-set CTA line.
            The -rotate-90 lives on this OUTER wrapper as a plain, static
            CSS transform that GSAP never touches -- putting it on the
            same element as the parallax/exit tweens below was tried
            first and risked GSAP's own transform writes (xPercent,
            scale) overwriting or fighting this rotation, since both
            ultimately resolve to the same `transform` property. The
            INNER link gets the GSAP-driven classes instead, so the two
            never touch the same transform.
            Sized in vw relative to the VIEWPORT, not this now-narrower
            column, since the binding constraint is fitting the text's
            un-rotated WIDTH inside the column's full page HEIGHT once
            rotated -- too large here clipped the top/bottom of the
            phrase against the panel's own overflow-hidden edge. */}
        <div className="-rotate-90">
          <Link
            to="/work"
            data-cursor="View All"
            className="chapter-headline chapter-copy font-display group inline-flex items-center gap-4 text-[4.2vw] leading-none font-bold tracking-[-0.04em] whitespace-nowrap text-[#161616] uppercase transition-colors duration-300 hover:text-red"
          >
            {/* Leading dot bullet instead of a trailing arrow, after the
                basicagency.com reference's own "● INTO COMPANY VALUE" --
                rotates along with the rest of the text, so it reads as
                the first thing the vertical bottom-to-top flow reaches
                rather than a floating accent mark. */}
            <span
              aria-hidden="true"
              className="inline-block h-[0.32em] w-[0.32em] shrink-0 rounded-full bg-current"
            />
            View All Work
          </Link>
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
      fg: '#fffff0',
      render: () => (
        <WorkPanel cs={cs} index={i} id={i === 0 ? 'work' : undefined} />
      ),
    }
  }),
  {
    // Ink/cream, matching the Work chapters around it -- NOT teal.
    // This chapter's bg/fg drive the page-WIDE crossfade (html/body,
    // nav color, everything else on screen), so setting it to teal
    // tinted the entire viewport that color, not just the panel's own
    // column -- the exact "takes up the whole page" bug. Teal now lives
    // ONLY as the fixed `bg-teal` accent on the column itself inside
    // ViewAllPanel, the same way WorkPanel's accent colors are a local
    // detail rather than the page's own theme.
    key: 'view-all',
    eyebrow: 'All of my best works',
    bg: '#161616',
    fg: '#fffff0',
    render: () => <ViewAllPanel />,
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

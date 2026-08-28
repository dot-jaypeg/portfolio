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
        {/* A real bottom gradient (not a small local scrim) plus plain
            horizontal type, replacing the earlier vertical-rotated
            corner placard -- simpler, and the gradient guarantees
            contrast across the WHOLE lower third of the photo rather
            than needing its own opaque backdrop chip behind just the
            label. Pushed darker still per feedback. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black to-transparent" />
        {/* Lighter cream, not the teal/red accent -- that accent belongs
            on the category label below instead (swapped back after an
            earlier pass put it here by mistake). `.chapter-media` gives
            this its own independent parallax drift, same mechanic as
            the photo itself, now that JourneyDesktop supports more than
            one media target per panel. */}
        <span
          data-parallax-amount="4"
          className="chapter-media font-body absolute bottom-6 left-6 text-xs tracking-[0.3em] text-cream uppercase md:bottom-10 md:left-10"
        >
          {cs.client}
        </span>
      </div>
      <div className="chapter-copy flex max-w-3xl flex-1 flex-col justify-between self-stretch py-16 md:py-24">
        <div>
          <h2 className="chapter-headline font-display text-[10vw] leading-[0.78] font-bold tracking-[-0.05em] text-cream uppercase md:text-[6.5vw]">
            {cs.title}
          </h2>
          {/* Category sits under the title instead of in a metadata row
              above it, and the case number next to it is gone entirely
              -- per feedback. Back to the teal/red accent (reverted --
              an earlier pass swapped this and the client label's colors
              by mistake). */}
          <p className={`font-body mt-4 text-xs tracking-[0.3em] uppercase ${accent}`}>
            {cs.category}
          </p>
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

function AboutStatementPanel({ id }: { id?: string }) {
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
        <h2 className="chapter-headline font-display text-[7vw] leading-[0.95] font-bold tracking-[-0.06em] text-cream uppercase md:text-[5vw]">
          Multidisciplinary Designer.
        </h2>
        <p className="font-body mt-8 max-w-xl text-base leading-relaxed text-cream/70">
          California-based designer composing high-impact visual
          identities across branding, digital marketing, and web design.
          Currently shaping creative direction for small businesses at
          Advanced Marketers, I draw from a wide toolkit built during my
          time at Chapman. I approach every challenge from multiple
          angles, whether I'm utilizing my photography and videography
          background to tell a brand's story, or creating visual assets
          for a published Steam game. When I step away from the screen,
          I'm usually collecting Peach Riot figures, photographing
          friends &amp; landscapes, cosplaying at conventions, or on my
          PS4.
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

function AboutCredentialsPanel() {
  return (
    <div className="chapter-panel relative flex min-h-screen w-screen shrink-0 items-center gap-16 px-8 py-24 md:px-20">
      <div className="chapter-copy max-w-4xl">
        <h2 className="chapter-headline font-display text-[6vw] leading-[0.9] font-bold tracking-[-0.06em] text-cream uppercase md:text-[4vw]">
          Expertise
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
            {/* Same pill treatment as ExpertisePills, just bigger --
                a real, direct download (not just a link to view it)
                since the file is served straight from /public. */}
            <a
              href="/resume/RamirezJayden_2026Resume.pdf"
              download
              className="font-body mt-8 inline-block rounded-full border border-cream/20 px-6 py-3 text-sm tracking-wider text-cream/70 uppercase transition-colors duration-300 hover:border-cream hover:bg-cream hover:text-ink"
            >
              Download Resume
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

function ViewAllPanel() {
  // Full-bleed solid teal, not a narrower cover-photo-sized column --
  // matches how the Le Mans Classic reference's own chapter panels are
  // full-width solid color blocks, and fixes a real complaint: a
  // narrower column (with ink filling the rest of the panel) left a
  // stretch of dead flat-ink space on screen with nothing happening in
  // it, especially scrolling in from the previous case study. `bg-teal`
  // (a static accent color, not the crossfading --bg var) gives the
  // whole panel its own fixed identity, the same way WorkPanel's accent
  // colors don't invert with the page.
  return (
    <div className="chapter-panel relative flex min-h-screen w-screen shrink-0 items-center overflow-hidden bg-teal px-8 md:px-20">
      {/* Two-COLUMN headline, side by side, after basicagency.com's own
          about-page hero.
          Each column now drifts at its OWN rate during scroll -- the
          same media/copy two-speed parallax every other chapter has,
          just reused on text instead of a photo, since this panel has
          neither. Reusing the EXISTING classes/mechanic rather than
          adding new tween code: `.chapter-media` reads its own
          `data-parallax-amount` (8, matching the site's usual default)
          for a more pronounced drift, `.chapter-copy` gets the fixed
          +-4 drift every other panel's copy block gets. They can't
          both live on the outer wrapper (JourneyDesktop's
          querySelector only grabs the FIRST match), so the wrapper
          itself no longer carries either class -- it's just layout now.
          `.chapter-headline` still lives on the first column alone,
          since that's the one SplitText/the exit tween target. */}
      <div className="relative flex flex-col items-start gap-8 md:flex-row md:items-start md:gap-20">
        <h2
          data-parallax-amount="8"
          className="chapter-headline chapter-media font-display max-w-lg text-[12vw] leading-[0.92] font-bold tracking-[-0.04em] text-[#161616] uppercase md:text-[7.5vw]"
        >
          My Most Recent and Best Work
        </h2>
        <Link
          to="/work"
          data-cursor="View All"
          className="chapter-copy group block max-w-lg font-display text-[12vw] leading-[0.92] font-bold tracking-[-0.04em] text-[#161616] uppercase transition-colors duration-300 hover:text-red md:mt-[1.4em] md:text-[7.5vw]"
        >
          <span
            aria-hidden="true"
            className="mr-4 inline-block h-[0.5em] w-[0.5em] rounded-full bg-current align-middle"
          />
          Click to View All
        </Link>
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
    // `eyebrow` here is still just data (used nowhere else in the
    // codebase, confirmed) -- kept for consistency with every other
    // chapter's shape even though neither About panel renders one
    // on-screen anymore, per feedback that these subheads were clutter.
    key: 'about-statement',
    eyebrow: `${pad(WORK_COUNT + 2)} — About`,
    bg: '#fffff0',
    fg: '#161616',
    render: () => <AboutStatementPanel id="about" />,
  },
  {
    key: 'about-credentials',
    eyebrow: `${pad(WORK_COUNT + 3)} — About`,
    bg: '#fffff0',
    fg: '#161616',
    render: () => <AboutCredentialsPanel />,
  },
]

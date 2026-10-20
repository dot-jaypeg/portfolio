import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import type { CaseStudy } from '../data/caseStudies'
import { useMaskNavigate } from '../hooks/useMaskNavigate'
import { gsap } from '../lib/gsap'

// Placeholder pending approved copy (see conversation -- the real
// rewrites were drafted and the client asked for lorem ipsum instead
// for now). Swap this for `cs.description` once real copy is signed
// off -- deliberately NOT stored in caseStudies.ts itself, since that
// field is also the homepage's real WorkPanel pull-quote text for the
// 5 featured projects; overwriting it here would have broken that.
const PLACEHOLDER_BLURB =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua, ut enim ad minim veniam.'

export function ProjectEntry({
  cs,
  aspect,
  animated,
}: {
  cs: CaseStudy
  // Alternates 4:3/3:2 by index (see AllWork.tsx) -- the brief's "two
  // or three fixed aspect ratios" rather than every thumbnail being
  // identical.
  aspect: '4/3' | '3/2'
  // False under prefers-reduced-motion -- skips both the entrance
  // reveal and the scroll-parallax tween below entirely.
  animated: boolean
}) {
  const maskNavigate = useMaskNavigate()
  const imageRef = useRef<HTMLDivElement>(null)
  const accent = cs.accent ?? '#618c82'

  useLayoutEffect(() => {
    if (!animated || !imageRef.current) return
    // The "parallaxed scroll" for this entry's image -- scrubbed
    // directly to scroll position (ease: 'none'), not a one-time
    // reveal, so it continues to drift the whole time the entry is in
    // view. +/-6% translate, inside a parent that insets -8% beyond its
    // own clipped box (see the JSX below) -- same expand-the-box
    // technique as ProjectMedia's blur-up, to keep the translate from
    // ever revealing an empty edge.
    const tween = gsap.fromTo(
      imageRef.current,
      { yPercent: -6 },
      {
        yPercent: 6,
        ease: 'none',
        scrollTrigger: {
          trigger: imageRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      },
    )
    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [animated])

  const goToProject = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    maskNavigate(`/work/${cs.slug}`)
  }

  return (
    <li
      className={`project-entry flex flex-col gap-6 md:flex-row md:items-center md:gap-12 lg:gap-20 ${
        animated ? 'translate-y-10 opacity-0' : ''
      }`}
    >
      <Link
        to={`/work/${cs.slug}`}
        onClick={goToProject}
        data-cursor="View"
        className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal md:w-1/2"
      >
        <div style={{ aspectRatio: aspect }} className="relative overflow-hidden bg-cream/5">
          <div ref={imageRef} className="absolute inset-[-8%]">
            {cs.image ? (
              <img
                src={cs.image}
                alt={`${cs.title} cover`}
                loading="lazy"
                decoding="async"
                style={{ objectPosition: cs.imagePosition ?? 'center' }}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center border border-dashed border-cream/15">
                <span className="font-body px-4 text-center text-[10px] tracking-[0.22em] text-cream/25 uppercase">
                  [ placeholder image ]
                </span>
              </div>
            )}
          </div>
        </div>
      </Link>

      <div className="md:w-1/2">
        <p
          style={{ color: accent }}
          className="font-body mb-3 flex items-center gap-2 text-xs tracking-[0.22em] uppercase"
        >
          <span style={{ backgroundColor: accent }} className="h-px w-6" />
          {cs.category}
        </p>
        <h2 className="font-display text-3xl font-bold tracking-[-0.04em] text-cream uppercase md:text-4xl">
          {cs.title}
        </h2>
        <p className="font-body mt-4 max-w-md text-sm leading-relaxed text-cream/60">{PLACEHOLDER_BLURB}</p>
        <Link
          to={`/work/${cs.slug}`}
          onClick={goToProject}
          className="font-body mt-6 inline-flex items-center gap-2 text-xs tracking-[0.14em] text-cream/60 uppercase transition-colors hover:text-cream focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal"
        >
          View project <span aria-hidden="true">→</span>
        </Link>
      </div>
    </li>
  )
}

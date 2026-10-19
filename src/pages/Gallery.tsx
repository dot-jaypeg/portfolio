import { useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { PROJECTS } from '../data/projects'
import { Cursor } from '../components/Cursor'
import { Grain } from '../components/Grain'
import { GalleryThumb } from '../components/GalleryThumb'
import { useMaskNavigate } from '../hooks/useMaskNavigate'
import { useSmoothScroll } from '../hooks/useSmoothScroll'
import { useScrollToTop } from '../hooks/useScrollToTop'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { gsap, ScrollTrigger, Flip } from '../lib/gsap'

// Self-contained category filter -- this constant, the `activeCategory`
// state, `selectCategory`, and the filter <nav> block in the JSX below
// are the only things that know it exists. Delete all four (and render
// PROJECTS directly instead of a filtered/hidden derivation) to remove
// filtering entirely.
const CATEGORIES = ['All', 'Branding', 'Digital Marketing', 'Visual Storytelling', 'Personal'] as const
type Category = (typeof CATEGORIES)[number]

export function Gallery() {
  useSmoothScroll()
  useScrollToTop()
  useDocumentMeta(
    'Gallery — .jaypeg',
    'A dense, image-led look at recent work across branding, digital marketing, visual storytelling, and personal projects.',
  )
  const prefersReducedMotion = usePrefersReducedMotion()
  const [activeCategory, setActiveCategory] = useState<Category>('All')
  const gridRef = useRef<HTMLUListElement>(null)
  const maskNavigate = useMaskNavigate()

  // Filtering toggles a `hidden` (display:none) class on every thumb
  // rather than actually removing non-matching ones from the DOM --
  // GSAP Flip's enter/leave detection needs the real node to still
  // exist to animate its exit, which a true unmount wouldn't allow.
  // Keeping every node mounted and just toggling visibility is also
  // what lets `.gallery-thumb` stay a stable, one-time target for
  // ScrollTrigger.batch below (filtering never needs to re-run it).
  const selectCategory = (category: Category) => {
    if (category === activeCategory || !gridRef.current || prefersReducedMotion) {
      setActiveCategory(category)
      return
    }
    const state = Flip.getState(gridRef.current.querySelectorAll('.gallery-thumb'))
    setActiveCategory(category)
    requestAnimationFrame(() => {
      Flip.from(state, {
        duration: 0.5,
        ease: 'power2.inOut',
        absolute: true,
        onEnter: (els) =>
          gsap.fromTo(els, { autoAlpha: 0, scale: 0.92 }, { autoAlpha: 1, scale: 1, duration: 0.4, stagger: 0.03 }),
        onLeave: (els) => gsap.to(els, { autoAlpha: 0, scale: 0.92, duration: 0.3 }),
      })
    })
  }

  // Runs once -- filtering only ever toggles the `hidden` class on
  // these same elements (see above), it never adds/removes them, so
  // there's nothing here that needs to re-run when activeCategory
  // changes.
  useLayoutEffect(() => {
    if (prefersReducedMotion || !gridRef.current) return
    const items = gsap.utils.toArray<HTMLElement>(gridRef.current.querySelectorAll('.gallery-thumb'))
    const batches = ScrollTrigger.batch(items, {
      start: 'top 92%',
      onEnter: (batch) =>
        gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power2.out' }),
    })
    // Images/placeholders loading in after this fires can change the
    // page's real height -- recalculating once up front keeps each
    // batch's trigger position honest.
    ScrollTrigger.refresh()
    return () => batches.forEach((trigger) => trigger.kill())
  }, [prefersReducedMotion])

  const goHome = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    maskNavigate('/')
  }

  return (
    <div className="min-h-screen bg-ink">
      <Cursor />
      <Grain />

      <header className="fixed inset-x-0 top-0 z-20 flex items-center justify-between px-6 py-6 md:px-10">
        <Link
          to="/"
          onClick={goHome}
          data-cursor="Home"
          className="font-display text-2xl font-bold tracking-[-0.06em] text-cream italic md:text-3xl"
        >
          .jaypeg
        </Link>
        <Link
          to="/"
          onClick={goHome}
          className="font-body text-xs tracking-[0.22em] text-cream/60 uppercase transition-colors hover:text-cream"
        >
          [Back]
        </Link>
      </header>

      <main className="px-6 pt-28 pb-16 md:px-10 md:pt-36 md:pb-24">
        <h1 className="font-body mb-8 text-xs tracking-[0.3em] text-cream/50 uppercase md:mb-12">
          Gallery
        </h1>

        <nav aria-label="Filter by category" className="mb-8 flex flex-wrap gap-x-6 gap-y-2 md:mb-12">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              aria-pressed={activeCategory === category}
              onClick={() => selectCategory(category)}
              className={`font-body text-xs tracking-[0.14em] uppercase transition-colors ${
                activeCategory === category ? 'text-teal' : 'text-cream/50 hover:text-cream'
              }`}
            >
              {category}
            </button>
          ))}
        </nav>

        <ul ref={gridRef} className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3 lg:grid-cols-4">
          {PROJECTS.map((project) => (
            <GalleryThumb
              key={project.slug}
              project={project}
              hidden={activeCategory !== 'All' && project.category !== activeCategory}
              animated={!prefersReducedMotion}
            />
          ))}
        </ul>
      </main>
    </div>
  )
}

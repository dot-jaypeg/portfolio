import { Link } from 'react-router-dom'
import { Cursor } from '../components/Cursor'
import { Grain } from '../components/Grain'
import { MoodboardCanvas } from '../components/MoodboardCanvas'
import { useMaskNavigate } from '../hooks/useMaskNavigate'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

// Modeled directly on juliajohnson.com's homepage, confirmed by
// inspecting it live: an infinitely-looping, scattered mood-board
// canvas with NO click-through at all (every image's closest <a> was
// null) and no real page scroll (its own body.scrollHeight never
// grows past one viewport). It's pure decoration, not a navigable
// gallery -- real navigation there happens through a separate menu.
//
// This page matches that: MoodboardCanvas is the whole page, with no
// scrollable content and nothing in it to click. useSmoothScroll/
// useScrollToTop/project links from the previous dense-grid version
// are gone because there's no real scroll position or project link to
// manage anymore -- see MoodboardCanvas for how input is handled
// instead (GSAP Observer, not Lenis).
//
// ProjectDetail at /gallery/:slug is still fully built and still
// reachable by a direct URL -- just not linked from anywhere in the
// UI right now. Say the word if you'd rather it come out entirely.
export function Gallery() {
  useDocumentMeta(
    'Gallery — .jaypeg',
    'A continuous, image-led look at recent work across branding, digital marketing, visual storytelling, and personal projects.',
  )

  const maskNavigate = useMaskNavigate()
  const goHome = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    maskNavigate('/')
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-ink">
      <Cursor />
      <Grain />

      {/* Visually hidden -- the canvas itself is aria-hidden (pure
          decoration, see MoodboardCanvas), but the page still needs a
          real heading for assistive tech rather than announcing
          nothing at all. */}
      <h1 className="sr-only">Gallery</h1>

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

      <MoodboardCanvas />
    </div>
  )
}

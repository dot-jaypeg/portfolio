import { Cursor } from '../components/Cursor'
import { Grain } from '../components/Grain'
import { Nav } from '../components/Nav'
import { MoodboardCanvas } from '../components/MoodboardCanvas'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

// An infinitely-looping, scattered mood-board canvas of real
// photography (event/sports, graduation, landscape & nature -- see
// src/data/galleryPhotos.ts), with no real page scroll (its own
// body.scrollHeight never grows past one viewport) -- navigation
// elsewhere on the site still happens through the shared Nav, not by
// scrolling this page. Clicking a tile opens it full-size in a
// lightbox with its category, instead of linking anywhere -- see
// MoodboardCanvas for that and for how input is handled (GSAP
// Observer, not Lenis, since there's no real scroll position here).
export function Gallery() {
  useDocumentMeta(
    'Gallery — .jaypeg',
    'A continuous, image-led wall of personal photography across events & sports, graduation, and natural & landscape work.',
  )

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-ink">
      <Cursor />
      <Grain />

      {/* Visually hidden -- the canvas itself is aria-hidden (pure
          decoration, see MoodboardCanvas), but the page still needs a
          real heading for assistive tech rather than announcing
          nothing at all. */}
      <h1 className="sr-only">Gallery</h1>

      <Nav />

      <MoodboardCanvas />
    </div>
  )
}

import { Cursor } from '../components/Cursor'
import { Grain } from '../components/Grain'
import { Nav } from '../components/Nav'
import { ProjectStack } from '../components/ProjectStack'
import { Contact } from '../components/Contact'
import { useSmoothScroll } from '../hooks/useSmoothScroll'
import { useScrollToTop } from '../hooks/useScrollToTop'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

// Layered sticky-card-stack scroll, modeled on advancedmarketers.co/
// specialties (motion only -- see ProjectStack for exactly what was
// confirmed from its own shipped script and where this diverges from
// it). Replaces the previous side-by-side list entirely, per direct
// confirmation. /gallery (MoodboardCanvas) is untouched.
export function AllWork() {
  useSmoothScroll()
  useScrollToTop()
  useDocumentMeta(
    'Work — .jaypeg',
    'Selected projects across branding, digital marketing, illustration, and motion.',
  )

  return (
    <div className="bg-ink">
      <Cursor />
      <Grain />

      {/* A backdrop for Nav, not a Nav change -- Nav itself is shared
          across every route, so this stays scoped to this page as its
          own layer sitting just behind it (z-40 vs Nav's z-50) instead
          of touching the shared component. */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-40 h-24 bg-gradient-to-b from-ink/80 to-transparent backdrop-blur-md md:h-28" />
      <Nav />

      {/* No visible intro block per the brief -- this exists purely so
          the page has a real heading for assistive tech. */}
      <h1 className="sr-only">Work</h1>

      <ProjectStack />

      <Contact />
    </div>
  )
}

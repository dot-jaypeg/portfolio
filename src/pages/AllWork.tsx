import { Cursor } from '../components/Cursor'
import { Grain } from '../components/Grain'
import { Nav } from '../components/Nav'
import { WorkGrid } from '../components/WorkGrid'
import { Contact } from '../components/Contact'
import { useSmoothScroll } from '../hooks/useSmoothScroll'
import { useScrollToTop } from '../hooks/useScrollToTop'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

// Full-bleed masonry wall of cover photography, modeled directly on
// thomashedger.co.uk's own work page (see WorkGrid) -- replaces the
// previous sticky-card-stack layout entirely, per direct request.
// /gallery (MoodboardCanvas) is untouched.
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

      {/* No color override needed here -- Nav's default cream-on-dark
          is already correct now that this page is dark too (it used to
          need an ink-text override back when this page had a cream
          background). */}
      <Nav />

      {/* No visible intro block per the brief -- this exists purely so
          the page has a real heading for assistive tech. */}
      <h1 className="sr-only">Work</h1>

      <WorkGrid />

      <Contact />
    </div>
  )
}

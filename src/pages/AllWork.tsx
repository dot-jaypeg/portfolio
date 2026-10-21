import type { CSSProperties } from 'react'
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
    <div className="bg-cream">
      <Cursor />
      <Grain />

      {/* Ink nav text on this page, not a Nav change -- Nav itself is
          shared across every route (Home/Gallery both still want
          cream), so this recolors it by overriding the two CSS
          variables its own text actually resolves through, scoped to a
          wrapper around just Nav (not Contact, further down, which
          needs to stay on the real --fg/--bg tokens to stay dark). The
          links/sound toggle already read `--nav-fg`; the logo is a
          hardcoded `text-cream` utility, which only responds to this
          because `--color-cream` is itself `var(--fg)` -- overriding
          the narrower, derived variable here instead of `--fg` itself
          is what keeps this from also recoloring anything else. */}
      <div style={{ '--nav-fg': '#161616', '--color-cream': '#161616' } as CSSProperties}>
        <Nav />
      </div>

      {/* No visible intro block per the brief -- this exists purely so
          the page has a real heading for assistive tech. */}
      <h1 className="sr-only">Work</h1>

      <ProjectStack />

      <Contact />
    </div>
  )
}

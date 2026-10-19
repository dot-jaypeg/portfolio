import { useEffect } from 'react'

// There's no <ScrollRestoration> here -- this project uses a plain
// BrowserRouter, not a data router, and that component only exists on
// the latter. Without an explicit reset, the browser just keeps
// whatever scroll position the previous page was at.
//
// `key` matters for routes like /gallery/:slug: clicking Prev/Next
// changes the :slug param without unmounting ProjectDetail (same route
// match, React Router just re-renders with new params), so an
// empty-array effect would only ever reset scroll on the FIRST project
// a visitor lands on, not on subsequent ones reached via those links.
// Passing the slug as `key` re-fires this on every param change too.
export function useScrollToTop(key?: unknown) {
  useEffect(() => {
    window.scrollTo(0, 0)
    window.__lenis?.scrollTo(0, { immediate: true })
  }, [key])
}

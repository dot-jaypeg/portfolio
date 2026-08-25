import { TOTAL_CHAPTERS } from '../data/journeyChapters'

// The Journey's pinned ScrollTrigger is stashed on window (set by
// JourneyDesktop, cleared on unmount/mobile) so Nav and ChaptersMenu can
// both compute an absolute scroll target for a given chapter without
// resolving to the chapter's live DOM position -- which, once past the
// pin, freezes at wherever the pin left it (the same issue Nav's #top
// special-case already works around for CinematicIntro).
export function getChapterScrollOffset(index: number): number | null {
  const st = window.__journeyScrollTrigger
  if (!st) return null
  // Chapter i sits exactly centered in the viewport at progress
  // i/(TOTAL_CHAPTERS - 1) -- the track travels (n-1) panel-widths
  // total over the pin's full scroll range, not n -- matching the same
  // correction JourneyDesktop's own per-chapter timing uses internally.
  return st.start + (index / (TOTAL_CHAPTERS - 1)) * (st.end - st.start)
}

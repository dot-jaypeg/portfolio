import { useState } from 'react'
import { JOURNEY_CHAPTERS, TOTAL_CHAPTERS } from '../data/journeyChapters'
import { getChapterScrollOffset } from '../lib/journeyScroll'

const pad = (num: number) => String(num).padStart(2, '0')

export function ChaptersMenu() {
  const [open, setOpen] = useState(false)
  // Desktop-only, same matchMedia gating precedent as Cursor.tsx --
  // there's no pinned Journey track to jump within on mobile.
  const [isDesktop] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches,
  )

  if (!isDesktop) return null

  const handleJump = (index: number) => {
    const offset = getChapterScrollOffset(index)
    if (offset != null) window.__lenis?.scrollTo(offset)
    setOpen(false)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="font-body fixed bottom-8 left-8 z-40 text-xs tracking-[0.3em] text-cream/60 uppercase transition-colors hover:text-cream md:bottom-16 md:left-16"
      >
        (Chapters)
      </button>

      {open && (
        <div className="fixed inset-0 z-[70] flex flex-col overflow-y-auto bg-ink/95 px-6 py-24 md:px-16">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="font-body fixed top-6 right-6 text-xs tracking-[0.3em] text-cream/60 uppercase transition-colors hover:text-cream md:top-10 md:right-10"
          >
            (Close)
          </button>

          <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3">
            {JOURNEY_CHAPTERS.map((chapter, i) => (
              <button
                key={chapter.key}
                type="button"
                onClick={() => handleJump(i)}
                className="group flex flex-col gap-4 text-left"
              >
                <span className="font-body flex aspect-[4/5] items-center justify-center border border-dashed border-cream/20 text-xs tracking-[0.3em] text-cream/30 uppercase transition-colors group-hover:border-cream/50">
                  {pad(i + 1)}/{pad(TOTAL_CHAPTERS)}
                </span>
                <span className="font-display text-lg font-bold tracking-tight text-cream uppercase transition-colors group-hover:text-teal">
                  {chapter.eyebrow}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

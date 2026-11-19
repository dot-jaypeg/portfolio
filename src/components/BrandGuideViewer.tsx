import { useState } from 'react'

// Pages are pre-rendered PDF pages sitting in /public (see
// public/brand-guides/<slug>/) and referenced by plain URL path, not
// imported -- a 20-30 page brand guide would otherwise mean one
// import statement per page. `pdfHref` offers the original file
// itself as a direct download, same convention as the resume link.
export function BrandGuideViewer({
  title,
  pageCount,
  basePath,
  pdfHref,
}: {
  title: string
  pageCount: number
  basePath: string
  pdfHref: string
}) {
  const [index, setIndex] = useState(0)
  const page = String(index + 1).padStart(2, '0')

  return (
    <div className="mx-auto mt-6 w-full max-w-5xl px-6 md:px-10">
      <div className="relative overflow-hidden bg-cream/5" style={{ aspectRatio: '1224 / 792' }}>
        <img
          src={`${basePath}/page-${page}.jpg`}
          alt={`${title} brand guide, page ${index + 1} of ${pageCount}`}
          className="h-full w-full object-contain"
          loading="lazy"
        />
      </div>
      <div className="mt-5 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0}
          className="font-geist text-xs font-medium tracking-[0.1em] text-cream/70 uppercase transition-colors hover:text-cream disabled:opacity-25 disabled:hover:text-cream/70"
        >
          ← Prev
        </button>
        <span className="font-body text-xs tracking-[0.2em] text-cream/40">
          {index + 1} / {pageCount}
        </span>
        <a
          href={pdfHref}
          target="_blank"
          rel="noreferrer"
          className="font-geist text-xs font-medium tracking-[0.1em] text-cream/50 uppercase transition-colors hover:text-cream"
        >
          Download PDF
        </a>
        <button
          type="button"
          onClick={() => setIndex((i) => Math.min(pageCount - 1, i + 1))}
          disabled={index === pageCount - 1}
          className="font-geist text-xs font-medium tracking-[0.1em] text-cream/70 uppercase transition-colors hover:text-cream disabled:opacity-25 disabled:hover:text-cream/70"
        >
          Next →
        </button>
      </div>
    </div>
  )
}

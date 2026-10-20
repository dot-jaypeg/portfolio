import { useState } from 'react'

// No client/collaborator logo files exist anywhere in this repo yet
// (confirmed: no SVGs at all, in src/, public/, or the raw asset
// folders under PORTFOLIO/) -- this ships as one clearly-marked TODO
// slot instead of faking a logo for any client. To populate it for
// real: drop SVGs under src/assets/logos/ and replace this array with
// real { name, src } entries -- the arrow controls and layout below
// already work for any length.
const LOGO_SLOTS: { name: string }[] = [{ name: 'Add a client logo' }]

export function LogoCarousel() {
  const [index, setIndex] = useState(0)
  const slot = LOGO_SLOTS[index]

  const go = (delta: number) => {
    setIndex((i) => (i + delta + LOGO_SLOTS.length) % LOGO_SLOTS.length)
  }

  return (
    <section aria-label="Selected clients" className="mt-32 border-t border-cream/10 pt-16 md:mt-40 md:pt-20">
      <p className="font-body mb-10 text-xs tracking-[0.22em] text-cream/40 uppercase">Selected Clients</p>
      <div className="flex items-center justify-center gap-8">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous logo"
          className="font-body text-cream/40 transition-colors hover:text-cream focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal"
        >
          ←
        </button>
        <div className="flex h-24 w-48 shrink-0 items-center justify-center border border-dashed border-cream/15">
          <span className="font-body px-4 text-center text-[10px] tracking-[0.22em] text-cream/25 uppercase">
            [ TODO: {slot.name} ]
          </span>
        </div>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next logo"
          className="font-body text-cream/40 transition-colors hover:text-cream focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal"
        >
          →
        </button>
      </div>
    </section>
  )
}

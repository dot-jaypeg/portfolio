import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'

export function Preloader({ onComplete }: { onComplete: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const wordWrapRef = useRef<HTMLDivElement>(null)
  const wordmarkRef = useRef<HTMLParagraphElement>(null)
  const blurLayerRef = useRef<HTMLParagraphElement>(null)
  const cursorRef = useRef<HTMLSpanElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    let cancelled = false
    let ctx: gsap.Context | undefined

    // `font-display: swap` (index.css) paints the fallback font
    // immediately and swaps to the real one once it loads -- if that
    // swap lands after we've measured the word's width below, the
    // sweep's target would be off by however much the real font
    // reflowed the text. Waiting for fonts.ready first means the
    // width we measure is the one that's actually final.
    document.fonts.ready.then(() => {
      if (cancelled) return

      ctx = gsap.context(() => {
        const sharpEl = wordmarkRef.current!
        const blurEl = blurLayerRef.current!

        // The italic face's final "g" visually overhangs its own logical
        // advance width -- revealing exactly up to scrollWidth clips its
        // tail, so the sweep's target is padded by a sliver of the font
        // size (scales with the glyph, not the word's length).
        const fontSizePx = parseFloat(getComputedStyle(sharpEl).fontSize)
        const totalWidth = sharpEl.scrollWidth + fontSizePx * 0.08
        const bandWidth = fontSizePx * 0.5
        const blurPx = fontSizePx * 0.07
        blurEl.style.filter = `blur(${blurPx}px)`

        // The cursor bar IS the reveal mechanism, not a decoration that
        // happens to track it: a hard-edged mask on the sharp text
        // reveals everything up to the cursor's position, while a
        // SECOND, blurred copy of the same word is masked to a narrow
        // band straddling that same position -- so a soft, moving smear
        // trails exactly where the cursor is, and only there. Masks
        // (not per-character opacity) are what makes this one
        // continuous wipe rather than a sequence of discrete letters.
        const applySweep = (edge: number) => {
          const clampedEdge = Math.min(edge, totalWidth)
          sharpEl.style.setProperty(
            'mask-image',
            `linear-gradient(to right, #000 0, #000 ${clampedEdge}px, transparent ${clampedEdge}px)`,
          )
          sharpEl.style.setProperty(
            '-webkit-mask-image',
            `linear-gradient(to right, #000 0, #000 ${clampedEdge}px, transparent ${clampedEdge}px)`,
          )

          // Deliberately NOT clamped to the word's own bounds -- letting
          // the fade-in/fade-out stops fall off-canvas (negative, or past
          // totalWidth) is what gives the band a full, symmetric fade at
          // both the very start and very end instead of popping in solid
          // or leaving a blurred smudge stuck at the final position.
          const bandStart = edge - bandWidth
          const bandEnd = edge + bandWidth
          blurEl.style.setProperty(
            'mask-image',
            `linear-gradient(to right, transparent ${bandStart}px, #000 ${edge}px, transparent ${bandEnd}px)`,
          )
          blurEl.style.setProperty(
            '-webkit-mask-image',
            `linear-gradient(to right, transparent ${bandStart}px, #000 ${edge}px, transparent ${bandEnd}px)`,
          )

          gsap.set(cursorRef.current, { x: clampedEdge })
        }
        applySweep(0)

        const counter = { value: 0 }

        // The cursor glows solid WHILE it's doing the work of sweeping
        // -- it only starts blinking (idling, like a real terminal
        // caret waiting for input) once the reveal has actually
        // finished, via the `.fromTo` below instead of looping the
        // whole time.
        const blink = gsap.to(cursorRef.current, {
          opacity: 0,
          duration: 0.5,
          repeat: -1,
          yoyo: true,
          ease: 'steps(1)',
          paused: true,
        })

        const tl = gsap.timeline({
          onComplete: () => onComplete(),
        })

        const sweep = { edge: 0 }
        const typingEnd = 1.1

        tl.set(rootRef.current, { autoAlpha: 1 })
          .to(sweep, {
            // Overshoots past the word's own width so the blur band (which
            // straddles `edge` on both sides) fully clears the last
            // character by the end, instead of leaving a blur smudge
            // sitting at the final position -- the sharp mask and cursor
            // both clamp to `totalWidth` regardless, inside applySweep.
            edge: totalWidth + bandWidth,
            duration: typingEnd,
            ease: 'power2.inOut',
            onUpdate: () => applySweep(sweep.edge),
          })
          .call(() => blink.play())

        tl.fromTo(
          lineRef.current,
          { scaleX: 0 },
          { scaleX: 1, duration: 1.1, ease: 'power2.inOut' },
          0,
        )
          .to(
            counter,
            {
              value: 100,
              duration: 1.1,
              ease: 'power2.inOut',
              onUpdate: () => {
                if (counterRef.current) {
                  counterRef.current.textContent = String(
                    Math.round(counter.value),
                  ).padStart(3, '0')
                }
              },
            },
            0,
          )
          .to({}, { duration: 0.3 }, typingEnd + 0.35)
          .call(() => blink.kill())
          .to(wordWrapRef.current, {
            opacity: 0,
            y: -40,
            duration: 0.4,
            ease: 'power2.in',
          })
          .to(lineRef.current, { opacity: 0, duration: 0.3 }, '<')
          .to(
            panelRef.current,
            { yPercent: -100, duration: 0.9, ease: 'expo.inOut' },
            '-=0.1',
          )
          .set(rootRef.current, { autoAlpha: 0 })

        return () => blink.kill()
      })
    })

    return () => {
      cancelled = true
      ctx?.revert()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      ref={rootRef}
      className="invisible fixed inset-0 z-[100]"
      aria-hidden="true"
    >
      <div
        ref={panelRef}
        className="absolute inset-0 flex h-full w-full flex-col items-center justify-center overflow-hidden bg-ink px-8 py-8 md:px-14 md:py-12"
      >
        <div ref={wordWrapRef} className="relative inline-block">
          <p
            ref={wordmarkRef}
            className="font-display text-[22vw] leading-none font-bold tracking-[-0.06em] text-cream italic md:text-[18vw]"
          >
            .jaypeg
          </p>
          {/* A second, blurred copy of the exact same word, absolutely
              positioned on top of the first -- masked to a narrow band
              that straddles the cursor, this is what gives the sweep a
              soft, moving motion-blur smear rather than a hard wipe. */}
          <p
            ref={blurLayerRef}
            aria-hidden="true"
            className="font-display pointer-events-none absolute inset-0 text-[22vw] leading-none font-bold tracking-[-0.06em] text-cream italic md:text-[18vw]"
          >
            .jaypeg
          </p>
          <span
            ref={cursorRef}
            aria-hidden="true"
            className="absolute top-1/2 left-0 h-[0.85em] w-[0.08em] -translate-y-1/2 bg-cream shadow-[0_0_18px_4px_rgba(255,255,240,0.55)]"
          />
        </div>

        {/* Full-width bar anchored to the very bottom of the screen
            (matching the 5blox reference) instead of a short centered
            rule under the wordmark -- reuses the exact base-line +
            origin-left scaleX fill pattern already used for every other
            scroll-progress bar on the site (CinematicIntro, Journey). */}
        <div className="absolute inset-x-8 bottom-8 h-px bg-cream/15 md:inset-x-14 md:bottom-12">
          <div
            ref={lineRef}
            className="h-full w-full origin-left scale-x-0 bg-cream"
          />
        </div>
        <p className="font-body absolute right-8 bottom-11 text-[10px] tracking-[0.22em] text-cream/50 uppercase md:right-14 md:bottom-16">
          [ Loading — <span ref={counterRef}>000</span> ]
        </p>
      </div>
    </div>
  )
}

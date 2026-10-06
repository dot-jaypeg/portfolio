import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'

export function Preloader({ onComplete }: { onComplete: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const maskRef = useRef<HTMLDivElement>(null)
  const wordmarkRef = useRef<HTMLParagraphElement>(null)
  const cursorRef = useRef<HTMLSpanElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    let cancelled = false
    let ctx: gsap.Context | undefined

    // `font-display: swap` (index.css) paints the fallback font
    // immediately and swaps to the real one once it loads -- if that
    // swap lands mid-animation, the text reflows to the real font's
    // (different) width while the mask's target width stays whatever
    // was measured off the FALLBACK font, clipping the now-wider text.
    // Waiting for fonts.ready before measuring/animating means the
    // metrics we measure are the ones that are actually final.
    document.fonts.ready.then(() => {
      if (cancelled) return

      ctx = gsap.context(() => {
        const maskEl = maskRef.current!
        // Read the text's natural width BEFORE clipping it -- white-space:
        // nowrap keeps this constant regardless of the mask's own width, so
        // this is safe to use as the animation's end value. The italic
        // face's final "g" visually overhangs its own logical advance
        // width (true of any oblique/italic cut), so scrollWidth alone
        // clips its tail -- padding the target by a sliver of the font
        // size (not of the word's width) gives that overhang room
        // regardless of viewport size, since the overhang itself scales
        // with font size, not word length.
        const fontSizePx = parseFloat(getComputedStyle(wordmarkRef.current!).fontSize)
        const fullWidth = maskEl.scrollWidth + fontSizePx * 0.08
        gsap.set(maskEl, { width: 0 })
        gsap.set(wordmarkRef.current, { filter: 'blur(18px)' })
        const counter = { value: 0 }

        // A blinking caret, ticking on its own independent loop rather than
        // the main timeline -- a typing cursor reads as "alive" exactly
        // because its blink keeps a steady rhythm of its own, same as a
        // real terminal. It's `right: 0` INSIDE the width-animated mask, so
        // it's pinned to the mask's own right edge and tracks the reveal
        // for free as that width grows -- no per-character JS needed.
        const blink = gsap.to(cursorRef.current, {
          opacity: 0,
          duration: 0.5,
          repeat: -1,
          yoyo: true,
          ease: 'steps(1)',
        })

        const tl = gsap.timeline({
          onComplete: () => onComplete(),
        })

        tl.set(rootRef.current, { autoAlpha: 1 })
          .to(maskEl, {
            // A continuous eased wipe, not a stepped reveal -- 'steps()'
            // read as mechanical keystroke clicks, which is the "clicky"
            // feel this replaces. power3 decelerating into place pairs
            // with the blur tween below: fast + blurred at the start,
            // slowing and sharpening together like a fast camera pan
            // settling into focus.
            width: fullWidth,
            duration: 0.85,
            ease: 'power3.out',
          })
          .to(
            wordmarkRef.current,
            {
              filter: 'blur(0px)',
              duration: 0.85,
              ease: 'power3.out',
            },
            '<',
          )
          .fromTo(
            lineRef.current,
            { scaleX: 0 },
            { scaleX: 1, duration: 1.1, ease: 'power2.inOut' },
            '<',
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
            '<',
          )
          .to({}, { duration: 0.35 })
          .call(() => blink.kill())
          .to(maskEl, {
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
        {/* The clipping mask: its width animates 0 -> full, revealing the
            (otherwise already fully-rendered, never-reflowing) text
            underneath one character-width "step" at a time.
            Font-size/line-height live HERE, not on the <p> -- the <p>
            just inherits them -- so this box's own "em" establishes a
            sizing context independent of exactly how tall the text's
            own tight (leading-none) line box computes in any given
            browser. The box is deliberately taller (1.6em) than one
            text line: different engines (and italic/oblique faces in
            particular) can render a glyph's visual ink slightly outside
            its nominal line box, and overflow-hidden has no way to tell
            "real descender" from "nothing there" -- so this is a fixed
            safety margin, not a measurement of any one browser's actual
            glyph metrics. */}
        <div
          ref={maskRef}
          className="relative inline-flex h-[1.6em] items-center overflow-hidden text-[22vw] leading-none whitespace-nowrap md:text-[18vw]"
        >
          <p
            ref={wordmarkRef}
            className="font-display font-bold tracking-[-0.06em] text-cream italic"
          >
            .jaypeg
          </p>
          <span
            ref={cursorRef}
            aria-hidden="true"
            className="absolute top-1/2 right-0 h-[0.85em] w-[0.045em] -translate-y-1/2 bg-cream"
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

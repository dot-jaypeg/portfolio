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
        // advance width (its upper stroke swings further right than the
        // glyph's own advance box). Neither scrollWidth nor a Range's
        // getBoundingClientRect() reports that overhang -- both reflect
        // the text's LAYOUT metrics (glyph advance widths), and this
        // overhang is a purely visual rasterization effect that doesn't
        // show up in either one. No fudge-factor multiplier on top of
        // either measurement (0.08, 0.2, a Range-based remeasure -- all
        // tried, all still clipped it in some environment) can be
        // trusted, because there's no reliable signal for how far THIS
        // browser/OS actually rasterizes the glyph past its own box.
        //
        // So: stop trying to compute where the cutoff can safely sit
        // near the glyph's edge at all. Past `safeRevealThreshold`,
        // applySweep removes the mask from the sharp layer entirely --
        // the glyph then renders with its full natural, un-clipped
        // shape, which can't be wrong regardless of overhang, since
        // there's no cutoff boundary anywhere near it to get wrong.
        const fontSizePx = parseFloat(getComputedStyle(sharpEl).fontSize)
        const scrollW = sharpEl.scrollWidth
        const safeRevealThreshold = scrollW + fontSizePx * 0.15
        // Where the cursor visually settles once typing finishes --
        // tight to the real text, since a few px of looseness here is
        // far less noticeable than a clipped glyph would be, so it
        // doesn't need the same safety margin as the mask does.
        const cursorRestX = scrollW + fontSizePx * 0.02
        const bandWidth = fontSizePx * 0.5
        const blurPx = fontSizePx * 0.07
        blurEl.style.filter = `blur(${blurPx}px)`

        // Applying a mask to an element clips that element's own ink
        // overflow to its tight layout box -- including a blur filter's
        // spread, which otherwise paints past the box freely. Without
        // this, the masked+blurred layer's glow gets chopped off in a
        // hard rectangle right at the text's own edge. Expanding the
        // box (negative inset on all sides) gives the blur real room;
        // the gradient math below adds `pad` back everywhere to account
        // for the box's origin having shifted left/up by that amount.
        //
        // `pad` must be at least `bandWidth`, not just the blur radius:
        // the band's own fade-in zone trails `bandWidth` behind `edge`,
        // and near the very start of the sweep (edge close to 0) that
        // fade zone's left stop falls at a negative local position --
        // if the box's own edge doesn't reach that far, the STILL-
        // FORMING gradient gets clipped by the box boundary itself,
        // showing a hard flat cutoff on a blur patch before any real
        // typing has even happened yet. Caught by watching the very
        // first frames of the sweep, not just the settled end state.
        const pad = bandWidth + blurPx * 2
        blurEl.style.inset = `${-pad}px`
        // `inset: -pad` only moves the BOX -- the text CONTENT inside
        // still starts flowing from that box's own top-left corner,
        // which is now `pad` px up-and-left of where the sharp layer's
        // text starts. Without this, the blurred word renders visibly
        // offset from the sharp one (a disconnected smear floating up
        // and to the left of the actual glyphs, not aligned with them
        // at all) rather than directly on top of it. Padding pushes the
        // content back in by the same amount the box grew by, which
        // cancels the shift exactly while leaving the box itself just
        // as oversized (mask-image's pixel coordinates are relative to
        // the border box, which padding doesn't move, so none of the
        // gradient math above needs to change for this).
        blurEl.style.padding = `${pad}px`

        // The cursor bar IS the reveal mechanism, not a decoration that
        // happens to track it: a hard-edged mask on the sharp text
        // reveals everything up to the cursor's position, while a
        // SECOND, blurred copy of the same word is masked to a narrow
        // band straddling that same position -- so a soft, moving smear
        // trails exactly where the cursor is, and only there. Masks
        // (not per-character opacity) are what makes this one
        // continuous wipe rather than a sequence of discrete letters.
        const applySweep = (edge: number) => {
          if (edge >= safeRevealThreshold) {
            sharpEl.style.setProperty('mask-image', 'none')
            sharpEl.style.setProperty('-webkit-mask-image', 'none')
          } else {
            sharpEl.style.setProperty(
              'mask-image',
              `linear-gradient(to right, #000 0, #000 ${edge}px, transparent ${edge}px)`,
            )
            sharpEl.style.setProperty(
              '-webkit-mask-image',
              `linear-gradient(to right, #000 0, #000 ${edge}px, transparent ${edge}px)`,
            )
          }

          // Deliberately NOT clamped to the word's own bounds -- letting
          // the fade-in/fade-out stops fall off-canvas (negative, or past
          // the word's width) is what gives the band a full, symmetric
          // fade at both the very start and very end instead of popping
          // in solid or leaving a blurred smudge stuck at the final
          // position.
          // Everything shifted by `+pad` since blurEl's own box (and so
          // its mask's coordinate origin) now starts `pad`px to the left
          // of the text's actual left edge.
          const bandStart = edge - bandWidth + pad
          const center = edge + pad
          const bandEnd = edge + bandWidth + pad
          blurEl.style.setProperty(
            'mask-image',
            `linear-gradient(to right, transparent ${bandStart}px, #000 ${center}px, transparent ${bandEnd}px)`,
          )
          blurEl.style.setProperty(
            '-webkit-mask-image',
            `linear-gradient(to right, transparent ${bandStart}px, #000 ${center}px, transparent ${bandEnd}px)`,
          )

          gsap.set(cursorRef.current, { x: Math.min(edge, cursorRestX) })
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
            // Overshoots past safeRevealThreshold so the blur band (which
            // straddles `edge` on both sides) fully clears the last
            // character by the end, instead of leaving a blur smudge
            // sitting at the final position. The mask itself is long
            // since removed entirely by this point (applySweep drops it
            // past safeRevealThreshold), and the cursor's own position
            // clamps to the tighter cursorRestX regardless.
            edge: safeRevealThreshold + bandWidth,
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
            className="font-display pointer-events-none absolute text-[22vw] leading-none font-bold tracking-[-0.06em] text-cream italic md:text-[18vw]"
          >
            .jaypeg
          </p>
          {/* `text-[22vw] md:text-[18vw]` repeated here, not just on the
              <p> elements -- the cursor's own height/width are in `em`,
              which resolves against ITS OWN font-size. Without this it
              inherits the page's ordinary body font-size instead of the
              wordmark's, rendering as a tiny sliver next to giant text. */}
          <span
            ref={cursorRef}
            aria-hidden="true"
            className="absolute top-1/2 left-0 h-[0.85em] w-[0.08em] -translate-y-1/2 bg-cream text-[22vw] shadow-[0_0_18px_4px_rgba(255,255,240,0.55)] md:text-[18vw]"
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

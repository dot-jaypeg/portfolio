import { useEffect, useRef } from 'react'
import { gsap, SplitText } from '../lib/gsap'

export function Preloader({ onComplete }: { onComplete: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const wordWrapRef = useRef<HTMLDivElement>(null)
  const wordmarkRef = useRef<HTMLParagraphElement>(null)
  const cursorRef = useRef<HTMLSpanElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    let cancelled = false
    let ctx: gsap.Context | undefined
    let split: SplitText | undefined

    // `font-display: swap` (index.css) paints the fallback font
    // immediately and swaps to the real one once it loads -- if that
    // swap lands after we've measured each char's position below, the
    // cursor's stops would be off by however much the real font
    // reflowed the text. Waiting for fonts.ready first means the
    // positions we measure are the ones that are actually final.
    document.fonts.ready.then(() => {
      if (cancelled) return

      ctx = gsap.context(() => {
        split = new SplitText(wordmarkRef.current, { type: 'chars' })
        const chars = split.chars as HTMLElement[]
        gsap.set(chars, { opacity: 0 })

        // Each char's own span, measured BEFORE animating anything --
        // opacity/filter don't affect layout, so these positions are
        // final and stable for the whole sequence.
        const wrapRect = wordWrapRef.current!.getBoundingClientRect()
        const charSpans = chars.map((char) => {
          const r = char.getBoundingClientRect()
          return { left: r.left - wrapRect.left, right: r.right - wrapRect.left }
        })
        const totalWidth = charSpans[charSpans.length - 1].right

        // A single continuously-eased "reveal position" drives every
        // character's opacity/blur/stretch together, rather than each
        // char getting its own separate tween -- that's what makes this
        // read as ONE fluid sweep instead of a sequence of discrete
        // per-letter events. `bandWidth` is how wide the soft transition
        // zone trailing the sweep is: characters behind it are fully
        // sharp, characters ahead haven't appeared yet, and whichever
        // ones the sweep is currently passing through fade/sharpen/
        // un-stretch together, in lockstep with how far the sweep has
        // moved past them.
        //
        // A plain `blur()` alone reads as "out of focus" (an even haze
        // in every direction), not motion -- real motion blur is
        // DIRECTIONAL. Stretching each char horizontally (scaleX, from
        // its own left edge) while it's still blurred, and relaxing
        // that stretch back to 1 as it settles, is what actually sells
        // "moving fast left-to-right" rather than "soft focus".
        const fontSizePx = parseFloat(getComputedStyle(wordmarkRef.current!).fontSize)
        const bandWidth = fontSizePx * 0.6
        const maxBlur = fontSizePx * 0.09
        const maxStretch = 1.6

        chars.forEach((char) => {
          char.style.transformOrigin = 'left center'
        })

        const applySweep = (pos: number) => {
          charSpans.forEach(({ left, right }, i) => {
            const center = (left + right) / 2
            const frac = gsap.utils.clamp(
              0,
              1,
              (pos - (center - bandWidth / 2)) / bandWidth,
            )
            const settle = 1 - frac
            chars[i].style.opacity = String(frac)
            chars[i].style.filter = `blur(${settle * maxBlur}px)`
            chars[i].style.transform = `scaleX(${1 + settle * (maxStretch - 1)})`
          })
          // Via gsap.set, not a raw style write -- GSAP already owns this
          // element's transform for the blink tween's sibling property
          // (opacity), and keeping both on GSAP's own cache avoids either
          // one clobbering the other's idea of the current transform.
          gsap.set(cursorRef.current, { x: Math.min(pos, totalWidth), yPercent: -50 })
        }
        applySweep(0)

        const counter = { value: 0 }

        // A blinking caret, ticking on its own independent loop rather
        // than the main timeline -- it reads as "alive" exactly because
        // its blink keeps a steady rhythm of its own, same as a real
        // terminal, independent of the sweep moving it forward.
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

        const sweep = { pos: 0 }
        const typingEnd = 1.25

        tl.set(rootRef.current, { autoAlpha: 1 }).to(sweep, {
          // Overshoots past the word's own width so the LAST character's
          // band fully clears (its center sits bandWidth/2 before the
          // right edge) -- applySweep already clamps the cursor itself
          // to stop exactly at the word's end regardless.
          pos: totalWidth + bandWidth,
          duration: typingEnd,
          ease: 'power2.out',
          onUpdate: () => applySweep(sweep.pos),
        })

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
          .to({}, { duration: 0.35 }, typingEnd)
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
      split?.revert()
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
          <span
            ref={cursorRef}
            aria-hidden="true"
            className="absolute top-1/2 left-0 h-[0.78em] w-[0.045em] -translate-y-1/2 bg-cream"
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

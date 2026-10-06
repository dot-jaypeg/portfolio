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

        // Only the character CURRENTLY being "typed" should read as
        // motion-blurred -- everything already placed stays sharp. That
        // means each char needs its OWN independent blur, which rules out
        // a single clipping mask over the whole word (the previous
        // approach): this animates each char's own `filter` instead, so
        // blur is local to whichever letter is mid-reveal at any given
        // instant.
        gsap.set(chars, { opacity: 0, filter: 'blur(10px)' })

        // Each char's right edge, measured BEFORE animating anything --
        // opacity/filter don't affect layout, so these positions are
        // final and stable for the whole sequence. The cursor's `x`
        // snaps to the new value as each char starts revealing, which is
        // what makes it track the "typing" position without any mask to
        // pin it to.
        const wrapRect = wordWrapRef.current!.getBoundingClientRect()
        const charRightEdges = chars.map(
          (char) => char.getBoundingClientRect().right - wrapRect.left,
        )

        const counter = { value: 0 }

        // A blinking caret, ticking on its own independent loop rather
        // than the main timeline -- it reads as "alive" exactly because
        // its blink keeps a steady rhythm of its own, same as a real
        // terminal, while its `x` position still gets snapped forward by
        // the main timeline below.
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

        const charDuration = 0.1
        const charStagger = 0.11

        tl.set(rootRef.current, { autoAlpha: 1 })

        chars.forEach((char, i) => {
          const start = i * charStagger
          tl.to(
            char,
            {
              opacity: 1,
              filter: 'blur(0px)',
              duration: charDuration,
              ease: 'power2.out',
            },
            start,
          ).set(cursorRef.current, { x: charRightEdges[i] }, start)
        })

        const typingEnd = (chars.length - 1) * charStagger + charDuration

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

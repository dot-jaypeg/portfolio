import { useEffect, useRef } from 'react'
import { gsap, Draggable } from '../lib/gsap'
import { CASE_STUDIES } from '../data/caseStudies'
import { Reveal } from './Reveal'

// Pixels per second the marquee drifts left-to-right at rest.
const SPEED = 40

function Card({ cs }: { cs: (typeof CASE_STUDIES)[number] }) {
  return (
    <div
      data-cursor="Drag"
      className="flex w-[70vw] shrink-0 flex-col gap-4 md:w-[32vw]"
    >
      <div className="font-body flex aspect-[4/5] items-center justify-center border border-dashed border-cream/20 text-xs tracking-[0.3em] text-cream/30 uppercase select-none">
        [ placeholder image ]
      </div>
      <div className="flex items-baseline justify-between">
        <p className="font-display text-xl text-cream uppercase">{cs.title}</p>
        <p className="font-body text-xs tracking-widest text-teal uppercase">
          {cs.category}
        </p>
      </div>
    </div>
  )
}

export function WorkCarousel() {
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const track = trackRef.current!
    // The track renders CASE_STUDIES twice back to back, so its full
    // scrollWidth is exactly two of these "set" widths -- moving by one
    // set width and snapping back is visually seamless.
    const setWidth = track.scrollWidth / 2

    let marquee: gsap.core.Tween

    // Cards drift left-to-right, so x animates UP toward 0 and instantly
    // resets to -setWidth to repeat -- seamless because set two (the
    // clone) sits at exactly the screen position set one occupies at
    // x: 0, so the reset is visually identical to the frame before it.
    const startMarquee = (fromX: number) => {
      const remaining = 0 - fromX
      return gsap.to(track, {
        x: 0,
        duration: Math.max(remaining / SPEED, 0.1),
        ease: 'none',
        repeat: -1,
        onRepeat: () => gsap.set(track, { x: -setWidth }),
      })
    }

    gsap.set(track, { x: -setWidth })
    marquee = startMarquee(-setWidth)

    const [draggable] = Draggable.create(track, {
      type: 'x',
      inertia: true,
      cursor: 'grab',
      activeCursor: 'grabbing',
      onPress() {
        marquee.pause()
      },
      onThrowComplete() {
        const current = gsap.getProperty(track, 'x') as number
        const wrapped = gsap.utils.wrap(-setWidth, 0)(current)
        gsap.set(track, { x: wrapped })
        marquee.kill()
        marquee = startMarquee(wrapped)
      },
    })

    return () => {
      marquee.kill()
      draggable.kill()
    }
  }, [])

  return (
    <section id="work" className="py-24 md:py-32">
      <div className="mx-auto mb-10 max-w-[1600px] px-6 md:px-10">
        <Reveal>
          <p className="font-body text-xs tracking-[0.3em] text-teal uppercase">
            Selected Work
          </p>
        </Reveal>
      </div>
      <div className="overflow-hidden px-6 md:px-10">
        <div
          ref={trackRef}
          className="flex w-max cursor-grab gap-6 active:cursor-grabbing"
        >
          {CASE_STUDIES.map((cs) => (
            <Card key={cs.slug} cs={cs} />
          ))}
          {CASE_STUDIES.map((cs) => (
            <Card key={`${cs.slug}-clone`} cs={cs} />
          ))}
        </div>
      </div>
    </section>
  )
}

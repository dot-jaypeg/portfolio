import { useEffect, useRef } from 'react'
import { Draggable } from '../lib/gsap'
import { CASE_STUDIES } from '../data/caseStudies'
import { Reveal } from './Reveal'

export function WorkCarousel() {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current!
    const track = trackRef.current!

    const getBounds = () => {
      const maxDrag = Math.min(
        0,
        container.clientWidth - track.scrollWidth,
      )
      return { minX: maxDrag, maxX: 0 }
    }

    const [draggable] = Draggable.create(track, {
      type: 'x',
      inertia: true,
      bounds: getBounds(),
      edgeResistance: 0.85,
      cursor: 'grab',
      activeCursor: 'grabbing',
    })

    const handleResize = () => draggable.applyBounds(getBounds())
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
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
      <div ref={containerRef} className="overflow-hidden px-6 md:px-10">
        <div
          ref={trackRef}
          className="flex w-max cursor-grab gap-6 active:cursor-grabbing"
        >
          {CASE_STUDIES.map((cs) => (
            <div
              key={cs.slug}
              data-cursor="Drag"
              className="flex w-[70vw] shrink-0 flex-col gap-4 md:w-[32vw]"
            >
              <div className="font-body flex aspect-[4/5] items-center justify-center border border-dashed border-cream/20 text-xs tracking-[0.3em] text-cream/30 uppercase select-none">
                [ placeholder image ]
              </div>
              <div className="flex items-baseline justify-between">
                <p className="font-display text-xl text-cream uppercase">
                  {cs.title}
                </p>
                <p className="font-body text-xs tracking-widest text-teal uppercase">
                  {cs.category}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

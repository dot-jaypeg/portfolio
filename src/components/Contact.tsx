import { useEffect, useRef } from 'react'
import { gsap, SplitText } from '../lib/gsap'
import { Reveal } from './Reveal'

function TaglineReveal() {
  const ref = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const el = ref.current!
    const ctx = gsap.context(() => {
      const split = new SplitText(el, { type: 'words' })
      gsap.from(split.words, {
        opacity: 0,
        y: 28,
        stagger: 0.03,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      })
      return () => split.revert()
    })
    return () => ctx.revert()
  }, [])

  return (
    <h2
      ref={ref}
      className="font-display max-w-2xl text-4xl leading-snug font-bold tracking-tighter text-cream uppercase md:text-6xl"
    >
      Let's capture the narrative.
    </h2>
  )
}

export function Contact() {
  return (
    <footer
      id="contact"
      className="flex min-h-screen flex-col justify-between px-6 pt-28 pb-12 md:px-10 md:pt-36 md:pb-16"
    >
      <TaglineReveal />

      <Reveal className="self-end">
        <div className="flex flex-col items-end gap-3">
          <a
            href="mailto:design.jaypeg@gmail.com"
            data-cursor="Email"
            className="font-body text-sm tracking-[0.2em] text-cream uppercase transition-colors hover:text-teal"
          >
            design.jaypeg@gmail.com
          </a>
          <a
            href="https://instagram.com/design.jaypeg"
            target="_blank"
            rel="noreferrer"
            className="font-body text-sm tracking-[0.2em] text-cream uppercase transition-colors hover:text-teal"
          >
            @design.jaypeg
          </a>
          <p className="font-body text-sm tracking-[0.2em] text-cream/40 uppercase">
            Los Angeles // CA
          </p>
        </div>
      </Reveal>
    </footer>
  )
}

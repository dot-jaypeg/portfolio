import { BlockLink } from './BlockLink'
import { FadeIn } from './FadeIn'

export function Footer() {
  return (
    <footer
      id="contact"
      className="flex min-h-screen flex-col justify-between bg-secondary px-6 pt-28 pb-12 text-primary md:px-10 md:pt-36 md:pb-16"
    >
      <FadeIn>
        <h2 className="font-heading max-w-xl text-4xl font-normal tracking-tight leading-snug md:text-5xl">
          Let's capture the narrative.
        </h2>
      </FadeIn>

      <FadeIn className="self-end">
        <div className="flex flex-col items-end gap-3 font-heading text-sm font-bold lowercase">
          <BlockLink href="mailto:design.jaypeg@gmail.com" invert>
            design.jaypeg@gmail.com
          </BlockLink>
          <BlockLink
            href="https://instagram.com/design.jaypeg"
            target="_blank"
            rel="noreferrer"
            invert
          >
            @design.jaypeg
          </BlockLink>
          <p className="text-primary/60">los angeles // ca</p>
        </div>
      </FadeIn>
    </footer>
  )
}

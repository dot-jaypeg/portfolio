import { BlockLink } from './BlockLink'

export function Footer() {
  return (
    <footer id="contact" className="border-t border-tertiary/30 px-6 py-20 md:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <h2 className="font-heading max-w-xl text-4xl font-normal tracking-tight leading-snug md:text-5xl">
          Let's make something{' '}
          <span className="font-alt italic">worth remembering.</span>
        </h2>

        <div className="flex flex-col gap-3 font-heading text-sm font-bold lowercase">
          <BlockLink href="mailto:design.jaypeg@gmail.com">
            design.jaypeg@gmail.com
          </BlockLink>
          <BlockLink
            href="https://instagram.com/design.jaypeg"
            target="_blank"
            rel="noreferrer"
          >
            @design.jaypeg
          </BlockLink>
          <p className="text-tertiary">los angeles // ca</p>
        </div>
      </div>
    </footer>
  )
}

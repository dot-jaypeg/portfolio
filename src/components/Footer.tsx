export function Footer() {
  return (
    <footer
      id="contact"
      className="border-t border-line bg-ink px-6 py-20 text-cream md:px-10"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <h2 className="font-heading max-w-xl text-4xl font-normal tracking-tight leading-snug md:text-5xl">
          Let's make something{' '}
          <span className="font-alt italic">worth remembering.</span>
        </h2>

        <div className="flex flex-col gap-3 font-heading text-sm font-bold lowercase">
          <a
            href="mailto:design.jaypeg@gmail.com"
            className="transition-colors hover:text-accent"
          >
            design.jaypeg@gmail.com
          </a>
          <a
            href="https://instagram.com/design.jaypeg"
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-accent"
          >
            @design.jaypeg
          </a>
          <p className="text-cream/60">los angeles // ca</p>
        </div>
      </div>
    </footer>
  )
}

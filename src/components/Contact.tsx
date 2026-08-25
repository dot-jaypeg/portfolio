import { Reveal } from './Reveal'

export function Contact() {
  return (
    <footer
      id="contact"
      className="flex min-h-screen flex-col justify-between px-6 pt-28 pb-12 md:px-10 md:pt-36 md:pb-16"
    >
      <Reveal>
        <h2 className="font-display max-w-2xl text-4xl leading-snug font-bold text-cream uppercase md:text-6xl">
          Let's capture the narrative.
        </h2>
      </Reveal>

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

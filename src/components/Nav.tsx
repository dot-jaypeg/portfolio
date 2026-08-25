import type { MouseEvent } from 'react'

const LINKS = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

export function Nav() {
  const handleClick =
    (href: string) => (e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault()
      // #top is GSAP-pinned for its scroll-jacked scene sequence, so once
      // you've scrolled past it, its own element settles at the frozen
      // end-of-pin position in the doc flow (the last scene), not y=0 --
      // scrolling "to the element" would land on that last frame instead
      // of back at "Hello.". Going straight to the top of the document
      // sidesteps that entirely.
      if (href === '#top') {
        window.__lenis?.scrollTo(0)
        return
      }
      const target = document.querySelector(href)
      if (!target) return
      window.__lenis?.scrollTo(target as HTMLElement)
    }

  return (
    <header className="fixed top-0 z-50 flex w-full items-center justify-between px-6 py-6 md:px-10">
      <a
        href="#top"
        onClick={handleClick('#top')}
        data-cursor="Home"
        className="font-display text-2xl font-bold tracking-tighter text-cream italic md:text-3xl"
      >
        .jaypeg
      </a>
      <nav>
        <ul className="flex items-center gap-6 md:gap-8">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={handleClick(link.href)}
                className="font-body text-xs tracking-[0.2em] text-cream/70 uppercase transition-colors hover:text-teal"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}

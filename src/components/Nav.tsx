import type { MouseEvent } from 'react'

const LINKS = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

export function Nav() {
  const handleClick =
    (href: string) => (e: MouseEvent<HTMLAnchorElement>) => {
      const target = document.querySelector(href)
      if (!target) return
      e.preventDefault()
      window.__lenis?.scrollTo(target as HTMLElement)
    }

  return (
    <header className="fixed top-0 z-50 flex w-full items-center justify-between px-6 py-6 md:px-10">
      <a
        href="#top"
        data-cursor="Home"
        className="font-display text-lg font-bold tracking-tighter text-cream italic"
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

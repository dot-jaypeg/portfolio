import { BlockLink } from './BlockLink'

const LINKS = [
  { label: 'work', href: '#work' },
  { label: 'about', href: '#about' },
  { label: 'contact', href: '#contact' },
]

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-tertiary/30 bg-primary/85 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 md:px-10">
        <a
          href="#top"
          className="font-wordmark text-xl font-medium tracking-tighter text-secondary italic transition-colors hover:text-accent"
        >
          .jaypeg
        </a>
        <ul className="flex items-center gap-2 md:gap-4">
          {LINKS.map((link) => (
            <li key={link.href}>
              <BlockLink
                href={link.href}
                className="font-heading text-sm font-bold lowercase text-tertiary"
              >
                {link.label}
              </BlockLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}

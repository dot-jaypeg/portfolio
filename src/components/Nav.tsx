const LINKS = [
  { label: 'work', href: '#work' },
  { label: 'about', href: '#about' },
  { label: 'contact', href: '#contact' },
]

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-cream/85 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 md:px-10">
        <a
          href="#top"
          className="font-heading text-xl font-bold lowercase tracking-tight text-ink"
        >
          .jaypeg
        </a>
        <ul className="flex items-center gap-6 md:gap-8">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="font-heading text-sm font-bold lowercase tracking-wide text-ink-soft transition-colors hover:text-accent"
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

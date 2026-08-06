import { useEffect, useRef, useState } from 'react'
import { BlockLink } from './BlockLink'

const LINKS = [
  { label: 'work', href: '#work' },
  { label: 'about', href: '#about' },
  { label: 'contact', href: '#contact' },
]

export function Nav() {
  const [inverted, setInverted] = useState(false)
  const headerRef = useRef<HTMLHeadElement>(null)

  useEffect(() => {
    const footer = document.getElementById('contact')
    if (!footer) return

    const handleScroll = () => {
      const navHeight = headerRef.current?.getBoundingClientRect().height ?? 0
      const footerTop = footer.getBoundingClientRect().top
      setInverted(footerTop <= navHeight)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  return (
    <header
      ref={headerRef}
      className={`sticky top-0 z-50 backdrop-blur-sm transition-colors duration-300 ${
        inverted ? 'bg-secondary/85 text-primary' : 'bg-primary/85 text-secondary'
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 md:px-10">
        <a
          href="#top"
          className="font-wordmark text-xl font-medium tracking-tighter italic transition-colors hover:text-accent"
        >
          .jaypeg
        </a>
        <ul className="flex items-center gap-2 md:gap-4">
          {LINKS.map((link) => (
            <li key={link.href}>
              <BlockLink
                href={link.href}
                invert={inverted}
                className="font-heading text-sm font-bold lowercase opacity-80"
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

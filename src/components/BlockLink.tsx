import type { ReactNode } from 'react'

interface BlockLinkProps {
  href: string
  children: ReactNode
  className?: string
  target?: string
  rel?: string
}

export function BlockLink({
  href,
  children,
  className = '',
  target,
  rel,
}: BlockLinkProps) {
  return (
    <a
      href={href}
      target={target}
      rel={rel}
      className={`group relative -mx-1.5 inline-block overflow-hidden px-1.5 py-0.5 ${className}`}
    >
      <span className="absolute inset-0 origin-left scale-x-0 bg-secondary transition-transform duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-x-100" />
      <span className="relative z-10 transition-colors duration-300 group-hover:text-primary">
        {children}
      </span>
    </a>
  )
}

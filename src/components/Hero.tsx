import { motion, type Variants } from 'framer-motion'

const HEADLINE_PARTS: { text: string; className?: string }[] = [
  { text: 'Multidisciplinary Designer' },
  { text: '|', className: 'text-tertiary' },
  { text: 'Branding, User Interface, Visual Storytelling, &' },
  {
    text: 'Friendly Neighborhood Spider-Man Fanatic.',
    className: 'font-bold text-accent',
  },
]

const headlineWords = HEADLINE_PARTS.flatMap((part) =>
  part.text.split(' ').map((text) => ({ text, className: part.className })),
)

const blockContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
}

const nameReveal: Variants = {
  hidden: { opacity: 0, y: 48 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
}

const wordContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.045 } },
}

const word: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: 'easeOut' },
  },
}

export function Hero() {
  return (
    <motion.section
      id="top"
      className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-6 pt-24 pb-24 md:px-10 md:pt-32 md:pb-32"
      variants={blockContainer}
      initial="hidden"
      animate="visible"
    >
      <div className="overflow-hidden">
        <motion.h1
          variants={nameReveal}
          className="font-heading text-center text-6xl font-bold uppercase tracking-tighter text-secondary sm:text-7xl md:text-8xl"
        >
          Jayden Ramirez
        </motion.h1>
      </div>

      <motion.p
        variants={wordContainer}
        className="font-heading text-center text-sm leading-snug font-normal tracking-tight text-secondary md:text-base"
      >
        {headlineWords.map((w, i) => (
          <span key={i}>
            <motion.span
              variants={word}
              className={`inline-block ${w.className ?? ''}`}
            >
              {w.text}
            </motion.span>{' '}
          </span>
        ))}
      </motion.p>
    </motion.section>
  )
}

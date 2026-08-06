import { motion, type Variants } from 'framer-motion'

const EXPERTISE = [
  'branding',
  'digital marketing',
  'visual storytelling',
  'photography & video',
  '3d & motion',
  'visual design',
  'ui design',
  'user research',
  'vfx',
]

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

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
}

const blockContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
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
      className="mx-auto flex max-w-6xl flex-col gap-8 px-6 pt-20 pb-24 md:px-10 md:pt-28 md:pb-32"
      variants={blockContainer}
      initial="hidden"
      animate="visible"
    >
      <motion.p
        variants={fadeUp}
        className="font-heading text-lg font-bold text-tertiary md:text-xl"
      >
        jayden ramirez, founder of .jaypeg studios
      </motion.p>

      <motion.h1
        variants={wordContainer}
        className="font-heading text-4xl leading-[1.15] font-normal tracking-tight text-secondary md:text-6xl"
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
      </motion.h1>

      <motion.ul variants={fadeUp} className="flex flex-wrap gap-1.5 pt-2">
        {EXPERTISE.map((item) => (
          <li
            key={item}
            className="rounded-full bg-accent px-2.5 py-1 font-heading text-xs font-bold lowercase text-secondary"
          >
            {item}
          </li>
        ))}
      </motion.ul>
    </motion.section>
  )
}

const EXPERTISE = [
  'branding',
  'digital marketing',
  'visual storytelling',
  'photography & video',
  '3d & motion',
]

export function Hero() {
  return (
    <section
      id="top"
      className="mx-auto flex max-w-6xl flex-col gap-8 px-6 pt-20 pb-24 md:px-10 md:pt-28 md:pb-32"
    >
      <p className="font-alt text-lg italic text-ink-soft md:text-xl">
        jayden ramirez, founder of .jaypeg studios
      </p>

      <h1 className="font-heading text-4xl leading-[1.15] font-normal tracking-tight text-ink md:text-6xl">
        Multidisciplinary Designer{' '}
        <span className="text-ink-soft">|</span> Branding, Visual
        Storytelling, &amp;{' '}
        <span className="font-alt italic">
          Friendly Neighborhood Spider-Man Fanatic.
        </span>
      </h1>

      <p className="max-w-2xl text-lg leading-relaxed text-ink-soft">
        Backed by a foundation from Chapman and eight years navigating
        everything from corporate branding to my own freelance studio, I
        design with a focus on unconventional storytelling. My creative eye
        is constantly shaped by photography and the aesthetics of games like{' '}
        <span className="font-alt italic">Final Fantasy VII Remake</span>,
        driving my pursuit of purposeful and original digital experiences.
      </p>

      <ul className="flex flex-wrap gap-3 pt-2">
        {EXPERTISE.map((item) => (
          <li
            key={item}
            className="rounded-full border border-line bg-cream-soft px-4 py-1.5 font-heading text-sm font-bold lowercase tracking-wide text-ink"
          >
            {item}
          </li>
        ))}
      </ul>
    </section>
  )
}

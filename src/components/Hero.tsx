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
        multidisciplinary designer, running .jaypeg studios
      </p>

      <h1 className="font-heading text-4xl leading-[1.15] font-normal tracking-tight text-ink md:text-6xl">
        Jayden Ramirez{' '}
        <span className="text-ink-soft">|</span> Multidisciplinary Designer{' '}
        <span className="text-ink-soft">|</span> Branding, Visual
        Storytelling, &amp;{' '}
        <span className="font-alt italic">
          Friendly Neighborhood Spider-Man Fanatic.
        </span>
      </h1>

      <p className="max-w-2xl text-lg leading-relaxed text-ink-soft">
        Eight years of design knowledge, from marketing operations to
        corporate brand design, sharpened running my own freelance studio and
        built on the foundation Chapman gave me. My creative eye is shaped by
        video games — I'm always studying how favorites like{' '}
        <span className="font-alt italic">Final Fantasy VII Remake</span> and{' '}
        <span className="font-alt italic">Spider-Man</span> use visual
        communication to spark emotion.
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

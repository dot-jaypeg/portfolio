import mePhoto from '../assets/images/about/me.gif'

export function About() {
  return (
    <section
      id="about"
      className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 pb-24 md:grid-cols-[1fr_1.3fr] md:gap-16 md:px-10"
    >
      <div className="overflow-hidden rounded-xl border border-tertiary/20">
        <img
          src={mePhoto}
          alt="Jayden Ramirez"
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex flex-col justify-center gap-5">
        <h2 className="font-heading text-sm font-normal text-tertiary">
          A Little About Me…
        </h2>
        <p className="text-lg leading-relaxed text-secondary">
          I'm an experienced multidisciplinary designer who loves working
          right at the intersection of branding, digital marketing, and
          visual storytelling. Running my own freelance business,{' '}
          <span className="font-heading font-bold lowercase">
            .jaypeg studios
          </span>
          , and building my foundation at Chapman taught me how to approach
          creative challenges from all angles.
        </p>
        <p className="text-lg leading-relaxed text-secondary">
          Because I draw from a really wide toolkit — whether making art for
          a published Steam game or using my photography and videography
          background to tell a brand's story — I can easily adapt to any
          project and help push a team's creative vision forward.
        </p>
      </div>
    </section>
  )
}

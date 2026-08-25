import { JOURNEY_CHAPTERS } from '../data/journeyChapters'
import { Reveal } from './Reveal'

// Below the desktop breakpoint, the same chapter content renders as a
// plain stacked vertical flow instead -- no pin, no parallax, no
// clip-mask, just Reveal's existing fade+rise per chapter. Horizontal
// scroll-jacking via touch is fragile enough that skipping it entirely
// on mobile is the safer, standard choice for this kind of site.
//
// No id="work"/id="about" here -- the first Work chapter and first
// About chapter already carry those ids on their own root (see
// journeyChapters.tsx), since the exact same chapter.render() output
// is reused unmodified in JourneyDesktop. Adding a second id on this
// wrapper would just duplicate it in the DOM.
export function JourneyMobile() {
  return (
    <>
      {JOURNEY_CHAPTERS.map((chapter) => (
        <section key={chapter.key}>
          <Reveal>{chapter.render()}</Reveal>
        </section>
      ))}
    </>
  )
}

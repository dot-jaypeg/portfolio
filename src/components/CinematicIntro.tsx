import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger, SplitText } from '../lib/gsap'
import introPhoto from '../assets/images/intro/IMG_8143.jpg'
import jaydenCutVideo from '../assets/images/intro/jayden-ramirez-cut.mp4'
import chichaShuffleClip from '../assets/images/intro/shuffle/chicha-bg-loop.mp4'
import bagguShuffleClip from '../assets/images/projects/detail/baggu/tone-spiderverse-set.mp4'
import urbanSeoulShuffleClip from '../assets/images/projects/detail/urban-seoul/keychain-loop.mp4'
import contraShuffleClip from '../assets/images/projects/detail/contra-coffee-sticker-pack/contra-stickersheet.mp4'
import afiShuffleClip from '../assets/images/projects/detail/afi-marketing-campaign/incubus-vinyl-clip.mp4'
import resonanceShuffleClip from '../assets/images/projects/detail/ui-design-for-resonance/match-end-loop.mp4'
import protocolShuffleClip from '../assets/images/intro/shuffle/protocol-bg-loop.mp4'
import nsuShuffleClip from '../assets/images/projects/detail/nikkei-student-union/nsu-recap.mp4'
import { SCENES } from '../data/scenes'

// Scene 1 ("Branding & Identity") and scene 2 ("Digital & Motion") each
// cycle through a handful of real project clips instead of one single
// video -- a loose visual sampler of "different branding/motion
// projects" rather than any one case study standing in for the whole
// category.
const BRANDING_SHUFFLE_CLIPS = [chichaShuffleClip, bagguShuffleClip, urbanSeoulShuffleClip, contraShuffleClip]
const MOTION_SHUFFLE_CLIPS = [afiShuffleClip, resonanceShuffleClip, protocolShuffleClip, nsuShuffleClip]

// Starts muted (autoplay triggered by scroll/mount, not a real user
// gesture, so browsers won't allow it unmuted) -- the main scroll
// timeline below (see the `jaydenVideo` volume ramp in onUpdate) is
// what actually drives its volume/muted state as this scene scrolls
// into and back out of view, not a click.
//
// The bare `autoPlay` attribute alone turned out NOT to be enough
// here -- confirmed directly: every scene in this track is mounted
// simultaneously (just translated via GSAP, not actually scrolled to
// in the normal sense), and Chrome silently never started playback for
// whichever scenes sat geometrically furthest from the viewport at
// mount (scene 3 here, and scene 2's own shuffle clips below -- scene
// 1's happened to start fine, apparently close enough to "count").
// Explicitly calling `.play()` once mounted, the same way
// AutoplayInViewVideo does elsewhere on the site instead of relying on
// the attribute, isn't subject to that same distance heuristic.
function JaydenReelVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    videoRef.current?.play().catch(() => {})
  }, [])

  return (
    <video
      ref={videoRef}
      src={jaydenCutVideo}
      autoPlay
      muted
      loop
      playsInline
      data-parallax-amount="6"
      className="scene-media mix-blend-overlay absolute inset-[-6%] h-[112%] w-[112%] max-w-none object-cover"
    />
  )
}

function VideoShuffleBackground({ sources }: { sources: string[] }) {
  const [active, setActive] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const id = setInterval(() => {
      setActive((i) => (i + 1) % sources.length)
    }, 5000)
    return () => clearInterval(id)
  }, [sources.length])

  // Same explicit-play fix as JaydenReelVideo above, for every stacked
  // clip at once -- `autoPlay` alone silently never started scene 2's
  // clips (this component is reused for both scene 1 and scene 2, and
  // only scene 1's happened to autoplay on its own).
  useEffect(() => {
    containerRef.current
      ?.querySelectorAll('video')
      .forEach((video) => video.play().catch(() => {}))
  }, [])

  return (
    <div ref={containerRef} className="contents">
      {sources.map((src, i) => (
        <video
          key={src}
          src={src}
          autoPlay
          muted
          loop
          playsInline
          className="scene-media pointer-events-none absolute inset-[-6%] h-[112%] w-[112%] max-w-none object-cover transition-opacity duration-1000 ease-in-out"
          style={{ opacity: i === active ? 1 : 0 }}
          data-parallax-amount="6"
        />
      ))}
    </div>
  )
}

export function CinematicIntro() {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const track = trackRef.current!
      const panels = gsap.utils.toArray<HTMLElement>('.scene-panel')
      const n = panels.length

      const splits = panels.map((panel) => {
        const headline = panel.querySelector('.scene-headline')!
        return new SplitText(headline, { type: 'words' })
      })

      // `unit`, not `1/n` -- see the positioning comment below. Declared
      // early since colorAtProgress needs it too.
      const unit = 1 / (n - 1)

      // Colors are computed and applied here in onUpdate rather than as
      // tweens living inside the pinned timeline below -- a real bug
      // found this session (originally fixed in Journey, then found to
      // also affect this component): a pinned ScrollTrigger keeps
      // getting told to re-render on every scroll tick indefinitely,
      // long after scrolling past its own end. With color tweens living
      // inside the timeline, every one of those redundant re-renders
      // re-wrote --bg/--fg -- confirmed here directly: even after
      // Journey's own onUpdate correctly set About's cream, this
      // component's leftover reset tween (ink/cream, targeting Work's
      // colors) kept firing afterward and silently overwrote it, purely
      // because it happened to render on a later tick. Computing the
      // color here and skipping the write whenever it hasn't actually
      // changed means this component stops touching these properties at
      // all once truly settled, leaving whatever comes after it
      // uncontested.
      // Same fix as JourneyDesktop's colorAtProgress: fading color over
      // a full half-unit window read as laggy and disconnected from the
      // actual scroll -- text for the next scene was already fully
      // revealed while the background was still slowly catching up well
      // after. A quarter-unit window centered on the scene boundary (the
      // same proportion the word-reveal budgets already use below) keeps
      // the color settled by the time the new scene's headline arrives.
      const crossDuration = unit * 0.25
      let lastColorKey = ''

      // Jayden's own reel (scene 3, the last one) is the only scene with
      // real audio -- it should only actually be heard while that scene
      // is the one on screen, fading in as you scroll into its window
      // and back out only once you've genuinely left it for the next
      // section, not left playing audibly underneath every other scene.
      // `jaydenWinStart` mirrors the exact same window math the per-
      // scene entry/exit tweens below use for scene `n - 1` (`center -
      // unit * 0.5`, with the window always running to the very end
      // since it's the last scene) -- computed once here rather than
      // threading a value out of that loop.
      const jaydenVideo = panels[n - 1]?.querySelector('video')
      const jaydenWinStart = (n - 1) * unit - unit * 0.5
      // Fade in across the window's first quarter, same proportion the
      // headline's own word-reveal uses, then HOLD at full volume for
      // the rest of this scene's own time on screen -- there's no exit
      // fade here at all. A real bug this used to have: fading out
      // starting partway through this same window (mirroring the
      // headline's own exit tween) meant the audio had already gone
      // silent while Jayden's scene was still the one actually visible,
      // well before the visitor had scrolled anywhere near the next
      // section. The real fade-out instead lives in the dedicated
      // ScrollTrigger below, keyed to the gap between this scene ending
      // and Journey's own pin taking over -- the only point the visitor
      // is actually leaving this scene for the next one.
      const volumeEnvelope = (t: number) => {
        if (t < 0.25) return gsap.utils.clamp(0, 1, t / 0.25)
        return 1
      }
      const colorAtProgress = (progress: number) => {
        const i = Math.round(progress * (n - 1))
        if (i === 0) return SCENES[0]
        const boundary = (i - 1) * unit + unit * 0.5
        const t = gsap.utils.clamp(
          0,
          1,
          (progress - (boundary - crossDuration * 0.5)) / crossDuration,
        )
        const prev = SCENES[i - 1]
        const curr = SCENES[i]
        return {
          bg: gsap.utils.interpolate(prev.bg, curr.bg, t),
          fg: gsap.utils.interpolate(prev.fg, curr.fg, t),
        }
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: () => '+=' + window.innerHeight * n * 1.1,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            // Driven straight off ScrollTrigger's own progress rather than
            // React state -- this fires every scroll tick, so a re-render
            // per frame would be wasteful; direct DOM writes match the
            // quickTo pattern already used for the cursor elsewhere.
            if (progressRef.current) {
              progressRef.current.style.transform = `scaleX(${self.progress})`
            }

            // `scrub: 1` eases self.progress toward a big instant scroll
            // jump over about a second instead of snapping to it -- a nav
            // click straight to Work jumps the real scroll past this
            // trigger's own end in one tick, but self.progress still has
            // to visibly animate 0 -> 1 to catch up, firing onUpdate
            // repeatedly along the way and landing on scene 3's red well
            // after JourneyDesktop's own trigger (which barely had to
            // move) already set the correct ink. self.scroll() is the
            // REAL scroll position, not the still-easing progress --
            // comparing it against this trigger's own end catches "we've
            // already scrolled past this component entirely" and skips
            // writing colors at all once that's true. (The remaining gap
            // between this trigger's own end and where Journey's pin
            // actually starts -- the pin-spacer also reserves this
            // section's own natural height, on top of the scrub distance
            // -- is filled by its own dedicated crossfade in
            // useSectionColors, since this trigger's onUpdate never fires
            // there at all: self.progress is pinned at exactly 1 for that
            // whole stretch, so GSAP has no reason to call it.)
            //
            // The Jayden video's volume fade-IN below shares this same
            // guard, for the same reason: without it, a nav-jump landing
            // past this trigger's end would have this catch-up still
            // writing an intermediate (not-yet-1) volume for about a
            // second AT THE SAME TIME the dedicated gap/Journey fade-out
            // ScrollTrigger below is already writing its own OWN volume
            // for that same jumped-to position, visibly fighting over it.
            if (self.scroll() > self.end) return
            if (jaydenVideo) {
              const t = gsap.utils.clamp(
                0,
                1,
                (self.progress - jaydenWinStart) / (1 - jaydenWinStart),
              )
              const volume = volumeEnvelope(t)
              jaydenVideo.volume = volume
              // Below ~2% is inaudible anyway -- actually marking it
              // muted once there (rather than just leaving volume at a
              // tiny positive number) keeps it consistent with every
              // other autoplaying video's `muted` state at rest.
              jaydenVideo.muted = volume < 0.02
            }
            const { bg, fg } = colorAtProgress(self.progress)
            // Fixed red ONLY over scene 0's own window ("Hello.", the one
            // scene with a busy photo behind it) -- NOT the whole
            // component. Scene 3 ("Jayden Ramirez") has a red *background*
            // of its own, so pinning nav red across all four scenes would
            // have recreated the exact red-on-red invisibility bug this
            // is meant to fix, just one scene later. Every other scene
            // (1, 2, 3) tracks --fg like body copy does everywhere else.
            const isFirstScene = Math.round(self.progress * (n - 1)) === 0
            const navFg = isFirstScene ? '#dd5547' : fg
            const key = bg + fg + navFg
            if (key !== lastColorKey) {
              lastColorKey = key
              gsap.set(document.documentElement, {
                '--bg': bg,
                '--fg': fg,
                '--nav-fg': navFg,
              })
            }
          },
        },
      })

      // The actual fade-OUT -- a separate, non-pinned ScrollTrigger
      // tracking exactly the gap between this component's own pin
      // releasing and Journey's pin taking over (same trigger/start/end
      // useSectionColors.ts uses to patch its own identical gap: "top
      // bottom" of #journey is exactly where this component's progress
      // hits 1, "top top" is exactly where Journey's pin engages). The
      // main timeline above holds Jayden's volume at full for its ENTIRE
      // time on screen, including that whole frozen stretch (its own
      // onUpdate simply stops firing there, since self.progress isn't
      // changing) -- this is the only thing that ever brings it back
      // down, and only once the visitor is genuinely scrolling past this
      // scene into the next section, not partway through still looking
      // at it.
      if (jaydenVideo) {
        const journeySection = document.getElementById('journey')
        if (journeySection) {
          ScrollTrigger.create({
            trigger: journeySection,
            start: 'top bottom',
            end: 'top top',
            onUpdate: (self) => {
              // Deliberately NOT gated on `self.isActive` -- that flips
              // false right at (and past) this trigger's own end, which
              // is exactly the one tick that needs to land the volume on
              // its true final value (0). A real bug this had: guarding
              // on it meant the LAST write before the visitor scrolled
              // past that boundary stuck permanently (confirmed
              // directly: a single fast scroll straight through the gap
              // left the video stuck audible at whatever volume the last
              // active tick happened to land on, e.g. ~0.84, instead of
              // reaching silence). onUpdate here never fires at all
              // before scroll genuinely nears `self.start` in the first
              // place (confirmed directly -- no spurious call at mount),
              // so there's no risk of this prematurely stomping the main
              // timeline's own fade-in with a stray progress:0 -> volume:1
              // write either.
              const volume = gsap.utils.clamp(0, 1, 1 - self.progress)
              jaydenVideo.volume = volume
              jaydenVideo.muted = volume < 0.02
            },
          })
        }
      }

      // Duration is 1 to match the [0, 1] fractional scale used for every
      // per-scene offset below -- GSAP's default tween duration (0.5) would
      // otherwise finish the horizontal translation at the timeline's
      // halfway point, desyncing it from the word reveal/exit timings.
      //
      // Using a plain vw value (not xPercent) deliberately: xPercent is a
      // percentage of the TRACK's own width (n * 100vw), not of 100vw, so
      // "-100 * (n - 1)" would translate n times further than intended.
      tl.to(
        track,
        { x: `-${(n - 1) * 100}vw`, ease: 'none', duration: 1 },
        0,
      )

      splits.forEach((split, i) => {
        const center = i * unit
        const winStart = i === 0 ? 0 : center - unit * 0.5
        const winEnd = i === n - 1 ? 1 : center + unit * 0.5
        const winWidth = winEnd - winStart

        // Same depth-cue swing JourneyDesktop gives its own chapter media,
        // scaled to whatever this element's own CSS oversize can safely
        // hide (see the `data-parallax-amount` comment in JourneyDesktop
        // for why that amount isn't just a flat default for every image).
        // querySelectorAll, not querySelector -- the shuffle scenes stack
        // several videos on top of each other (see VideoShuffleBackground),
        // all needing the same swing so there's no visible seam between
        // a parallaxing clip and a static one when they cross-fade.
        const mediaEls = panels[i].querySelectorAll('.scene-media')
        mediaEls.forEach((media) => {
          const amount = Number(media.getAttribute('data-parallax-amount')) || 6
          tl.fromTo(
            media,
            { xPercent: amount },
            { xPercent: -amount, ease: 'none', duration: winWidth },
            winStart,
          )
        })

        // Scene 0 is visible at rest (scroll position 0) -- only scenes
        // reached by scrolling need an entrance fade-in.
        //
        // Budget (stagger tail + duration) as a fraction of this scene's
        // own window instead of fixed absolute numbers -- a real bug:
        // with a fixed stagger of 0.05 and duration of 0.12, a 3-word
        // headline's last word didn't finish fading in (entrance starts
        // staggered at +0.10 into its own 0.12-long tween, so it doesn't
        // complete until +0.22) until AFTER the exit fade had already
        // started pulling it back out again -- the last word of every
        // multi-word "craft" scene never fully appeared before fading
        // back out, reading as the headline being cut off mid-reveal.
        // Sizing both budgets off the window, regardless of word count,
        // guarantees entrance always finishes well before exit begins.
        if (i > 0) {
          const entryBudget = winWidth * 0.25
          const entryDuration = entryBudget * 0.6
          const entryStagger =
            split.words.length > 1
              ? (entryBudget - entryDuration) / (split.words.length - 1)
              : 0
          tl.from(
            split.words,
            {
              opacity: 0,
              y: 40,
              stagger: entryStagger,
              duration: entryDuration,
              ease: 'power2.out',
            },
            winStart + winWidth * 0.1,
          )
        }
        if (i < n - 1) {
          const exitBudget = winWidth * 0.25
          const exitDuration = exitBudget * 0.6
          const exitStagger =
            split.words.length > 1
              ? (exitBudget - exitDuration) / (split.words.length - 1)
              : 0
          tl.to(
            split.words,
            {
              opacity: 0,
              y: -40,
              stagger: exitStagger,
              duration: exitDuration,
              ease: 'power2.in',
            },
            winStart + winWidth * 0.65,
          )
        }

      })

      return () => {
        splits.forEach((split) => split.revert())
      }
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="top"
      ref={containerRef}
      className="relative h-screen w-screen overflow-hidden bg-ink"
    >
      <div
        ref={trackRef}
        className="flex h-full"
        style={{ width: `${SCENES.length * 100}vw` }}
      >
        {SCENES.map((scene, i) => (
          <div
            key={scene.headline}
            className="scene-panel relative flex h-full w-screen shrink-0 flex-col justify-end overflow-hidden p-8 md:p-16"
          >
            {i === 0 ? (
              // Negative inset cancels the panel's own padding so the
              // photo reads as a true full-bleed hero shot instead of a
              // framed box floating inside a margin -- the overflow-hidden
              // here (not just the one on scene-panel) is what lets the
              // oversized, parallax-driven image inside it swing without
              // ever revealing its own edges.
              <div className="absolute -inset-8 overflow-hidden md:-inset-16">
                {/* `max-w-none` is required, not decorative -- Tailwind's
                    preflight sets `img { max-width: 100% }`, which
                    silently caps this element's WIDTH at 100% regardless
                    of the 112% utility (height isn't affected, since
                    preflight only overrides max-width, not max-height).
                    Without it the swing has zero real horizontal bleed
                    margin and reveals a gap on one side. */}
                <img
                  src={introPhoto}
                  alt="Jayden Ramirez"
                  data-parallax-amount="6"
                  className="scene-media pointer-events-none absolute inset-[-6%] h-[112%] w-[112%] max-w-none object-cover"
                />
                {/* Bottom scrim purely for the eyebrow/headline's own
                    legibility against a busy photo -- independent of the
                    fixed red nav-fg pin above, which solves a different
                    problem (nav contrast against the page-wide red bg). */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />
              </div>
            ) : i === 3 ? (
              // Jayden's own reel, blended into the scene's red backdrop
              // (set here via inline style -- every other panel just
              // shows the section's own bg-ink straight through) rather
              // than playing as a flat, full-opacity clip.
              <div
                className="absolute -inset-8 overflow-hidden md:-inset-16"
                style={{ backgroundColor: scene.bg }}
              >
                <JaydenReelVideo />
              </div>
            ) : (
              <div className="absolute -inset-8 overflow-hidden opacity-25 md:-inset-16">
                <VideoShuffleBackground
                  sources={i === 1 ? BRANDING_SHUFFLE_CLIPS : MOTION_SHUFFLE_CLIPS}
                />
              </div>
            )}
            {/* Only "Hello." keeps its eyebrow -- the other three scenes'
                subheads ("02 -- Expertise" etc.) were removed as
                clutter, per feedback. */}
            {i === 0 && (
              <p className="font-body text-xs tracking-[0.22em] text-cream uppercase">
                {scene.eyebrow}
              </p>
            )}
            <h2
              className={`scene-headline font-display text-[13vw] leading-[0.8] font-bold tracking-[-0.06em] text-cream uppercase ${i === 0 ? 'mt-4' : ''}`}
            >
              {scene.headline}
            </h2>
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-px bg-cream/15">
        <div
          ref={progressRef}
          className="h-full w-full origin-left bg-cream"
          style={{ transform: 'scaleX(0)' }}
        />
      </div>
    </section>
  )
}

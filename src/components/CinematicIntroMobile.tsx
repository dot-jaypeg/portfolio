import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import introPhoto from '../assets/images/intro/IMG_8143.jpg'
import { BRANDING_SHUFFLE_CLIPS, MOTION_SHUFFLE_CLIPS, JaydenReelVideo, VideoShuffleBackground } from './SceneMedia'
import { SCENES } from '../data/scenes'
import { Reveal } from './Reveal'

// Below the `md` breakpoint, CinematicIntroDesktop's pinned horizontal
// scroll-jack doesn't run at all -- these same four scenes render as a
// plain stacked vertical flow instead, same reasoning JourneyMobile
// already applies to Journey's own pinned track (see that file's own
// comment): horizontal scroll-jacking via touch is fragile enough that
// skipping it entirely on mobile is the safer, standard choice. No
// SplitText word-reveal, parallax swing, or progress bar here either --
// all of that was built around having a single shared scrub timeline to
// hang off of, which a plain stacked layout doesn't have. Each scene
// gets the same Reveal fade+rise JourneyMobile's own chapters use
// instead.
export function CinematicIntroMobile() {
  const sectionRefs = useRef<(HTMLElement | null)[]>([])

  // Plays a section's video(s) once it's actually the one on screen,
  // pauses them otherwise -- same IntersectionObserver technique
  // ImageGrid's own AutoplayInViewVideo uses, just applied to every
  // video inside a whole section at once rather than one at a time.
  // Mirrors CinematicIntroDesktop's own updateSceneVideoPlayback (built
  // for a real, confirmed Safari bug: a comparatively low ceiling on
  // simultaneous hardware-decoded video streams, tipped over once every
  // scene's videos plus the background-music YouTube embed were all
  // decoding at once) -- a plain stacked layout has no shared scroll
  // progress to compute "which scene is active" from, so this just asks
  // the browser directly instead.
  useEffect(() => {
    const observers = sectionRefs.current.map((section) => {
      if (!section) return null
      const observer = new IntersectionObserver(
        ([entry]) => {
          section.querySelectorAll('video').forEach((video) => {
            if (entry.isIntersecting) video.play().catch(() => {})
            else video.pause()
          })
        },
        { threshold: 0.2 },
      )
      observer.observe(section)
      return observer
    })
    return () => observers.forEach((o) => o?.disconnect())
  }, [])

  // One crossfade per scene BOUNDARY (i from 1 -- scene 0 doesn't need
  // its own, index.css's own --bg/--fg defaults already match its ink/
  // cream pair). Mirrors JourneyMobile's own per-chapter crossfade
  // exactly, just driven by SCENES instead of JOURNEY_CHAPTERS.
  //
  // Scene 0's --nav-fg is red, not cream, while its own busy photo is on
  // screen (same as CinematicIntroDesktop's `isFirstScene` special-case)
  // -- set directly here rather than through a scroll-tied tween, since
  // it's the correct value at rest before any scrolling has happened at
  // all. The boundary-1 crossfade below fades it to scene 1's own ink
  // fg instead of carrying it through as if it were scene 0's real fg.
  useEffect(() => {
    gsap.set(document.documentElement, { '--nav-fg': '#dd5547' })

    const ctx = gsap.context(() => {
      SCENES.forEach((scene, i) => {
        if (i === 0) return
        const section = sectionRefs.current[i]
        const prev = SCENES[i - 1]
        if (!section) return
        gsap.fromTo(
          document.documentElement,
          {
            '--bg': prev.bg,
            '--fg': prev.fg,
            '--nav-fg': i === 1 ? '#dd5547' : prev.fg,
          },
          {
            '--bg': scene.bg,
            '--fg': scene.fg,
            '--nav-fg': scene.fg,
            ease: 'none',
            immediateRender: false,
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
              end: 'top 30%',
              scrub: true,
            },
          },
        )
      })
    })
    return () => ctx.revert()
  }, [])

  // Jayden's own reel (scene 3, the last one) is the only scene with
  // real audio -- fades in as its section scrolls into view, holds while
  // it's the one on screen, fades back out while leaving it in either
  // direction (scrolling on past it, or back up away from it). Same
  // volumeEnvelope shape CinematicIntroDesktop uses (fade in across the
  // first quarter, hold, exit fade handled separately), just driven by
  // this section's own natural scroll-through range instead of a shared
  // pinned timeline's fractional window.
  useEffect(() => {
    const section = sectionRefs.current[SCENES.length - 1]
    const video = section?.querySelector('video')
    if (!section || !video) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        video,
        { volume: 0 },
        {
          volume: 1,
          ease: 'none',
          immediateRender: false,
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            end: 'top 40%',
            scrub: true,
            // Reads the tween's own just-applied `volume`, not a
            // separately re-derived `self.progress` threshold -- a
            // real, confirmed bug when it was: self.progress crosses
            // near-zero in opposite senses depending on scroll
            // direction (just entering this range going forward vs.
            // about to leave it going backward), so a progress-based
            // check left audio incorrectly stuck muted after scrolling
            // back UP into this scene from below, even once volume had
            // fully returned to 1. Deriving straight from `video.volume`
            // is direction-agnostic by construction.
            onUpdate: () => {
              video.muted = video.volume < 0.02
            },
          },
        },
      )
      gsap.fromTo(
        video,
        { volume: 1 },
        {
          volume: 0,
          ease: 'none',
          immediateRender: false,
          scrollTrigger: {
            trigger: section,
            start: 'bottom 60%',
            end: 'bottom 5%',
            scrub: true,
            onUpdate: () => {
              video.muted = video.volume < 0.02
            },
          },
        },
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <div id="top">
      {SCENES.map((scene, i) => (
        <section
          key={scene.headline}
          ref={(el) => {
            sectionRefs.current[i] = el
          }}
          className="relative flex min-h-[100svh] w-full flex-col justify-end overflow-hidden bg-ink p-8"
        >
          {i === 0 ? (
            <div className="absolute inset-0 overflow-hidden">
              <img
                src={introPhoto}
                alt="Jayden Ramirez"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />
            </div>
          ) : i === SCENES.length - 1 ? (
            <div className="absolute inset-0 overflow-hidden" style={{ backgroundColor: scene.bg }}>
              <JaydenReelVideo />
            </div>
          ) : (
            <div className="absolute inset-0 overflow-hidden opacity-25">
              <VideoShuffleBackground sources={i === 1 ? BRANDING_SHUFFLE_CLIPS : MOTION_SHUFFLE_CLIPS} />
            </div>
          )}
          <Reveal className="relative">
            {i === 0 && (
              <p className="font-body mb-4 text-xs tracking-[0.22em] text-cream uppercase">{scene.eyebrow}</p>
            )}
            <h2 className="font-display text-[13vw] leading-[0.8] font-bold tracking-[-0.06em] text-cream uppercase">
              {scene.headline}
            </h2>
          </Reveal>
        </section>
      ))}
    </div>
  )
}

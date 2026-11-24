import { useEffect, useRef } from 'react'
import { gsap, SplitText } from '../lib/gsap'
import introPhoto from '../assets/images/intro/IMG_8143.jpg'
import { BRANDING_SHUFFLE_CLIPS, MOTION_SHUFFLE_CLIPS, JaydenReelVideo, VideoShuffleBackground } from './SceneMedia'
import { SCENES } from '../data/scenes'

// Below the `md` breakpoint, CinematicIntroDesktop's pinned horizontal
// scroll-jack doesn't run at all -- these same four scenes render as a
// plain stacked vertical flow instead, same reasoning JourneyMobile
// already applies to Journey's own pinned track (see that file's own
// comment): horizontal scroll-jacking via touch is fragile enough that
// skipping it entirely on mobile is the safer, standard choice.
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

  // Per-word entrance, same shape as CinematicIntroDesktop's own
  // headline reveal (opacity 0, y 40, staggered, power2.out) -- that one
  // budgets its stagger/duration against a shared scrub timeline's own
  // window, which a plain stacked layout has no equivalent of; a single
  // one-shot reveal triggered by the section's own scroll-into-view
  // (same toggleActions convention Reveal.tsx already uses elsewhere)
  // gets the same per-word feel without needing that math.
  useEffect(() => {
    const ctx = gsap.context(() => {
      const splits = sectionRefs.current
        .map((section) => {
          const headline = section?.querySelector('h2')
          return section && headline ? { section, split: new SplitText(headline, { type: 'words' }) } : null
        })
        .filter((s): s is { section: HTMLElement; split: SplitText } => s !== null)

      splits.forEach(({ section, split }) => {
        gsap.from(split.words, {
          opacity: 0,
          y: 40,
          stagger: 0.06,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        })
      })

      return () => splits.forEach(({ split }) => split.revert())
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
    // Defensive re-assert, not just the IntersectionObserver's own
    // play() call above -- a real, confirmed bug: toggling a playing
    // video's `muted` flag off (below, once volume rises past the
    // threshold) can make a browser that only allowed autoplay because
    // the video STARTED muted decide to pause it right there, since
    // unmuting didn't come from a fresh user gesture. Intermittent,
    // since whether a given browser treats a prior touch/scroll as
    // sufficient "activation" for that isn't fully predictable. Calling
    // `.play()` again immediately after every `muted` write is a no-op
    // if it's already playing, and recovers it if that's what paused it.
    const reassertPlaying = () => {
      video.muted = video.volume < 0.02
      video.play().catch(() => {})
    }
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
            onUpdate: reassertPlaying,
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
            onUpdate: reassertPlaying,
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
          {/* 17vw, not desktop's 13vw -- per direct request, these read
              too small stacked full-width on mobile compared to how much
              visual weight they carry on desktop's own wide horizontal
              panels. */}
          <h2 className="relative font-display text-[17vw] leading-[0.82] font-bold tracking-[-0.06em] text-cream uppercase">
            {scene.headline}
          </h2>
        </section>
      ))}
    </div>
  )
}

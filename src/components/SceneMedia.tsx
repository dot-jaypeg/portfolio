import { useEffect, useRef, useState } from 'react'
import jaydenCutVideo from '../assets/images/intro/jayden-ramirez-cut.mp4'
import chichaShuffleClip from '../assets/images/intro/shuffle/chicha-bg-loop.mp4'
import bagguShuffleClip from '../assets/images/projects/detail/baggu/tone-spiderverse-set.mp4'
import urbanSeoulShuffleClip from '../assets/images/projects/detail/urban-seoul/keychain-loop.mp4'
import contraShuffleClip from '../assets/images/projects/detail/contra-coffee-sticker-pack/contra-stickersheet.mp4'
import afiShuffleClip from '../assets/images/projects/detail/afi-marketing-campaign/incubus-vinyl-clip.mp4'
import resonanceShuffleClip from '../assets/images/projects/detail/ui-design-for-resonance/match-end-loop.mp4'
import protocolShuffleClip from '../assets/images/intro/shuffle/protocol-bg-loop.mp4'
import nsuShuffleClip from '../assets/images/projects/detail/nikkei-student-union/nsu-recap.mp4'

// Shared by both CinematicIntroDesktop (pinned, horizontal) and
// CinematicIntroMobile (plain stacked, vertical) -- the scene 1/scene 2
// backgrounds and Jayden's own reel are identical media between the two
// layouts, only how they're scrolled to differs.

// Scene 1 ("Branding & Identity") and scene 2 ("Digital & Motion") each
// cycle through a handful of real project clips instead of one single
// video -- a loose visual sampler of "different branding/motion
// projects" rather than any one case study standing in for the whole
// category.
export const BRANDING_SHUFFLE_CLIPS = [chichaShuffleClip, bagguShuffleClip, urbanSeoulShuffleClip, contraShuffleClip]
export const MOTION_SHUFFLE_CLIPS = [afiShuffleClip, resonanceShuffleClip, protocolShuffleClip, nsuShuffleClip]

// Starts muted (autoplay triggered by scroll/mount, not a real user
// gesture, so browsers won't allow it unmuted) -- the caller is what
// actually drives its volume/muted state as this scene scrolls into
// and back out of view, not a click.
//
// The bare `autoPlay` attribute alone turned out NOT to be enough
// here -- confirmed directly: every scene in CinematicIntroDesktop's
// own track is mounted simultaneously (just translated via GSAP, not
// actually scrolled to in the normal sense), and Chrome silently never
// started playback for whichever scenes sat geometrically furthest from
// the viewport at mount (scene 3 here, and scene 2's own shuffle clips
// below -- scene 1's happened to start fine, apparently close enough to
// "count"). Explicitly calling `.play()` once mounted, the same way
// AutoplayInViewVideo does elsewhere on the site instead of relying on
// the attribute, isn't subject to that same distance heuristic.
export function JaydenReelVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    video?.play().catch(() => {})
    if (!video) return
    // A real, reported bug: this video can visually freeze on a single
    // frame on real hardware -- not paused, no error, `readyState` still
    // reports plenty of buffered data -- the browser's own decoder just
    // stalls without ever firing a definitive failure event to react to.
    // Confirmed this doesn't reproduce in automated/headless testing at
    // all (decoder stalls like this are tied to real hardware/driver
    // behavior), so this is a watchdog rather than a fix for a specific
    // root cause: every 2s, if currentTime hasn't moved since the last
    // check while the video thinks it's still playing, call `.play()`
    // again -- a no-op on an already-advancing video, but reliably
    // kicks a stalled decoder back into producing frames.
    let lastTime = video.currentTime
    const id = window.setInterval(() => {
      if (video.paused || video.ended) return
      if (video.currentTime === lastTime) {
        video.play().catch(() => {})
      }
      lastTime = video.currentTime
    }, 2000)
    // Backgrounding the tab throttles a video's decode loop -- coming
    // back to the tab is the single most likely moment to find it
    // "playing" but stuck on a stale frame, so this re-asserts play()
    // the instant the tab is foregrounded again rather than waiting up
    // to 2s for the watchdog's own next tick.
    const onVisible = () => {
      if (document.visibilityState === 'visible') video.play().catch(() => {})
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      window.clearInterval(id)
      document.removeEventListener('visibilitychange', onVisible)
    }
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
      // No `mix-blend-mode` -- a real, reported bug: video played
      // through a blend mode forces Chrome into per-frame software
      // compositing (it has to re-blend every decoded frame against
      // the backdrop, not just composite a static layer), which is
      // measurably more expensive than a plain video -- confirmed
      // directly via `getVideoPlaybackQuality()`: dropped frames over
      // an identical window with the blend mode on vs. off, on the
      // same machine. Combined with the continuous parallax transform
      // already running on this element, that was enough to visibly
      // stutter on real hardware even though it stayed smooth in this
      // environment's own (faster) test machine. `opacity-25` gets back
      // the same dimmed, blended-into-the-backdrop mood the blend mode
      // was there for (and matches the other two scenes' own shuffle
      // clips, which already run at this same opacity) -- plain opacity
      // is cheap, ordinary GPU compositing, not the per-frame blend
      // formula that caused the stutter.
      className="scene-media absolute inset-[-6%] h-[112%] w-[112%] max-w-none object-cover opacity-25"
    />
  )
}

export function VideoShuffleBackground({ sources }: { sources: string[] }) {
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
          // Full-bleed `object-cover` on every viewport, same treatment
          // as Jayden's own reel -- per direct request, reverting an
          // earlier mobile-only `object-contain` fix (that one stopped
          // these screen-recorded clips from cropping their own
          // in-video text on some loops, e.g. "LAVENDER"/"STRAWBERRY" at
          // a certain timestamp) back to matching Jayden's full-screen
          // look consistently across all three scenes, accepting that
          // occasional crop as the traded-off cost.
          className="scene-media pointer-events-none absolute inset-[-6%] h-[112%] w-[112%] max-w-none object-cover transition-opacity duration-1000 ease-in-out"
          style={{ opacity: i === active ? 1 : 0 }}
          data-parallax-amount="6"
        />
      ))}
    </div>
  )
}

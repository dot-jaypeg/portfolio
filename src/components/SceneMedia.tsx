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

// Same computed-once-at-mount pattern ProjectHero.tsx/Journey.tsx/
// MoodboardCanvas.tsx already use for their own desktop/mobile branch.
// Needed here because the shuffle clips' `data-parallax-amount` (read
// by CinematicIntroDesktop's own xPercent swing) assumes the element
// sits in a box that's oversized beyond the viewport, with room to pan
// into -- true for the `md:`-and-up `object-cover` box, but no longer
// true for mobile's own exact-viewport-size `object-contain` box (see
// that className's own comment). Swinging an already-edge-to-edge box
// by the same 6% still clips/gaps the real screen edges, just scroll-
// position-dependent instead of constant -- so mobile gets 0 instead.
// (CinematicIntroMobile never actually runs that swing tween at all,
// but this component is shared, so the attribute still needs to be
// correct for the desktop case that does.)
const isDesktopViewport = () =>
  typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches

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
  const [isDesktop] = useState(isDesktopViewport)
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
          // `object-contain` on mobile -- a real, reported bug: these
          // clips are screen recordings of a real website touring
          // through several pages (a wide product grid, multi-column
          // text), cropped via `object-cover` into mobile's own much
          // taller/narrower full-bleed box than any desktop viewport
          // comes close to. Confirmed directly: chi-cha's own clip
          // landed on its products grid page mid-loop and cropped
          // "LAVENDER"/"STRAWBERRY" down to a sliver, showing only the
          // center ~30% of the frame's width. Desktop's own box ratio
          // is already close enough to these clips' own 1.5-ish ratio
          // that `cover` barely crops at all there, so it keeps that
          // treatment; mobile letterboxes instead, invisible anyway at
          // this layer's 25% opacity.
          //
          // The box itself is oversized (`inset-[-6%] h-[112%] w-[112%]`)
          // on desktop only now -- that headroom exists so the parallax
          // pan never reveals a transparent edge under `cover`, which
          // always scales to fully fill whatever box it's given. But
          // `contain` fits inside that same box's bounding dimension,
          // so on mobile the already-letterboxed video was ITSELF
          // rendered 12% wider than the real screen -- a second,
          // compounding bug confirmed directly from a screenshot:
          // baggu's own baked-in wordmark clipped by roughly 6% on
          // both the left and right edges, symmetric, exactly matching
          // this box's own overscan amount. Mobile now gets a box
          // that's the real viewport size, so `contain` has nothing
          // left to overscan.
          className="scene-media pointer-events-none absolute inset-0 h-full w-full max-w-none object-contain transition-opacity duration-1000 ease-in-out md:inset-[-6%] md:h-[112%] md:w-[112%] md:object-cover"
          style={{ opacity: i === active ? 1 : 0 }}
          data-parallax-amount={isDesktop ? '6' : '0'}
        />
      ))}
    </div>
  )
}

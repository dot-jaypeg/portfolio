import { useEffect, useRef, useState } from 'react'

const YOUTUBE_VIDEO_ID = 'yKYgCD3m9AU'
const API_SCRIPT_ID = 'youtube-iframe-api'

// YT.PlayerState values, per the IFrame Player API.
const YT_STATE_PLAYING = 1
const YT_STATE_PAUSED = 2

interface YTPlayer {
  playVideo: () => void
  pauseVideo: () => void
}

interface YTPlayerEvent {
  target: YTPlayer
  data: number
}

interface YTNamespace {
  Player: new (
    element: HTMLElement,
    options: {
      height: string
      width: string
      videoId: string
      playerVars: Record<string, string | number>
      events: {
        onReady: (e: YTPlayerEvent) => void
        onStateChange: (e: YTPlayerEvent) => void
      }
    },
  ) => YTPlayer
}

declare global {
  interface Window {
    YT?: YTNamespace
    onYouTubeIframeAPIReady?: () => void
  }
}

// `loop: 1` + `playlist` set to this same video's own ID is YouTube's
// documented trick for looping a single video gaplessly (loop only
// applies to playlist contexts, so a "playlist of one" is how a single
// video gets to loop natively, same mechanism as the multi-track case).
//
// The label is driven by confirmed onStateChange events, not by what we
// merely intended -- the site attempts autoplay on load per the design
// brief ("start with sound on"), but browsers block unmuted audio
// autoplay without a preceding user gesture, so that attempt is silently
// blocked for most first-time visitors. If the label just mirrored intent
// it would say "On" while nothing plays -- the exact bug fixed last
// round. Sourcing it from real state means it stays honest either way:
// it flips to On if the browser's autoplay heuristics happen to allow
// it, otherwise it stays Off (accurately) until the first real click,
// which always works since a click is a genuine gesture.
export function SoundToggle() {
  const [on, setOn] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<YTPlayer | null>(null)
  // Covers the narrow window where someone clicks the toggle before the
  // YouTube API script has finished loading and handed back a player --
  // a real (if rare) race, distinct from the autoplay-on-load attempt
  // above since this one DOES follow a genuine click.
  const pendingRef = useRef<boolean | null>(null)

  useEffect(() => {
    window.onYouTubeIframeAPIReady = () => {
      if (!containerRef.current || !window.YT) return
      const player = new window.YT.Player(containerRef.current, {
        height: '1',
        width: '1',
        videoId: YOUTUBE_VIDEO_ID,
        playerVars: {
          loop: 1,
          playlist: YOUTUBE_VIDEO_ID,
          controls: 0,
          disablekb: 1,
        },
        events: {
          onReady: () => {
            playerRef.current = player
            if (pendingRef.current != null) {
              player[pendingRef.current ? 'playVideo' : 'pauseVideo']()
            } else {
              player.playVideo()
            }
          },
          onStateChange: (e) => {
            if (e.data === YT_STATE_PLAYING) setOn(true)
            else if (e.data === YT_STATE_PAUSED) setOn(false)
          },
        },
      })
    }

    if (!document.getElementById(API_SCRIPT_ID)) {
      const script = document.createElement('script')
      script.id = API_SCRIPT_ID
      script.src = 'https://www.youtube.com/iframe_api'
      script.async = true
      document.body.appendChild(script)
    }
  }, [])

  const toggle = () => {
    const next = !on
    if (playerRef.current) playerRef.current[next ? 'playVideo' : 'pauseVideo']()
    else pendingRef.current = next
  }

  return (
    <>
      <button
        type="button"
        onClick={toggle}
        className="font-body text-xs tracking-[0.14em] text-red uppercase transition-colors hover:text-teal"
      >
        Sound: {on ? 'On' : 'Off'}
      </button>
      <div
        ref={containerRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          width: 1,
          height: 1,
          overflow: 'hidden',
          opacity: 0,
          pointerEvents: 'none',
        }}
      />
    </>
  )
}

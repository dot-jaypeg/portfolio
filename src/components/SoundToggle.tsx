import { useEffect, useRef, useState } from 'react'

const YOUTUBE_PLAYLIST_ID = 'PLvMJYw4TOmGWeB4-cWu85DgJ0YQKDgusC'
const API_SCRIPT_ID = 'youtube-iframe-api'

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
      playerVars: Record<string, string | number>
      events: {
        onReady: (e: YTPlayerEvent) => void
        onStateChange: (e: YTPlayerEvent) => void
      }
    },
  ) => YTPlayer
  PlayerState: { ENDED: number }
}

declare global {
  interface Window {
    YT?: YTNamespace
    onYouTubeIframeAPIReady?: () => void
  }
}

// YouTube plays the actual full video, not a truncated preview -- unlike
// Spotify's anonymous embed, so there's no forced 30s cutoff and no need
// to fake a loop by re-triggering playback (which is what caused the
// audible re-buffer blip in the Spotify version). `loop: 1` + a playlist
// context asks YouTube to replay from the top on its own; the
// onStateChange/ENDED check is just a safety net in case that native
// loop doesn't fire in some browser.
//
// Always starts "Off", never restored from a previous visit -- same
// reasoning as before: browsers block audio autoplay without a fresh
// gesture, so pretending it's already on before a real click produced a
// label that lied about whether anything was actually playing.
export function SoundToggle() {
  const [on, setOn] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<YTPlayer | null>(null)
  // Covers the narrow window where someone clicks the toggle before the
  // YouTube API script has finished loading and handed back a player --
  // a real (if rare) race, distinct from the reload case above since
  // this one DOES follow a genuine click.
  const pendingRef = useRef<boolean | null>(null)

  useEffect(() => {
    window.onYouTubeIframeAPIReady = () => {
      if (!containerRef.current || !window.YT) return
      const player = new window.YT.Player(containerRef.current, {
        height: '1',
        width: '1',
        playerVars: {
          listType: 'playlist',
          list: YOUTUBE_PLAYLIST_ID,
          loop: 1,
          controls: 0,
          disablekb: 1,
        },
        events: {
          onReady: () => {
            playerRef.current = player
            if (pendingRef.current != null) {
              player[pendingRef.current ? 'playVideo' : 'pauseVideo']()
            }
          },
          onStateChange: (e) => {
            if (window.YT && e.data === window.YT.PlayerState.ENDED) {
              player.playVideo()
            }
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
    setOn((prev) => {
      const next = !prev
      if (playerRef.current) playerRef.current[next ? 'playVideo' : 'pauseVideo']()
      else pendingRef.current = next
      return next
    })
  }

  return (
    <>
      <button
        type="button"
        onClick={toggle}
        className="font-body text-xs tracking-[0.14em] text-cream/70 uppercase transition-colors hover:text-teal"
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

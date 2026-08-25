import { useEffect, useRef, useState } from 'react'

const SPOTIFY_TRACK_URI = 'spotify:track:3EeD6nR6WDj5kI54SvR9Ph'
const STORAGE_KEY = 'jaypeg-sound-on'
const API_SCRIPT_ID = 'spotify-iframe-api'

interface PlaybackUpdate {
  data: { isBuffering: boolean; isPaused: boolean; duration: number; position: number }
}

interface SpotifyEmbedController {
  play: () => void
  pause: () => void
  addListener: (event: 'playback_update', cb: (e: PlaybackUpdate) => void) => void
}

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (IFrameAPI: {
      createController: (
        element: HTMLElement,
        options: { uri: string; width: string; height: string },
        callback: (controller: SpotifyEmbedController) => void,
      ) => void
    }) => void
  }
}

// Anonymous/non-Premium Spotify sessions only get a 30-second preview of
// a track, then the embed just pauses -- there's no official "loop"
// param. `playback_update` fires continuously while attached; whenever
// it reports paused while we still want sound on, calling play() again
// restarts the preview from the top, which is what makes the 30s clip
// read as looping instead of just stopping once. `isBuffering` guards
// against re-triggering play() during the embed's own loading state.
export function SoundToggle() {
  const [on, setOn] = useState(
    () => typeof window !== 'undefined' && window.localStorage.getItem(STORAGE_KEY) === '1',
  )
  const onRef = useRef(on)
  onRef.current = on
  const containerRef = useRef<HTMLDivElement>(null)
  const controllerRef = useRef<SpotifyEmbedController | null>(null)
  const pendingPlayRef = useRef(false)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, on ? '1' : '0')
  }, [on])

  useEffect(() => {
    window.onSpotifyIframeApiReady = (IFrameAPI) => {
      if (!containerRef.current) return
      IFrameAPI.createController(
        containerRef.current,
        { uri: SPOTIFY_TRACK_URI, width: '1', height: '1' },
        (controller) => {
          controllerRef.current = controller
          controller.addListener('playback_update', (e) => {
            if (onRef.current && e.data.isPaused && !e.data.isBuffering) {
              controller.play()
            }
          })
          // Remembered "on" from a previous visit -- browsers block audio
          // autoplay without a fresh gesture, so this only succeeds if the
          // browser's own autoplay heuristics allow it; otherwise it's a
          // no-op until the toggle is clicked again.
          if (pendingPlayRef.current) controller.play()
        },
      )
    }

    if (!document.getElementById(API_SCRIPT_ID)) {
      const script = document.createElement('script')
      script.id = API_SCRIPT_ID
      script.src = 'https://open.spotify.com/embed/iframe-api/v1'
      script.async = true
      document.body.appendChild(script)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toggle = () => {
    setOn((prev) => {
      const next = !prev
      if (controllerRef.current) {
        next ? controllerRef.current.play() : controllerRef.current.pause()
      } else {
        pendingPlayRef.current = next
      }
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

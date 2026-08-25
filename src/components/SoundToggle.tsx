import { useEffect, useRef, useState } from 'react'

const SPOTIFY_PLAYLIST_URI = 'spotify:playlist:2O1ebV43TEvyCbBXZc9fwG'
const STORAGE_KEY = 'jaypeg-sound-on'
const API_SCRIPT_ID = 'spotify-iframe-api'

interface SpotifyEmbedController {
  play: () => void
  pause: () => void
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

// A plain `<iframe src=".../embed/...">` has no way to be told to play --
// the `autoplay` query param does nothing (confirmed directly: the embed
// loaded fine but sat on its own paused "Play" button, unreachable since
// the iframe is hidden for exactly this reason -- no visible player UI).
// Spotify's real fix for "control playback from the host page" is this
// official IFrame API: it injects its own iframe into `containerRef`
// and hands back a controller object with real play()/pause() methods
// driven via postMessage, which the toggle calls directly.
export function SoundToggle() {
  const [on, setOn] = useState(
    () => typeof window !== 'undefined' && window.localStorage.getItem(STORAGE_KEY) === '1',
  )
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
        { uri: SPOTIFY_PLAYLIST_URI, width: '1', height: '1' },
        (controller) => {
          controllerRef.current = controller
          // Remembered "on" from a previous visit -- browsers block
          // audio autoplay without a fresh gesture, so this only
          // succeeds if the browser's own autoplay heuristics allow it;
          // otherwise it's a no-op until the toggle is clicked again.
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
        // API/controller hasn't finished loading yet -- flag it so the
        // createController callback above plays as soon as it's ready,
        // still within the same click's gesture window.
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

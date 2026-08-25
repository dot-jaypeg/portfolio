import { useEffect, useRef, useState } from 'react'

const SPOTIFY_TRACK_URI = 'spotify:track:3EeD6nR6WDj5kI54SvR9Ph'
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

// Always starts "Off", never restored from a previous visit -- browsers
// block audio autoplay without a fresh gesture, so pre-setting this to
// "On" from a remembered preference produced a real bug: the label said
// On while nothing was actually playing, since the page-load attempt to
// resume was silently blocked. Only a genuine click can start playback,
// so the label only ever flips once that click has actually happened.
//
// Anonymous/non-Premium Spotify sessions only get a 30-second preview of
// a track, then the embed just pauses -- there's no official "loop"
// param. `playback_update` fires continuously while attached; whenever
// it reports paused while we still want sound on, calling play() again
// restarts the preview from the top. Note this restart is NOT gapless --
// every restart re-buffers the preview from Spotify's servers, so there's
// an audible blip each time it loops. That's an inherent limit of trying
// to loop a preview-only embed, not something fixable from this side.
export function SoundToggle() {
  const [on, setOn] = useState(false)
  const onRef = useRef(on)
  onRef.current = on
  const containerRef = useRef<HTMLDivElement>(null)
  const controllerRef = useRef<SpotifyEmbedController | null>(null)
  // Covers the narrow window where someone clicks the toggle before the
  // Spotify API script has finished loading and handed back a
  // controller -- a real (if rare) race, distinct from the reload case
  // above since this one DOES follow a genuine click.
  const pendingRef = useRef<boolean | null>(null)

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
          if (pendingRef.current != null) {
            controller[pendingRef.current ? 'play' : 'pause']()
          }
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
  }, [])

  const toggle = () => {
    setOn((prev) => {
      const next = !prev
      if (controllerRef.current) controllerRef.current[next ? 'play' : 'pause']()
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

import { useEffect, useState } from 'react'

const SPOTIFY_PLAYLIST_ID = '2O1ebV43TEvyCbBXZc9fwG'
const STORAGE_KEY = 'jaypeg-sound-on'

// No visible player, no play/pause/skip controls -- the iframe is
// mounted off-screen (non-zero size so it isn't display:none-throttled,
// but invisible and unreachable) purely to host Spotify's own audio
// element. `autoplay=1` in the embed src plus mounting it only on the
// click that turns sound on is what actually gets it playing: browsers
// block unmuted audio autoplay without a preceding user gesture, and
// this toggle click IS that gesture. Turning it off unmounts the
// iframe entirely, which is the cleanest way to stop Spotify's playback.
export function SoundToggle() {
  const [on, setOn] = useState(
    () => typeof window !== 'undefined' && window.localStorage.getItem(STORAGE_KEY) === '1',
  )

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, on ? '1' : '0')
  }, [on])

  return (
    <>
      <button
        type="button"
        onClick={() => setOn((v) => !v)}
        className="font-body text-xs tracking-[0.14em] text-cream/70 uppercase transition-colors hover:text-teal"
      >
        Sound: {on ? 'On' : 'Off'}
      </button>
      {on && (
        <iframe
          title="Background music"
          src={`https://open.spotify.com/embed/playlist/${SPOTIFY_PLAYLIST_ID}?utm_source=generator&theme=0&autoplay=1`}
          allow="autoplay; encrypted-media"
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            width: 1,
            height: 1,
            opacity: 0,
            pointerEvents: 'none',
            border: 0,
          }}
        />
      )}
    </>
  )
}

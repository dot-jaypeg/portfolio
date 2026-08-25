import { useEffect, useRef, useState } from 'react'

// Drop audio files into public/audio/ and list them here in play order --
// paths are relative to the site root since anything in public/ is
// served as-is. Looping a single track is simplest (native `loop`
// attribute); with more than one, `onEnded` advances to the next and
// wraps back to the first once the array is exhausted.
const TRACKS = ['/audio/track-1.mp3']
const STORAGE_KEY = 'jaypeg-sound-on'

export function SoundToggle() {
  const [on, setOn] = useState(
    () => typeof window !== 'undefined' && window.localStorage.getItem(STORAGE_KEY) === '1',
  )
  const audioRef = useRef<HTMLAudioElement>(null)
  const trackIndexRef = useRef(0)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, on ? '1' : '0')
  }, [on])

  useEffect(() => {
    // Remembered "on" from a previous visit -- browsers block audio
    // autoplay without a fresh gesture, so this only succeeds if the
    // browser's own autoplay heuristics allow it; otherwise it stays
    // paused until the toggle is clicked again.
    if (on) audioRef.current?.play().catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toggle = () => {
    setOn((prev) => {
      const next = !prev
      const audio = audioRef.current
      if (audio) {
        if (next) audio.play().catch(() => {})
        else audio.pause()
      }
      return next
    })
  }

  const handleEnded = () => {
    if (TRACKS.length < 2) return
    trackIndexRef.current = (trackIndexRef.current + 1) % TRACKS.length
    const audio = audioRef.current
    if (!audio) return
    audio.src = TRACKS[trackIndexRef.current]
    audio.play().catch(() => {})
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
      <audio
        ref={audioRef}
        src={TRACKS[0]}
        loop={TRACKS.length === 1}
        onEnded={handleEnded}
        preload="auto"
      />
    </>
  )
}

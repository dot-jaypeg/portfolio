import { useState } from 'react'

const SPOTIFY_PLAYLIST_ID = '1FRkdpOy13rY5Pj4m4EjQf'

export function SpotifyPlayer() {
  const [open, setOpen] = useState(false)

  return (
    <div className="fixed right-8 bottom-8 z-40 md:right-16 md:bottom-16">
      {open ? (
        <div className="w-72 overflow-hidden border border-cream/20 bg-ink shadow-lg">
          <iframe
            title="Spotify playlist"
            src={`https://open.spotify.com/embed/playlist/${SPOTIFY_PLAYLIST_ID}?utm_source=generator&theme=0`}
            width="100%"
            height="152"
            style={{ border: 0, display: 'block' }}
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          />
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="font-body w-full border-t border-cream/10 py-2 text-[10px] tracking-[0.22em] text-cream/50 uppercase transition-colors hover:text-cream"
          >
            (Hide)
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="font-body border border-cream/20 bg-ink/80 px-4 py-2 text-xs tracking-[0.22em] text-cream/70 uppercase backdrop-blur-sm transition-colors hover:text-cream"
        >
          (Listen)
        </button>
      )}
    </div>
  )
}

const NOISE_SVG = `<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`

export function Grain() {
  return (
    <div
      className="grain-layer pointer-events-none fixed inset-[-10%] z-[80] opacity-[0.07] mix-blend-overlay"
      style={{
        backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(NOISE_SVG)}")`,
        backgroundSize: '100px 100px',
      }}
    />
  )
}

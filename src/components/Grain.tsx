// Raw feTurbulence output is a soft, low-contrast gray haze -- barely
// perceptible even at high opacity. The feColorMatrix flattens it to
// monochrome and the feComponentTransfer punches up the contrast (slope
// > 1, intercept pivoted around mid-gray) so it reads as visible grain
// instead of a fog.
const NOISE_SVG = `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'>
  <filter id='n'>
    <feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch' result='noise'/>
    <feColorMatrix in='noise' type='matrix' values='0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 1 0' result='mono'/>
    <feComponentTransfer in='mono'>
      <feFuncR type='linear' slope='2.6' intercept='-0.8'/>
      <feFuncG type='linear' slope='2.6' intercept='-0.8'/>
      <feFuncB type='linear' slope='2.6' intercept='-0.8'/>
    </feComponentTransfer>
  </filter>
  <rect width='100%' height='100%' filter='url(#n)'/>
</svg>`

export function Grain() {
  return (
    // Plain alpha compositing (no mix-blend class) -- the noise map has
    // both dark and light flecks, and normal blending shows both equally
    // regardless of what's underneath, so the same grain reads the same
    // way on ink as it does on cream/orange-red instead of one blend
    // mode favoring one side.
    <div
      className="grain-layer pointer-events-none fixed inset-[-10%] z-[80] opacity-[0.4]"
      style={{
        backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(NOISE_SVG)}")`,
        backgroundSize: '70px 70px',
      }}
    />
  )
}

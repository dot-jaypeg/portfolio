// Raw feTurbulence output is a soft, low-contrast gray haze -- barely
// perceptible even at high opacity. The feColorMatrix flattens it to
// monochrome and the feComponentTransfer punches up the contrast. The
// intercept is pivoted so mid-gray (0.5) maps to ~0 rather than staying
// at 0.5 -- that skews most of the noise toward black, leaving only the
// brightest turbulence peaks as visible flecks. That skew matters once
// combined with mix-blend-multiply below: a multiply layer's near-white
// pixels are no-ops (white * anything = anything), so a noise map that's
// mostly bright would barely register. A mostly-dark map is what actually
// reads as grain under multiply.
const NOISE_SVG = `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'>
  <filter id='n'>
    <feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch' result='noise'/>
    <feColorMatrix in='noise' type='matrix' values='0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 1 0' result='mono'/>
    <feComponentTransfer in='mono'>
      <feFuncR type='linear' slope='3' intercept='-1.5'/>
      <feFuncG type='linear' slope='3' intercept='-1.5'/>
      <feFuncB type='linear' slope='3' intercept='-1.5'/>
    </feComponentTransfer>
  </filter>
  <rect width='100%' height='100%' filter='url(#n)'/>
</svg>`

export function Grain() {
  return (
    // mix-blend-multiply always darkens, never lightens -- which is what
    // "grain" should mean on an inky background (deepens it slightly,
    // never washes it out with bright specks) while still reading as
    // strong, visible texture on the light/cream and orange-red sections
    // multiply has plenty of contrast to darken against. Plain alpha
    // compositing (the previous approach) added light specks on dark
    // backgrounds that looked like dust rather than film grain.
    <div
      className="grain-layer pointer-events-none fixed inset-[-10%] z-[80] opacity-[0.55] mix-blend-multiply"
      style={{
        backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(NOISE_SVG)}")`,
        backgroundSize: '70px 70px',
      }}
    />
  )
}

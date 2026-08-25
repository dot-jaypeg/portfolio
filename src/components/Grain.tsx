// Raw feTurbulence output is a soft, low-contrast gray haze -- barely
// perceptible even at high opacity. The feColorMatrix flattens it to
// monochrome and the feComponentTransfer punches up the contrast. The
// intercept is pivoted so mid-gray maps to ~0 rather than staying at
// 0.5 -- that skews most of the noise toward black, leaving only the
// brightest turbulence peaks as visible flecks. That skew matters
// because of mix-blend-multiply below: multiply's near-white pixels are
// no-ops (white * anything = anything), so a mostly-bright noise map
// would barely register -- a mostly-dark map is what actually darkens.
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
    // Plain alpha compositing put visible light flecks on top of ink --
    // technically "grain," but it broke the illusion of ink being a
    // solid, deep color, since those flecks read as dust sitting on
    // top rather than texture within the color. mix-blend-multiply only
    // ever darkens what's underneath, never lightens it, so ink stays
    // ink (just subtly textured) exactly the way cream and orange-red
    // already do under the same blend mode -- one mechanism, consistent
    // everywhere, instead of normal blending's light-specks-on-dark problem.
    <div
      className="grain-layer pointer-events-none fixed inset-[-10%] z-[80] opacity-[0.5] mix-blend-multiply"
      style={{
        backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(NOISE_SVG)}")`,
        backgroundSize: '70px 70px',
      }}
    />
  )
}

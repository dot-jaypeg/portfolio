// Raw feTurbulence output is a soft, low-contrast gray haze -- barely
// perceptible even at high opacity. The feColorMatrix flattens it to
// monochrome and the feComponentTransfer punches up the contrast
// (slope > 1, negative intercept pushes mid-gray toward black/white
// extremes), which is what actually makes it read as visible grain
// instead of a fog.
const NOISE_SVG = `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'>
  <filter id='n'>
    <feTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch' result='noise'/>
    <feColorMatrix in='noise' type='matrix' values='0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 1 0' result='mono'/>
    <feComponentTransfer in='mono'>
      <feFuncR type='linear' slope='2.4' intercept='-0.7'/>
      <feFuncG type='linear' slope='2.4' intercept='-0.7'/>
      <feFuncB type='linear' slope='2.4' intercept='-0.7'/>
    </feComponentTransfer>
  </filter>
  <rect width='100%' height='100%' filter='url(#n)'/>
</svg>`

export function Grain() {
  return (
    // mix-blend-overlay was the wrong call here: overlay's math has almost
    // no visible effect on bases that are already near-black or near-white,
    // which is exactly what this site's sections are -- so the grain was
    // invisible everywhere it mattered. Normal blending (no mix-blend class)
    // just alpha-composites the noise on top, which reads consistently at
    // both extremes: light flecks show against the dark sections, dark
    // flecks show against the light ones.
    <div
      className="grain-layer pointer-events-none fixed inset-[-10%] z-[80] opacity-[0.07]"
      style={{
        backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(NOISE_SVG)}")`,
        backgroundSize: '120px 120px',
      }}
    />
  )
}

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

// Mirror image of the map above: intercept/slope flipped so the pivot
// pushes most pixels toward white instead of black, leaving only the
// darkest turbulence troughs as visible flecks. Paired with
// mix-blend-screen (screen's near-white pixels are the no-ops, exact
// opposite of multiply's near-black no-ops), this is what actually adds
// visible texture on top of a dark background -- the multiply layer
// above darkens light backgrounds nicely but is nearly inert on ink
// (near-black * anything stays near-black), so ink needed its own layer
// that lightens instead. A different tile size than the multiply layer
// keeps the two noise patterns from lining up into a moire grid.
const NOISE_SVG_BRIGHT = `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'>
  <filter id='n'>
    <feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch' result='noise'/>
    <feColorMatrix in='noise' type='matrix' values='0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 1 0' result='mono'/>
    <feComponentTransfer in='mono'>
      <feFuncR type='linear' slope='-3' intercept='2.5'/>
      <feFuncG type='linear' slope='-3' intercept='2.5'/>
      <feFuncB type='linear' slope='-3' intercept='2.5'/>
    </feComponentTransfer>
  </filter>
  <rect width='100%' height='100%' filter='url(#n)'/>
</svg>`

export function Grain() {
  return (
    <>
      {/* mix-blend-multiply always darkens, never lightens -- which is
          what "grain" should mean on the light/cream and orange-red
          sections (reads as strong, visible texture) while staying
          subtle on ink (near-black * anything stays near-black). */}
      <div
        className="grain-layer pointer-events-none fixed inset-[-10%] z-[80] opacity-[0.55] mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(NOISE_SVG)}")`,
          backgroundSize: '70px 70px',
        }}
      />
      {/* mix-blend-screen is multiply's mirror -- always lightens, never
          darkens -- so it's the layer that actually shows up as texture
          on ink, while staying nearly inert on the already-bright cream
          background (screen against near-white stays near-white). */}
      <div
        className="grain-layer-screen pointer-events-none fixed inset-[-10%] z-[80] opacity-[0.4] mix-blend-screen"
        style={{
          backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(NOISE_SVG_BRIGHT)}")`,
          backgroundSize: '85px 85px',
        }}
      />
    </>
  )
}

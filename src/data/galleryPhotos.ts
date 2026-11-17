import type { ProjectImage } from './projects'

export type GalleryCategory = 'event-sports' | 'graduation' | 'landscape-natural'

export interface GalleryPhoto extends ProjectImage {
  category: GalleryCategory
}

const CATEGORY_ALT: Record<GalleryCategory, string> = {
  'event-sports': 'Event and sports photography',
  graduation: 'Graduation portrait photography',
  'landscape-natural': 'Landscape and nature photography',
}

// The reader-facing name for each category -- shown in the gallery's
// click-to-expand view (see MoodboardCanvas).
export const CATEGORY_LABEL: Record<GalleryCategory, string> = {
  'event-sports': 'Events & Sports',
  graduation: 'Graduation',
  'landscape-natural': 'Natural & Landscape',
}

// Eagerly imports every optimized photo under assets/images/gallery/<category>/
// -- avoids one hand-written import per photo (111 of them, and counting as
// more get dropped into those folders).
const MODULES = import.meta.glob('../assets/images/gallery/*/*.jpg', {
  eager: true,
  import: 'default',
}) as Record<string, string>

// width/height per photo, keyed by "<category>/<file>" -- from the same
// resize pass that produced the files above, so the canvas can reserve each
// tile's aspect-ratio before the real image loads (same as every other
// ProjectImage).
const DIMENSIONS: Record<string, [number, number]> = {
  'event-sports/51752114275_d284744be0_o.jpg': [1400, 933],
  'event-sports/51878310196_c7773c005c_o.jpg': [933, 1400],
  'event-sports/51878996830_bb7f61d5ff_o-1.jpg': [933, 1400],
  'event-sports/51878997010_e0ac8a45ae_o.jpg': [933, 1400],
  'event-sports/apida_2026-117.jpg': [933, 1400],
  'event-sports/apida_2026-120.jpg': [933, 1400],
  'event-sports/apida_2026-211.jpg': [933, 1400],
  'event-sports/apida_2026-212.jpg': [933, 1400],
  'event-sports/apida_2026-215.jpg': [933, 1400],
  'event-sports/apida_2026-225.jpg': [933, 1400],
  'event-sports/apida_2026-27.jpg': [1400, 933],
  'event-sports/apida_2026-29.jpg': [1400, 933],
  'event-sports/apida_2026-330.jpg': [1400, 933],
  'event-sports/apida_2026-410.jpg': [1400, 933],
  'event-sports/apida_2026-425.jpg': [933, 1400],
  'event-sports/apida_2026-459.jpg': [1400, 933],
  'event-sports/apida_2026-52.jpg': [933, 1400],
  'event-sports/apida_2026-93.jpg': [933, 1400],
  'event-sports/img_5952.jpg': [933, 1400],
  'event-sports/img_9088-2.jpg': [933, 1400],
  'event-sports/img_9136-3.jpg': [933, 1400],
  'event-sports/img_9360-4.jpg': [933, 1400],
  'event-sports/nsu_culturenight-10.jpg': [933, 1400],
  'event-sports/ramirez_nsuyim_tourney_2024-15.jpg': [933, 1400],
  'graduation/fumi_gradphotos_2026-134.jpg': [933, 1400],
  'graduation/fumi_gradphotos_2026-21.jpg': [933, 1400],
  'graduation/fumi_gradphotos_2026-28.jpg': [933, 1400],
  'graduation/fumi_gradphotos_2026-51.jpg': [933, 1400],
  'graduation/fumi_gradphotos_2026-54.jpg': [1400, 933],
  'graduation/fumi_gradphotos_2026-91.jpg': [933, 1400],
  'graduation/fumi_gradphotos_2026-94.jpg': [1400, 933],
  'graduation/group_grad2026-32.jpg': [933, 1400],
  'graduation/img_9453.jpg': [1400, 933],
  'graduation/img_9501.jpg': [1400, 933],
  'graduation/img_9518.jpg': [1400, 933],
  'graduation/img_9531.jpg': [933, 1400],
  'graduation/img_9577.jpg': [933, 1400],
  'graduation/img_9587.jpg': [933, 1400],
  'graduation/img_9608.jpg': [933, 1400],
  'graduation/img_9630.jpg': [933, 1400],
  'graduation/img_9761.jpg': [1400, 933],
  'graduation/izzy_grad2026-10.jpg': [933, 1400],
  'graduation/izzy_grad2026-15.jpg': [933, 1400],
  'graduation/izzy_grad2026-19.jpg': [933, 1400],
  'graduation/izzy_gradphotos_2026-11.jpg': [933, 1400],
  'graduation/izzy_gradphotos_2026-29.jpg': [933, 1400],
  'graduation/izzy_gradphotos_2026-9.jpg': [933, 1400],
  'graduation/katieanddevon_grad2026-121.jpg': [933, 1400],
  'graduation/katieanddevon_grad2026-125.jpg': [933, 1400],
  'graduation/katieanddevon_grad2026-146.jpg': [1400, 933],
  'graduation/katieanddevon_grad2026-163.jpg': [933, 1400],
  'graduation/katieanddevon_grad2026-170.jpg': [933, 1400],
  'graduation/katieanddevon_grad2026-184.jpg': [933, 1400],
  'graduation/katieanddevon_grad2026-37.jpg': [933, 1400],
  'graduation/katieanddevon_grad2026-50.jpg': [933, 1400],
  'graduation/katieanddevon_grad2026-76.jpg': [933, 1400],
  'graduation/katieanddevon_grad2026-9.jpg': [933, 1400],
  'graduation/kristen_grad2026-18.jpg': [933, 1400],
  'graduation/kristen_grad2026-32.jpg': [933, 1400],
  'graduation/kristen_grad2026-56.jpg': [933, 1400],
  'graduation/kristen_grad2026-7.jpg': [933, 1400],
  'graduation/lindsey_grad2026-12.jpg': [933, 1400],
  'graduation/lindsey_grad2026-15.jpg': [933, 1400],
  'graduation/lindsey_grad2026-24.jpg': [933, 1400],
  'graduation/lindsey_grad2026-36.jpg': [933, 1400],
  'graduation/lindsey_grad2026-38.jpg': [933, 1400],
  'graduation/lindsey_gradphotos_2026-18.jpg': [933, 1400],
  'graduation/lindsey_gradphotos_2026-39.jpg': [1400, 933],
  'graduation/lindsey_huntington2026-13.jpg': [933, 1400],
  'graduation/lindsey_huntington2026-23.jpg': [1400, 933],
  'graduation/lindsey_huntington2026-24.jpg': [1400, 933],
  'graduation/lindsey_huntington2026-3.jpg': [933, 1400],
  'graduation/lindsey_huntington2026-4.jpg': [1400, 933],
  'graduation/lindsey_huntington2026-9.jpg': [933, 1400],
  'landscape-natural/anemone.jpg': [1400, 933],
  'landscape-natural/bee.jpg': [1400, 786],
  'landscape-natural/bird.jpg': [934, 1400],
  'landscape-natural/huntington_bird-2.jpg': [933, 1400],
  'landscape-natural/huntington_bird-5.jpg': [1400, 1050],
  'landscape-natural/huntington_bird-6.jpg': [933, 1400],
  'landscape-natural/huntington_bird-9.jpg': [933, 1400],
  'landscape-natural/huntington_chinesegarden.jpg': [1400, 933],
  'landscape-natural/huntington_chinesegarden-2.jpg': [1400, 933],
  'landscape-natural/huntington_chinesegarden-4.jpg': [1400, 933],
  'landscape-natural/huntington_chinesegarden-5.jpg': [1400, 933],
  'landscape-natural/img_8131.jpg': [1400, 928],
  'landscape-natural/img_8155.jpg': [1400, 928],
  'landscape-natural/img_8177.jpg': [928, 1400],
  'landscape-natural/img_8191.jpg': [928, 1400],
  'landscape-natural/img_8192.jpg': [928, 1400],
  'landscape-natural/jayden-ramirez-spider-macro-photography.jpg': [1400, 786],
  'landscape-natural/nsu_fallretreat_2025-78.jpg': [933, 1400],
  'landscape-natural/nsu_fallretreat_2025-79.jpg': [1400, 933],
  'landscape-natural/nsu_incbeachdayl_2025-141.jpg': [1400, 933],
  'landscape-natural/nsu_incbeachdayl_2025-201.jpg': [933, 1400],
  'landscape-natural/nsu_springretreat_2026-147.jpg': [933, 1400],
  'landscape-natural/nsu_springretreat_2026-243.jpg': [1400, 933],
  'landscape-natural/rome_photos_2-152.jpg': [933, 1400],
  'landscape-natural/rome_photos_2-154.jpg': [933, 1400],
  'landscape-natural/rome_photos_2-231.jpg': [933, 1400],
  'landscape-natural/rome_photos_2-237.jpg': [1400, 933],
  'landscape-natural/rome_photos_2-63.jpg': [1400, 933],
  'landscape-natural/rome_photos_2-70.jpg': [933, 1400],
  'landscape-natural/rome_photos_2-76.jpg': [933, 1400],
  'landscape-natural/rome_photos_digital-45.jpg': [933, 1400],
  'landscape-natural/rome_photos_digital-71.jpg': [933, 1400],
  'landscape-natural/sf.jpg': [933, 1400],
  'landscape-natural/sharkfin_fakebioluminescence.jpg': [1400, 933],
  'landscape-natural/surfing.jpg': [933, 1400],
  'landscape-natural/vyc_storephotos-17.jpg': [933, 1400],
  'landscape-natural/vyc_storephotos-53.jpg': [933, 1400],
}

export const GALLERY_PHOTOS: GalleryPhoto[] = Object.entries(DIMENSIONS).map(([key, [width, height]]) => {
  const category = key.split('/')[0] as GalleryCategory
  const modulePath = `../assets/images/gallery/${key}`
  return {
    src: MODULES[modulePath],
    alt: CATEGORY_ALT[category],
    type: 'image',
    width,
    height,
    category,
  }
})

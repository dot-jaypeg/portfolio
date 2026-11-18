import contraImg from '../assets/images/projects/contra-coffee-sticker-pack.jpg'
import afiImg from '../assets/images/projects/afi-marketing-campaign.jpg'
import resonanceImg from '../assets/images/projects/ui-design-for-resonance.jpg'
import nsuImg from '../assets/images/projects/nikkei-student-union.jpg'
import fetchImg from '../assets/images/projects/fetch-doggy-deli.jpg'
import urbanSeoulImg from '../assets/images/projects/urbanseoul.jpg'
import jadeSwordImg from '../assets/images/projects/jade-sword.jpg'
import bagguImg from '../assets/images/projects/baggu.jpg'
import chichaImg from '../assets/images/projects/chicha.jpg'
import protocolOfBetrayalImg from '../assets/images/projects/star-wars.jpg'

import nsuWorkVideo from '../assets/images/projects/work-covers/nsu-work.mp4'
import nsuWorkPoster from '../assets/images/projects/work-covers/nsu-work-poster.jpg'
import chichaWorkVideo from '../assets/images/projects/work-covers/chicha-work.mp4'
import chichaWorkPoster from '../assets/images/projects/work-covers/chicha-work-poster.jpg'
import protocolWorkVideo from '../assets/images/projects/work-covers/protocol-of-betrayal-work.mp4'
import protocolWorkPoster from '../assets/images/projects/work-covers/protocol-of-betrayal-work-poster.jpg'
import fetchWorkImg from '../assets/images/projects/work-covers/fetch-work.jpg'
import afiWorkVideo from '../assets/images/projects/work-covers/afi-work.mp4'
import afiWorkPoster from '../assets/images/projects/work-covers/afi-work-poster.jpg'

export interface CaseStudy {
  slug: string
  title: string
  category: string
  description: string
  // Shown in the chapter eyebrow as "0N — {client}" in place of a flat
  // "Work" label -- the industry/organization the project was for.
  client: string
  // Optional -- cases without a real photo yet fall back to the
  // dashed placeholder box in WorkPanel.
  image?: string
  // The cover image's own real pixel dimensions -- WorkGrid's masonry
  // wall sizes each tile from these directly (no cropping, see
  // ProjectCard), so it needs the real ratio up front the same way
  // every other image-with-a-box on the site already declares one.
  // When `workCoverVideo`/`workCoverImage` below is set, these describe
  // THAT asset's own dimensions instead of `image`'s.
  coverWidth?: number
  coverHeight?: number
  // /work-page-only overrides, same scoping convention as
  // `workImagePosition` below -- everywhere else that reads `image`
  // (WorkPanel, MoreProjects) keeps showing the original cover
  // untouched. `workCoverVideo` wins when set (rendered autoplay/
  // muted/loop, `workCoverPoster` as its poster frame); otherwise
  // `workCoverImage ?? image` renders as a plain <img>.
  workCoverVideo?: string
  workCoverPoster?: string
  workCoverImage?: string
  // Optional override for the parallax swing's amount/oversize (see
  // JourneyDesktop's `data-parallax-amount`) -- defaults to 8. A photo
  // whose subject sits close to its own edges (little disposable
  // margin) needs a smaller amount than an abstract placeholder box
  // does, or the swing's oversize crops into real content.
  imageParallax?: number
  // Optional CSS object-position override -- defaults to 'center'.
  // A wide/off-center source photo can need this to keep the meaningful
  // subject in frame once object-cover crops it into the 4:5 box.
  imagePosition?: string
  // Optional object-position override just for the "More Work" grid at
  // the bottom of a project detail page (see MoreProjects.tsx), whose
  // thumbnail box is a different aspect ratio (4:3) than wherever else
  // `imagePosition` applies -- the same source crop that's right for
  // one box can clip the wrong thing in the other (confirmed directly:
  // Resonance needs its character kept in frame elsewhere but its
  // wordmark kept in frame here, which the one shared value can't do
  // for both at once). Falls back to `imagePosition ?? 'center'`.
  moreWorkImagePosition?: string
  // Optional object-position override just for the /work listing page's
  // own thumbnail (see ProjectCard.tsx), whose box is yet another
  // aspect ratio (alternating 4:3/3:2) than either `imagePosition` or
  // `moreWorkImagePosition` apply to. Falls back to
  // `imagePosition ?? 'center'`.
  workImagePosition?: string
  // Optional hex accent -- colors the category label and the pull-quote
  // mark in WorkPanel with THIS project's own palette instead of the
  // site's default teal/red alternation, so each case study is
  // color-coordinated to its actual brand/work rather than an arbitrary
  // index-based rotation. Falls back to the site's teal when absent.
  accent?: string
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: 'contra-coffee-sticker-pack',
    title: 'Contra Coffee Sticker Pack',
    category: 'Illustration',
    client: 'Contra Coffee & Tea',
    image: contraImg,
    coverWidth: 1067,
    coverHeight: 1600,
    accent: '#9cc7b1',
    description:
      'A cohesive collection for Contra Coffee & Tea designed to function as their Spring Y2K Merch Drop.',
  },
  {
    slug: 'afi-marketing-campaign',
    title: 'AFI Marketing Campaign',
    category: 'Digital Marketing',
    client: 'Velvet Hammer Music',
    image: afiImg,
    coverWidth: 608,
    coverHeight: 1080,
    workCoverVideo: afiWorkVideo,
    workCoverPoster: afiWorkPoster,
    accent: '#e6869a',
    // Tall portrait shot with the face near the top -- the default
    // vertical center crop lands on the guitar/torso instead.
    moreWorkImagePosition: 'center top',
    workImagePosition: 'center top',
    description:
      'To launch AFI’s single Holy Visions and the relaunch of their fan club, Despair Faction, new DF membership cards were paired with digital tarot cards and a collectible physical card series.',
  },
  {
    slug: 'ui-design-for-resonance',
    title: 'UI Design for Resonance',
    category: 'UX/UI & HUD',
    client: 'Chapman University',
    image: resonanceImg,
    coverWidth: 1600,
    coverHeight: 900,
    accent: '#49e1f6',
    // Source is a wide 16:9 banner with the wordmark on the left and the
    // character on the right -- centering it (the default) crops half
    // of each. Biasing all the way right keeps just the character.
    imagePosition: 'right center',
    // The More Work grid's narrower 4:3 box crops even tighter -- here
    // the wordmark is the one worth keeping in frame instead.
    moreWorkImagePosition: 'left center',
    // Same reasoning as moreWorkImagePosition -- the /work listing's
    // own thumbnail box should keep the wordmark in frame too.
    workImagePosition: 'left center',
    description:
      'Twelve fighters. One arena that listens. Branding, UI, and HUD design for Resonance.',
  },
  {
    slug: 'nikkei-student-union',
    title: 'Nikkei Student Union',
    category: 'Photo & Merchandising',
    client: 'Chapman University',
    image: nsuImg,
    coverWidth: 960,
    coverHeight: 540,
    workCoverVideo: nsuWorkVideo,
    workCoverPoster: nsuWorkPoster,
    accent: '#b52025',
    // The shirt photo is a tall 2:3 crop inside a 4:5 box -- the default
    // 8% swing oversize was cropping into the shirt itself (collar/hem),
    // not just background, since there's little vertical margin to
    // spare. A smaller amount leaves the whole shirt visible.
    imageParallax: 3,
    description:
      'Creative lead for Chapman University’s Nikkei Student Union, shaping the organization’s visual identity and promoting Japanese-American culture through promotional videos, custom merchandise, flyers, and social media graphics.',
  },
  {
    slug: 'fetch-doggy-deli',
    title: 'fetch! doggy deli',
    category: 'Branding & Advertising',
    client: 'Academic',
    image: fetchImg,
    coverWidth: 1600,
    coverHeight: 1398,
    workCoverImage: fetchWorkImg,
    accent: '#45815a',
    description:
      'A dog-friendly deli food truck for SoCal parks, fetch! doggy deli is a concept built end to end, from the name and mark to packaging, menus, and a truck wrap, with a playful brand voice and natural, local ingredients made for dogs.',
  },
  {
    slug: 'urban-seoul',
    title: 'urbanseoul. x New Balance Festival',
    category: 'Branding & Advertising',
    client: 'New Balance',
    image: urbanSeoulImg,
    coverWidth: 901,
    coverHeight: 1600,
    accent: '#4f6f93',
    description:
      'An immersive Korean R&B festival presented by New Balance at Under the K Bridge Park in Brooklyn, urbanseoul. blends New Balance’s bold, vintage sports photography with KRNB’s sleek, neon-accented urban style, turning live music and sneaker culture into one lifestyle hub.',
  },
  {
    slug: 'jade-sword',
    title: 'Jade Sword',
    category: 'Character Illustration',
    client: 'Personal Project',
    image: jadeSwordImg,
    coverWidth: 1600,
    coverHeight: 1066,
    accent: '#2f9e8f',
    description:
      'A stylized 3D jade sword inspired by Genshin Impact and ceremonial jade weapons, modeled and textured in Maya as a game-ready asset.',
  },
  {
    slug: 'baggu',
    title: 'Baggu Surface Patterns',
    category: 'Surface Pattern Design',
    client: 'Baggu',
    image: bagguImg,
    coverWidth: 1600,
    coverHeight: 1112,
    accent: '#8b5cf6',
    description:
      'A set of playful, trend-driven surface patterns designed for Baggu\'s tote and pouch lineup.',
  },
  {
    slug: 'chi-cha',
    title: 'Chi-Cha Beverage Campaign',
    category: 'Digital Marketing',
    client: 'Chi-Cha',
    image: chichaImg,
    coverWidth: 720,
    coverHeight: 720,
    workCoverVideo: chichaWorkVideo,
    workCoverPoster: chichaWorkPoster,
    accent: '#e391a8',
    description:
      'A retro-arcade-themed digital push for Chi-Cha -- display ads, social posts, and a direct mailer all built around one playful visual world.',
  },
  {
    slug: 'protocol-of-betrayal',
    title: 'Protocol of Betrayal',
    category: '3D & Motion',
    client: 'Personal Project',
    image: protocolOfBetrayalImg,
    coverWidth: 854,
    coverHeight: 480,
    workCoverVideo: protocolWorkVideo,
    workCoverPoster: protocolWorkPoster,
    accent: '#c0453a',
    // Source is a 16:9 still with the character off-center to the
    // right -- centering it (the default) crops half of him out.
    imagePosition: 'right center',
    description:
      'A Star Wars-inspired cinematic short, built in Unreal Engine from lighting and environment to the final animated sequence.',
  },
]

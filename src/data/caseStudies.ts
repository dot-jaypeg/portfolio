import contraImg from '../assets/images/projects/contra-coffee-sticker-pack.jpg'
import afiImg from '../assets/images/projects/afi-marketing-campaign.jpg'
import resonanceImg from '../assets/images/projects/ui-design-for-resonance.jpg'
import nsuImg from '../assets/images/projects/nikkei-student-union.jpg'
import fetchImg from '../assets/images/projects/detail/fetch-doggy-deli/cover-wordmark-hero.jpg'
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
  // The project's real cover -- `workCoverVideo` wins when set
  // (rendered autoplay/muted/loop, `workCoverPoster` as its poster
  // frame); otherwise `workCoverImage ?? image` renders as a plain
  // <img>. Read by the /work wall's tile (ProjectCoverMedia) AND the
  // project's own page hero (ProjectHero), so both agree on which
  // asset is "the" cover. WorkPanel and MoreProjects still read
  // `image` directly (their boxes crop into a fixed ratio these
  // work-only assets weren't sized for).
  workCoverVideo?: string
  workCoverPoster?: string
  workCoverImage?: string
  // Opt out of `workCoverVideo` for the hero specifically (the /work
  // tile still plays it) -- for a clip that's fine as a small, muted,
  // easy-to-glance-past loop but reads wrong blown up full-screen as
  // the first thing on the page (confirmed directly: Chi-Cha's work
  // cover has a few candid, non-campaign moments mixed into the loop).
  heroSkipCoverVideo?: boolean
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
    // The photo has a lot of empty headroom above Jayden's head (~30%
    // of the frame is just hedge) -- the default center crop was
    // eating into their legs/feet in shorter boxes well before it ever
    // needed to touch that headroom. Biasing down trades some of that
    // spare background for the rest of them actually being in frame.
    imagePosition: 'center 80%',
    // The "More Work" row's 4:3 box is much shorter than the WorkPanel
    // box imagePosition above was tuned for -- 80% there crops out the
    // face entirely in this shorter box. Confirmed directly: 40% keeps
    // the full face and cap in frame.
    moreWorkImagePosition: 'center 40%',
    accent: '#9cc7b1',
    description:
      'A cohesive collection for Contra Coffee & Tea designed to function as their Spring Y2K Merch Drop.',
  },
  {
    // Renamed from afi-marketing-campaign to match the title change --
    // the old URL now redirects here (see App.tsx) instead of 404ing
    // for anyone who already bookmarked or shared the old link.
    slug: 'velvet-hammer-music',
    title: 'Velvet Hammer Music',
    category: 'Digital Marketing',
    client: 'Velvet Hammer Music',
    image: afiImg,
    coverWidth: 608,
    coverHeight: 1080,
    workCoverVideo: afiWorkVideo,
    workCoverPoster: afiWorkPoster,
    accent: '#e6869a',
    // The Incubus vinyl video is a tall, narrow shot of a record stack
    // + hand -- cropping into a wide 4:3 box needs a position tuned to
    // THIS clip, not the old portrait cover photo this used to be set
    // for (that one wanted the top; this one's subject sits more
    // mid-frame).
    moreWorkImagePosition: 'center 35%',
    description:
      'A digital marketing and creative internship for Velvet Hammer Music Management, supporting Incubus, AFI, Avenged Sevenfold, and Deftones.',
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
    coverWidth: 1750,
    coverHeight: 1529,
    workCoverImage: fetchWorkImg,
    accent: '#45815a',
    description:
      'A cohesive brand identity for fetch!, a specialty food truck dedicated entirely to dogs, serving pup-safe sandwiches and snacks as a dog-friendly deli.',
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
      'A cohesive festival identity for urbanseoul., an immersive Korean R&B music festival presented by New Balance at Under the K Bridge Park in Brooklyn.',
  },
  {
    slug: 'jade-sword',
    title: 'Jade Sword',
    category: '3D Modeling',
    client: 'Personal Project',
    // This is official Genshin Impact character splash art, not
    // Jayden's own render -- flagged directly and kept anyway on his
    // explicit, informed call.
    image: jadeSwordImg,
    coverWidth: 1600,
    coverHeight: 1066,
    accent: '#2f9e8f',
    description:
      'A Genshin Impact-inspired 3D weapon model, created in Autodesk Maya and designed to serve both animation and game design needs.',
  },
  {
    slug: 'baggu',
    title: 'BAGGU x Spiderverse Set',
    category: 'Surface Pattern Design',
    client: 'Baggu',
    image: bagguImg,
    coverWidth: 1600,
    coverHeight: 1112,
    accent: '#8b5cf6',
    description:
      'A back-to-school collection for BAGGU called the "Spiderverse Set," introducing comic and Spider-Man motifs to reusable bags and accessories through vibrant, unique patterns.',
  },
  {
    slug: 'chi-cha',
    title: 'Chi-Cha Beverage Campaign',
    category: 'Branding & Digital Marketing',
    client: 'Chi-Cha',
    image: chichaImg,
    coverWidth: 720,
    coverHeight: 720,
    workCoverVideo: chichaWorkVideo,
    workCoverPoster: chichaWorkPoster,
    heroSkipCoverVideo: true,
    accent: '#e391a8',
    description:
      'A cohesive brand identity and marketing campaign for chi-cha, a Japanese-owned matcha company selling portable juice boxes for an energy boost without the hassle of preparation.',
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
      'A 3D animation built in Unreal Engine, exploring a Star Wars story all its own — a new narrative inside a galaxy far, far away, with a twist nobody sees coming.',
  },
]

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
    accent: '#9cc7b1',
    description:
      'A playful sticker pack designed to extend Contra Coffee\'s brand voice into something collectible and shareable.',
  },
  {
    slug: 'afi-marketing-campaign',
    title: 'AFI Marketing Campaign',
    category: 'Digital Marketing',
    client: 'Velvet Hammer Music',
    image: afiImg,
    accent: '#e6869a',
    // Tall portrait shot with the face near the top -- the default
    // vertical center crop lands on the guitar/torso instead.
    moreWorkImagePosition: 'center top',
    description:
      'A multi-channel marketing push built to get AFI in front of the right audience at the right moment.',
  },
  {
    slug: 'ui-design-for-resonance',
    title: 'UI Design for Resonance',
    category: 'UX/UI & HUD',
    client: 'Chapman University',
    image: resonanceImg,
    accent: '#49e1f6',
    // Source is a wide 16:9 banner with the wordmark on the left and the
    // character on the right -- centering it (the default) crops half
    // of each. Biasing all the way right keeps just the character.
    imagePosition: 'right center',
    // The More Work grid's narrower 4:3 box crops even tighter -- here
    // the wordmark is the one worth keeping in frame instead.
    moreWorkImagePosition: 'left center',
    description:
      'Interface design for Resonance, focused on making a complex product feel simple to actually use.',
  },
  {
    slug: 'nikkei-student-union',
    title: 'Nikkei Student Union',
    category: 'Photo & Merchandising',
    client: 'Chapman University',
    image: nsuImg,
    accent: '#b52025',
    // The shirt photo is a tall 2:3 crop inside a 4:5 box -- the default
    // 8% swing oversize was cropping into the shirt itself (collar/hem),
    // not just background, since there's little vertical margin to
    // spare. A smaller amount leaves the whole shirt visible.
    imageParallax: 3,
    description:
      'A visual identity built to give a student organization a stronger, more unified presence on campus.',
  },
  {
    slug: 'fetch-doggy-deli',
    title: 'fetch! doggy deli',
    category: 'Branding & Advertising',
    client: 'Academic',
    image: fetchImg,
    accent: '#45815a',
    description:
      'Brand identity and packaging for a doggy deli, built to feel as playful as the product itself.',
  },
  {
    slug: 'urban-seoul',
    title: 'Urban Seoul',
    category: 'Branding & Advertising',
    client: 'Urban Seoul',
    image: urbanSeoulImg,
    accent: '#4f6f93',
    description:
      'A full campaign for a streetwear pop-up event -- bus-stop ads, signage, event tickets, and merch all carrying the same bold, hand-lettered identity.',
  },
  {
    slug: 'jade-sword',
    title: 'Jade Sword',
    category: 'Character Illustration',
    client: 'Personal Project',
    image: jadeSwordImg,
    accent: '#2f9e8f',
    description:
      'Character illustration and key art built around a glowing jade blade, rendered for a published Steam title.',
  },
  {
    slug: 'baggu',
    title: 'Baggu Surface Patterns',
    category: 'Surface Pattern Design',
    client: 'Baggu',
    image: bagguImg,
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
    accent: '#c0453a',
    // Source is a 16:9 still with the character off-center to the
    // right -- centering it (the default) crops half of him out.
    imagePosition: 'right center',
    description:
      'A Star Wars-inspired cinematic short, built in Unreal Engine from lighting and environment to the final animated sequence.',
  },
]

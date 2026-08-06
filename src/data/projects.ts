import afi from '../assets/images/projects/afi.jpg'
import baggu from '../assets/images/projects/baggu.jpg'
import chicha from '../assets/images/projects/chicha.jpg'
import contra from '../assets/images/projects/contra.jpg'
import fetch from '../assets/images/projects/fetch.jpg'
import jadeSword from '../assets/images/projects/jade-sword.jpg'
import nsu from '../assets/images/projects/nsu.jpg'
import starWars from '../assets/images/projects/star-wars.jpg'
import resonance from '../assets/images/projects/resonance.jpg'
import urbanseoul from '../assets/images/projects/urbanseoul.jpg'

export const categories = [
  'All Work',
  'Branding & Marketing',
  'Merchandising & Illustration',
  '3D & Motion',
] as const

export type Category = (typeof categories)[number]

export interface Project {
  slug: string
  title: string
  client: string
  year: string
  services: string
  overview: string
  category: Exclude<Category, 'All Work'>
  cover: string
}

export const projects: Project[] = [
  {
    slug: 'resonance-arena-shooter',
    title: 'Resonance: The Arena Shooter',
    client: 'Freelance',
    year: '2026',
    services: 'Branding // UI Design // Video Editing',
    overview:
      'A 12-player cyberpunk arena shooter with audio-reactive environments and fully modular playstyles, where the top scorer earns a literal spotlight and a bounty on their head.',
    category: 'Branding & Marketing',
    cover: resonance,
  },
  {
    slug: 'contra-coffee-tea-stickers',
    title: 'The CONTRA Crew: Sticker Series',
    client: 'Freelance // Contra Coffee & Tea',
    year: '2026',
    services: 'Merchandising // Illustration',
    overview:
      'A cohesive merch collection built for a Spring Y2K drop — consistent typography, color, and illustration across stickers, apparel, and trinkets for a Chapman student audience.',
    category: 'Merchandising & Illustration',
    cover: contra,
  },
  {
    slug: 'afi-fandom-merchandising',
    title: 'A Fire Inside: The Despair Factor',
    client: 'Internship // A Fire Inside (AFI)',
    year: '2025',
    services: 'Digital Marketing // Merchandising',
    overview:
      'Despair Faction is the official fan club for the rock band AFI, modernized into a digital-first rewards program with a points-based system and Discord integration providing early ticket access and exclusive content.',
    category: 'Branding & Marketing',
    cover: afi,
  },
  {
    slug: 'fetch-doggy-deli-foodtruck',
    title: 'fetch! Foodtruck',
    client: 'Academic',
    year: '2025',
    services: 'Branding // Merchandising',
    overview:
      'A specialty food truck serving pup-safe sandwiches and snacks, inspired by my Frenchie Yuki — built on natural, local, wholesome ingredients that bring dogs and their humans closer.',
    category: 'Branding & Marketing',
    cover: fetch,
  },
  {
    slug: 'urbanseoul-new-balance-festival',
    title: 'urbanseoul. Music Festival',
    client: 'Academic // New Balance',
    year: '2025',
    services: 'Branding/Ad // Event // Product // UI Design',
    overview:
      'An immersive music festival blending Korean R&B with New Balance’s heritage, hosted at Under the K Bridge Park — vintage sport photography meets neon-accented streetwear identity.',
    category: 'Branding & Marketing',
    cover: urbanseoul,
  },
  {
    slug: 'nsu-merchandising-social',
    title: 'Nikkei Student Union',
    client: 'Chapman Nikkei Student Union',
    year: '2025',
    services: 'Merchandising // Social Media',
    overview:
      'As creative lead for Chapman’s NSU, managed visual identity, media production, and marketing — screenwriting, filming, and editing promo videos alongside custom merch and social graphics.',
    category: 'Merchandising & Illustration',
    cover: nsu,
  },
  {
    slug: 'star-wars-3d-animation',
    title: 'Star Wars: Protocol of Betrayal',
    client: 'Academic',
    year: '2024',
    services: '3D Animation',
    overview:
      'Protocol of Betrayal is an original, cinematic Star Wars short built in Unreal Engine, set in the slums of Nar Vayal around a fugitive droid, stormtroopers, and a mysterious relic.',
    category: '3D & Motion',
    cover: starWars,
  },
  {
    slug: 'jade-sword-3d-model',
    title: 'Genshin Jade Sword Model',
    client: 'Academic // Genshin Impact',
    year: '2024',
    services: '3D Modeling // Illustration // Rendering',
    overview:
      'A stylized 3D weapon asset built end-to-end in Maya, inspired by Genshin Impact and ceremonial jade craftsmanship, rendered in Arnold with HDRI dome lighting.',
    category: '3D & Motion',
    cover: jadeSword,
  },
  {
    slug: 'chicha-matcha-branding',
    title: 'chi-cha Matcha Boxes',
    client: 'Academic',
    year: '2024',
    services: 'Branding/Ad // UI Design // Social Media',
    overview:
      'A Japanese-owned matcha brand offering a quick energy boost via portable juice boxes, visually built on a nostalgic retro aesthetic inspired by classic Japanese video games and konbini packaging.',
    category: 'Branding & Marketing',
    cover: chicha,
  },
  {
    slug: 'baggu-spiderverse-pattern-set',
    title: 'BAGGU x Into the Spiderverse',
    client: 'Academic // BAGGU',
    year: '2024',
    services: 'Illustration // Merchandising',
    overview:
      'The Spiderverse Set merges BAGGU’s sustainable, minimalist aesthetic with the comic-inspired energy of the film across four patterns — Anomaly, Sunflower, Earth-1610, and Webcomic.',
    category: 'Merchandising & Illustration',
    cover: baggu,
  },
]

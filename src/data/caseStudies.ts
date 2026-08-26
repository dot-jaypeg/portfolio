import contraImg from '../assets/images/projects/contra.jpg'
import afiImg from '../assets/images/projects/afi.jpg'
import resonanceImg from '../assets/images/projects/resonance.jpg'
import nsuImg from '../assets/images/projects/nsu.jpg'
import fetchImg from '../assets/images/projects/fetch.jpg'

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
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: 'contra-coffee-sticker-pack',
    title: 'Contra Coffee Sticker Pack',
    category: 'Illustration',
    client: 'Contra Coffee & Tea',
    image: contraImg,
    description:
      'A playful sticker pack designed to extend Contra Coffee\'s brand voice into something collectible and shareable.',
  },
  {
    slug: 'afi-marketing-campaign',
    title: 'AFI Marketing Campaign',
    category: 'Digital',
    client: 'Velvet Hammer Music',
    image: afiImg,
    description:
      'A multi-channel marketing push built to get AFI in front of the right audience at the right moment.',
  },
  {
    slug: 'ui-design-for-resonance',
    title: 'UI Design for Resonance',
    category: 'UI/UX',
    client: 'Chapman University',
    image: resonanceImg,
    description:
      'Interface design for Resonance, focused on making a complex product feel simple to actually use.',
  },
  {
    slug: 'nikkei-student-union',
    title: 'Nikkei Student Union',
    category: 'Branding',
    client: 'Chapman University',
    image: nsuImg,
    description:
      'A visual identity built to give a student organization a stronger, more unified presence on campus.',
  },
  {
    slug: 'fetch-doggy-deli',
    title: 'fetch! doggy deli',
    category: 'Branding',
    client: 'Academic',
    image: fetchImg,
    description:
      'Brand identity and packaging for a doggy deli, built to feel as playful as the product itself.',
  },
  {
    slug: 'case-06',
    title: 'Case Study 06',
    category: 'Editorial',
    client: 'Work',
    description:
      'Layout and art direction for a print-first story, where the grid has to hold up as well on paper as it does on screen.',
  },
  {
    slug: 'case-07',
    title: 'Case Study 07',
    category: 'Web',
    client: 'Work',
    description:
      'A site built to make a small team feel like a studio, from first scroll to final contact form.',
  },
  {
    slug: 'case-08',
    title: 'Case Study 08',
    category: 'Packaging',
    client: 'Work',
    description:
      'Structural and surface design for a product line meant to be picked up, not just looked at.',
  },
  {
    slug: 'case-09',
    title: 'Case Study 09',
    category: 'Photography',
    client: 'Work',
    description:
      'A shoot built around one clear mood, carried consistently across every frame that made the final cut.',
  },
  {
    slug: 'case-10',
    title: 'Case Study 10',
    category: 'Social',
    client: 'Work',
    description:
      'A content system flexible enough to post daily without ever losing the brand\'s shape.',
  },
]

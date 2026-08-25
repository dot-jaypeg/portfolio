export interface CaseStudy {
  slug: string
  title: string
  category: string
  description: string
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: 'case-01',
    title: 'Case Study 01',
    category: 'Branding',
    description:
      'A full identity system built from the ground up — mark, type, and a set of rules flexible enough to hold across every touchpoint.',
  },
  {
    slug: 'case-02',
    title: 'Case Study 02',
    category: 'Digital',
    description:
      'A digital marketing push that turned a quiet launch into a campaign people actually talked about, across every channel it touched.',
  },
  {
    slug: 'case-03',
    title: 'Case Study 03',
    category: 'Merchandising',
    description:
      'Physical goods designed to feel like an extension of the brand instead of an afterthought — packaging, apparel, and everything in between.',
  },
  {
    slug: 'case-04',
    title: 'Case Study 04',
    category: 'Motion',
    description:
      'Motion and VFX work built to carry a story frame by frame, from early animatics through final color.',
  },
  {
    slug: 'case-05',
    title: 'Case Study 05',
    category: 'Illustration',
    description:
      'Original illustration work made to stand on its own and to slot cleanly into a larger visual system.',
  },
]

export type ProjectMediaType = 'image' | 'gif' | 'video'

export interface ProjectImage {
  // Omitted entirely while a project has no real asset yet -- callers
  // (ProjectMedia) fall back to a dashed placeholder box instead of
  // rendering a broken <img>. Drop in a real path here to swap it in.
  src?: string
  alt: string
  type: ProjectMediaType
  // Declared up front (not read off the asset at runtime) so the grid
  // can reserve each thumbnail's aspect-ratio before the image/video
  // ever loads, preventing layout shift once it does.
  width: number
  height: number
}

export interface Project {
  slug: string
  title: string
  client: string
  category: string
  year: string
  description: string
  cover: ProjectImage
  images: ProjectImage[]
}

// Six placeholder entries spread across the four filter categories
// below, with the cover sizes varied on purpose (portrait, square,
// landscape) so the dense grid doesn't read as a uniform checkerboard
// even with zero real photos yet. One cover uses type: 'gif' and one
// project's second image uses type: 'video' -- there's no real asset
// behind either yet, but it keeps both code paths (ProjectMedia's
// <img>/<video> branch) exercised by real data shapes, not just types.
//
// To add a project: copy one of these objects, give it a unique slug
// (used in the /gallery/:slug URL), and once you have real files, set
// each `src` to its path under src/assets or /public.
export const PROJECTS: Project[] = [
  {
    slug: 'placeholder-project-one',
    title: 'Placeholder Project One',
    client: 'Project Client A',
    category: 'Branding',
    year: '2026',
    description:
      'A placeholder case study standing in for a real branding project -- swap this copy and the images below once the real work is ready to publish.',
    cover: { alt: 'Placeholder Project One cover', type: 'image', width: 4, height: 5 },
    images: [
      { alt: 'Placeholder Project One, image 1', type: 'image', width: 16, height: 9 },
      { alt: 'Placeholder Project One, image 2', type: 'image', width: 4, height: 5 },
      { alt: 'Placeholder Project One, image 3', type: 'image', width: 1, height: 1 },
    ],
  },
  {
    slug: 'placeholder-project-two',
    title: 'Placeholder Project Two',
    client: 'Project Client B',
    category: 'Digital Marketing',
    year: '2025',
    description:
      'A placeholder case study standing in for a real digital marketing campaign -- swap this copy and the images below once the real work is ready to publish.',
    cover: { alt: 'Placeholder Project Two cover', type: 'image', width: 1, height: 1 },
    images: [
      { alt: 'Placeholder Project Two, image 1', type: 'image', width: 16, height: 9 },
      { alt: 'Placeholder Project Two, image 2', type: 'video', width: 16, height: 9 },
    ],
  },
  {
    slug: 'placeholder-project-three',
    title: 'Placeholder Project Three',
    client: 'Project Client C',
    category: 'Visual Storytelling',
    year: '2025',
    description:
      'A placeholder case study standing in for a real visual-storytelling project -- swap this copy and the images below once the real work is ready to publish.',
    cover: { alt: 'Placeholder Project Three cover', type: 'gif', width: 3, height: 4 },
    images: [
      { alt: 'Placeholder Project Three, image 1', type: 'image', width: 3, height: 4 },
      { alt: 'Placeholder Project Three, image 2', type: 'image', width: 3, height: 4 },
      { alt: 'Placeholder Project Three, image 3', type: 'image', width: 16, height: 9 },
    ],
  },
  {
    slug: 'placeholder-project-four',
    title: 'Placeholder Project Four',
    client: 'Self-Initiated',
    category: 'Personal',
    year: '2024',
    description:
      'A placeholder entry standing in for a personal project -- swap this copy and the images below once the real work is ready to publish.',
    cover: { alt: 'Placeholder Project Four cover', type: 'image', width: 4, height: 5 },
    images: [
      { alt: 'Placeholder Project Four, image 1', type: 'image', width: 4, height: 5 },
      { alt: 'Placeholder Project Four, image 2', type: 'image', width: 1, height: 1 },
    ],
  },
  {
    slug: 'placeholder-project-five',
    title: 'Placeholder Project Five',
    client: 'Project Client D',
    category: 'Branding',
    year: '2024',
    description:
      'A placeholder case study standing in for a real branding project -- swap this copy and the images below once the real work is ready to publish.',
    cover: { alt: 'Placeholder Project Five cover', type: 'image', width: 16, height: 9 },
    images: [
      { alt: 'Placeholder Project Five, image 1', type: 'image', width: 16, height: 9 },
      { alt: 'Placeholder Project Five, image 2', type: 'image', width: 3, height: 4 },
    ],
  },
  {
    slug: 'placeholder-project-six',
    title: 'Placeholder Project Six',
    client: 'Project Client E',
    category: 'Digital Marketing',
    year: '2023',
    description:
      'A placeholder case study standing in for a real digital marketing campaign -- swap this copy and the images below once the real work is ready to publish.',
    cover: { alt: 'Placeholder Project Six cover', type: 'image', width: 1, height: 1 },
    images: [
      { alt: 'Placeholder Project Six, image 1', type: 'image', width: 4, height: 5 },
      { alt: 'Placeholder Project Six, image 2', type: 'image', width: 16, height: 9 },
      { alt: 'Placeholder Project Six, image 3', type: 'image', width: 4, height: 5 },
    ],
  },
]

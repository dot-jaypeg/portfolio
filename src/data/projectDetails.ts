import stickerSheet from '../assets/images/projects/detail/contra-coffee-sticker-pack/sticker-sheet.jpg'
import waterBottleMockup from '../assets/images/projects/detail/contra-coffee-sticker-pack/water-bottle-mockup.jpg'

import showBoston2 from '../assets/images/projects/detail/afi-marketing-campaign/show-boston-2.jpg'
import showPhilly from '../assets/images/projects/detail/afi-marketing-campaign/show-philly.jpg'
import showBoston1 from '../assets/images/projects/detail/afi-marketing-campaign/show-boston-1.jpg'
import visionCards from '../assets/images/projects/detail/afi-marketing-campaign/vision-cards.jpg'

import resonancePoster from '../assets/images/projects/detail/ui-design-for-resonance/poster.jpg'
import splash1 from '../assets/images/projects/detail/ui-design-for-resonance/splash-1.jpg'
import splash2 from '../assets/images/projects/detail/ui-design-for-resonance/splash-2.jpg'

import boardHoodie from '../assets/images/projects/detail/nikkei-student-union/board-hoodie.jpg'
import springFront from '../assets/images/projects/detail/nikkei-student-union/spring-merch-front.jpg'
import springBack from '../assets/images/projects/detail/nikkei-student-union/spring-merch-back.jpg'

import packaging1 from '../assets/images/projects/detail/fetch-doggy-deli/packaging-1.jpg'
import packaging2 from '../assets/images/projects/detail/fetch-doggy-deli/packaging-2.jpg'
import fetchTruck from '../assets/images/projects/detail/fetch-doggy-deli/truck.jpg'
import fetchSocial from '../assets/images/projects/detail/fetch-doggy-deli/social.jpg'

import usPoster1 from '../assets/images/projects/detail/urban-seoul/poster-1.jpg'
import usPoster2 from '../assets/images/projects/detail/urban-seoul/poster-2.jpg'
import usSignage1 from '../assets/images/projects/detail/urban-seoul/signage-1.jpg'
import usMerch1 from '../assets/images/projects/detail/urban-seoul/merch-1.jpg'
import usMerch2 from '../assets/images/projects/detail/urban-seoul/merch-2.jpg'
import usSocial from '../assets/images/projects/detail/urban-seoul/social.jpg'

import jadeKeyArt from '../assets/images/projects/detail/jade-sword/key-art.jpg'
import jadeExpanded1 from '../assets/images/projects/detail/jade-sword/expanded-1.jpg'
import jadeExpanded2 from '../assets/images/projects/detail/jade-sword/expanded-2.jpg'

import bagguSwatches from '../assets/images/projects/detail/baggu/swatches.jpg'

import chichaDisplay from '../assets/images/projects/detail/chi-cha/display-ad.jpg'
import chichaStatic from '../assets/images/projects/detail/chi-cha/static-ad.jpg'
import chichaIgStories from '../assets/images/projects/detail/chi-cha/ig-stories.jpg'
import chichaSocialPosts from '../assets/images/projects/detail/chi-cha/social-posts.jpg'
import chichaMailer from '../assets/images/projects/detail/chi-cha/direct-mailer.jpg'
import chichaPackagingMockup from '../assets/images/projects/detail/chi-cha/packaging-mockup.jpg'

import protocolOfBetrayalImg from '../assets/images/projects/star-wars.jpg'

export interface ProjectImage {
  src: string
  alt: string
  width: number
  height: number
  caption?: string
}

export interface ProjectChapter {
  label: string
  text: string
  layout: 'full-bleed' | 'two-up' | 'contained'
  images: ProjectImage[]
}

export interface ProjectLinks {
  site?: string
  featuredOn?: { label: string; href: string }[]
}

export interface ProjectDetailData {
  // Rendered as `{heroLead} **{heroBold ?? client}**{heroTagline}` --
  // the client name is bolded inline, per the brief's "Brand identity
  // for [Client], a [one-line description]" hero pattern. A couple of
  // CASE_STUDIES `client` values are placeholders ("Academic") rather
  // than a real named entity, which reads oddly bolded into a sentence
  // as though it were a company -- `heroBold` lets those override what
  // actually gets bolded without changing the underlying client data.
  heroLead: string
  heroBold?: string
  heroTagline: string
  tags: string[]
  intro: string
  links?: ProjectLinks
  // Optional concrete number/credit -- omitted everywhere for now since
  // none of these are verified yet (see the per-project ask list this
  // was shipped with).
  proofPoint?: string
  chapters: ProjectChapter[]
}

export const PROJECT_DETAILS: Record<string, ProjectDetailData> = {
  'contra-coffee-sticker-pack': {
    heroLead: 'Sticker illustration for',
    heroTagline:
      ', a collectible pack built to carry the shop’s voice onto cups, laptops, and water bottles.',
    tags: ['Illustration', 'Brand Extension', 'Merchandise'],
    intro:
      'Contra Coffee & Tea wanted stickers that felt like an extension of the shop, not a logo on vinyl. The pack leans on the brand’s existing characters and palette, built to be given away, traded, and stuck wherever customers land.',
    chapters: [
      {
        label: 'The Sticker Sheet',
        text: 'Each character got its own die-cut shape and a palette pulled straight from Contra’s in-store signage, so the sheet reads as one family even spread across a counter.',
        layout: 'contained',
        images: [
          {
            src: stickerSheet,
            alt: 'Contra Coffee & Tea sticker sheet with die-cut character illustrations',
            width: 2000,
            height: 1125,
            caption: 'Above: the full sticker sheet, ready for die-cutting.',
          },
        ],
      },
      {
        label: 'In the Wild',
        text: 'The stickers were built to survive real use — a water bottle, a laptop lid, a to-go cup — holding up at small sizes without losing the linework.',
        layout: 'contained',
        images: [
          {
            src: waterBottleMockup,
            alt: 'Contra Coffee sticker applied to a water bottle',
            width: 1600,
            height: 1600,
          },
        ],
      },
    ],
  },

  'afi-marketing-campaign': {
    heroLead: 'A multi-channel marketing push for',
    heroTagline:
      ', built to get AFI’s tour in front of the right audience at the right moment — and to capture the room once they showed up.',
    tags: ['Digital Marketing', 'Campaign', 'Event Photography'],
    intro:
      'Velvet Hammer Music brought this on as a full-funnel push for AFI’s tour: paid and organic assets to drive ticket sales, then photography on the ground to turn each stop into content for the next one.',
    chapters: [
      {
        label: 'On Tour',
        text: 'Coverage followed the tour from city to city, shot to double as recap content and raw material for the next stop’s promo.',
        layout: 'full-bleed',
        images: [
          {
            src: showBoston2,
            alt: 'AFI performing live in Boston, 2025',
            width: 2000,
            height: 1333,
          },
        ],
      },
      {
        label: 'Live Coverage',
        text: 'Philadelphia’s Fillmore and a Boston stop gave the campaign its two strongest live sets.',
        layout: 'two-up',
        images: [
          {
            src: showPhilly,
            alt: 'AFI performing at the Fillmore in Philadelphia',
            width: 1632,
            height: 2000,
          },
          {
            src: showBoston1,
            alt: 'AFI performing live in Boston, 2025',
            width: 1333,
            height: 2000,
          },
        ],
      },
      {
        label: 'Membership & Vision Cards',
        text: 'A supporting card series gave the campaign a physical, collectible touchpoint alongside the digital push.',
        layout: 'contained',
        images: [
          {
            src: visionCards,
            alt: 'AFI membership and vision card series',
            width: 2000,
            height: 1466,
          },
        ],
      },
    ],
  },

  'ui-design-for-resonance': {
    heroLead: 'Interface design for',
    heroTagline: ', built to make a dense, data-heavy product feel simple enough to actually use.',
    tags: ['UI/UX', 'HUD Design', 'Branding'],
    intro:
      'Resonance needed an interface that could hold a lot of information — live data, controls, status — without overwhelming the person using it. The system starts with one clear mark and a restrained palette, then carries that calm into every screen.',
    chapters: [
      {
        label: 'Key Art & Poster',
        text: 'The poster set the visual language first: one mark, one palette, enough restraint to carry straight into the UI itself.',
        layout: 'contained',
        images: [
          {
            src: resonancePoster,
            alt: 'Resonance key art poster',
            width: 1125,
            height: 2000,
          },
        ],
      },
      {
        label: 'Splash Screens',
        text: 'Splash and loading states got the same treatment as the core UI — considered, not an afterthought.',
        layout: 'two-up',
        images: [
          {
            src: splash1,
            alt: 'Resonance splash screen, first variant',
            width: 2000,
            height: 1125,
          },
          {
            src: splash2,
            alt: 'Resonance splash screen, second variant',
            width: 2000,
            height: 1125,
          },
        ],
      },
    ],
  },

  'nikkei-student-union': {
    heroLead: 'A visual identity built for',
    heroTagline:
      '’s Nikkei Student Union, giving the organization a stronger, more unified presence on campus.',
    tags: ['Branding', 'Merchandise', 'Photography'],
    intro:
      'NSU needed merch that board members and general members would actually wear — one consistent mark carried across hoodies and seasonal drops instead of a different logo treatment every semester.',
    chapters: [
      {
        label: 'Board Hoodie',
        text: 'A heavier, members-only piece built around a cleaner lockup of the mark.',
        layout: 'contained',
        images: [
          {
            src: boardHoodie,
            alt: 'NSU board hoodie with logo lockup',
            width: 2000,
            height: 1333,
          },
        ],
      },
      {
        label: 'Spring Merch Line',
        text: 'The seasonal drop kept the front simple and moved the detail to the back, so the line could scale across more product without feeling repetitive.',
        layout: 'two-up',
        images: [
          {
            src: springFront,
            alt: 'NSU spring merchandise, front print',
            width: 2000,
            height: 1500,
          },
          {
            src: springBack,
            alt: 'NSU spring merchandise, back print',
            width: 2000,
            height: 1500,
          },
        ],
      },
    ],
  },

  'fetch-doggy-deli': {
    heroLead: 'Brand identity and packaging for',
    heroBold: 'fetch! doggy deli',
    heroTagline:
      ', a doggy deli built to feel as playful as the product itself — menus, truck wrap, and packaging all pulling from one voice.',
    tags: ['Branding', 'Packaging', 'Advertising'],
    intro:
      'fetch! doggy deli is a concept built end to end: naming, mark, packaging system, and the vehicle that would actually deliver it. The goal was a brand that reads as fun on a bag of treats and still holds up wrapped around a truck.',
    chapters: [
      {
        label: 'Packaging System',
        text: 'Color-coded labels do the sorting across the lineup, so the shelf reads as one family instead of a scramble.',
        layout: 'two-up',
        images: [
          {
            src: packaging1,
            alt: 'fetch! doggy deli packaging, variant one',
            width: 2000,
            height: 1294,
          },
          {
            src: packaging2,
            alt: 'fetch! doggy deli packaging, variant two',
            width: 2000,
            height: 1294,
          },
        ],
      },
      {
        label: 'On the Road',
        text: 'The identity had to survive being wrapped around a full-size vehicle without losing any of its detail.',
        layout: 'full-bleed',
        images: [
          {
            src: fetchTruck,
            alt: 'fetch! doggy deli delivery truck with full brand wrap',
            width: 2000,
            height: 1389,
          },
        ],
      },
      {
        label: 'Social',
        text: 'Social carried the same playful tone into something people would actually stop scrolling for.',
        layout: 'contained',
        images: [
          {
            src: fetchSocial,
            alt: 'fetch! doggy deli social media post',
            width: 2000,
            height: 1389,
          },
        ],
      },
    ],
  },

  'urban-seoul': {
    heroLead: 'A full campaign for',
    heroTagline:
      ', a streetwear pop-up built around one bold, hand-lettered identity carried across signage, merch, and the street itself.',
    tags: ['Branding', 'Campaign', 'Signage', 'Merchandise'],
    intro:
      'Urban Seoul needed a one-off event to feel like a full brand, fast — bus-stop ads and signage to pull people in, merch and tickets to give them something to leave with.',
    chapters: [
      {
        label: 'Posters & Signage',
        text: 'The hand-lettered mark anchored every touchpoint, from bus-stop posters to the signage marking the event itself.',
        layout: 'two-up',
        images: [
          {
            src: usPoster1,
            alt: 'Urban Seoul event poster, variant one',
            width: 2000,
            height: 1389,
          },
          {
            src: usPoster2,
            alt: 'Urban Seoul event poster, variant two',
            width: 2000,
            height: 1389,
          },
        ],
      },
      {
        label: 'On-Site Signage',
        text: 'Signage carried the identity from print into the physical space of the pop-up.',
        layout: 'full-bleed',
        images: [
          {
            src: usSignage1,
            alt: 'Urban Seoul on-site event signage',
            width: 2000,
            height: 1389,
          },
        ],
      },
      {
        label: 'Merch',
        text: 'Merch kept the same bold lettering, built to be worn past the event.',
        layout: 'two-up',
        images: [
          {
            src: usMerch1,
            alt: 'Urban Seoul merchandise, variant one',
            width: 2000,
            height: 1389,
          },
          {
            src: usMerch2,
            alt: 'Urban Seoul merchandise, variant two',
            width: 2000,
            height: 1389,
          },
        ],
      },
      {
        label: 'Social',
        text: 'Social rounded out the campaign, keeping the same hand-lettered energy in a scrollable format.',
        layout: 'contained',
        images: [
          {
            src: usSocial,
            alt: 'Urban Seoul social media mockup',
            width: 2000,
            height: 1334,
          },
        ],
      },
    ],
  },

  'jade-sword': {
    heroLead: 'Character illustration and key art for',
    heroTagline: ', built around a glowing blade for a published Steam title.',
    tags: ['Character Illustration', 'Key Art', 'Game Art'],
    intro:
      'A personal project built as published key art: one character, one weapon, rendered to hold up both as a hero image and as in-game reference.',
    chapters: [
      {
        label: 'Key Art',
        text: 'The final key art, built around the glow of the blade as the single light source driving the whole composition.',
        layout: 'full-bleed',
        images: [
          {
            src: jadeKeyArt,
            alt: 'Jade Sword final key art, character with glowing blade',
            width: 2000,
            height: 1333,
          },
        ],
      },
      {
        label: 'Expanded Studies',
        text: 'Supporting studies pushed the character and pose further before the final render locked in.',
        layout: 'two-up',
        images: [
          {
            src: jadeExpanded1,
            alt: 'Jade Sword character study, variant one',
            width: 2000,
            height: 1333,
          },
          {
            src: jadeExpanded2,
            alt: 'Jade Sword character study, variant two',
            width: 2000,
            height: 1333,
          },
        ],
      },
    ],
  },

  baggu: {
    heroLead: 'Surface pattern design for',
    heroTagline: ', a set of playful, trend-driven patterns built for the tote and pouch lineup.',
    tags: ['Surface Pattern', 'Textile', 'Branding'],
    intro:
      'Baggu needed patterns that could scale across a whole product line — totes, pouches, more — without the design feeling stretched or repetitive at different sizes.',
    chapters: [
      {
        label: 'Pattern Swatches',
        text: 'Each swatch was built as a tileable repeat first, so it could scale cleanly across any bag size without a visible seam.',
        layout: 'contained',
        images: [
          {
            src: bagguSwatches,
            alt: 'Baggu surface pattern swatches',
            width: 2000,
            height: 1390,
          },
        ],
      },
    ],
  },

  'chi-cha': {
    heroLead: 'A retro-arcade-themed digital push for',
    heroTagline: ', built around one playful visual world across display ads, social, and a direct mailer.',
    tags: ['Digital Marketing', 'Campaign', 'Social'],
    intro:
      'Chi-Cha wanted a beverage campaign that felt like its own little arcade world — bold color, chunky type, and enough consistency that a static ad and an Instagram story clearly belonged to the same brand.',
    chapters: [
      {
        label: 'Display & Static Ads',
        text: 'Display and static placements shared one arcade-inspired palette, built to stop a scroll without straying from the brand.',
        layout: 'two-up',
        images: [
          {
            src: chichaDisplay,
            alt: 'Chi-Cha display ad',
            width: 2000,
            height: 1500,
          },
          {
            src: chichaStatic,
            alt: 'Chi-Cha static ad',
            width: 2000,
            height: 1291,
          },
        ],
      },
      {
        label: 'Social',
        text: 'Stories and feed posts carried the same world into a faster, more disposable format.',
        layout: 'two-up',
        images: [
          {
            src: chichaIgStories,
            alt: 'Chi-Cha Instagram stories design',
            width: 2000,
            height: 1334,
          },
          {
            src: chichaSocialPosts,
            alt: 'Chi-Cha social media post designs',
            width: 2000,
            height: 1334,
          },
        ],
      },
      {
        label: 'Direct Mailer & Packaging',
        text: 'The campaign closed the loop with a physical mailer and a packaging mockup, keeping the same voice off-screen.',
        layout: 'two-up',
        images: [
          {
            src: chichaMailer,
            alt: 'Chi-Cha direct mailer design',
            width: 2000,
            height: 1466,
          },
          {
            src: chichaPackagingMockup,
            alt: 'Chi-Cha blueberry packaging mockup',
            width: 2000,
            height: 1466,
          },
        ],
      },
    ],
  },

  'protocol-of-betrayal': {
    heroLead: 'A Star Wars-inspired cinematic short for',
    heroTagline: ', built in Unreal Engine from lighting and environment to the final animated sequence.',
    tags: ['3D', 'Motion', 'Cinematics'],
    intro:
      'A personal short built end to end in Unreal Engine — environment, lighting, and character animation — aimed at one finished cinematic beat rather than a full scene.',
    chapters: [
      {
        label: 'The Shot',
        text: 'Lighting and camera did most of the storytelling here, built to sell the moment in a single continuous shot.',
        layout: 'full-bleed',
        images: [
          {
            src: protocolOfBetrayalImg,
            alt: 'Protocol of Betrayal cinematic still, Unreal Engine',
            width: 1600,
            height: 899,
          },
        ],
      },
    ],
  },
}

import contraMoodboard from '../assets/images/projects/detail/contra-coffee-sticker-pack/moodboard.jpg'
import contraLogoMark from '../assets/images/projects/detail/contra-coffee-sticker-pack/logo-mark.png'
import sketchGoldRush from '../assets/images/projects/detail/contra-coffee-sticker-pack/sketch-gold-rush.png'
import sketchKuyaLatte from '../assets/images/projects/detail/contra-coffee-sticker-pack/sketch-kuya-latte.png'
import sketchStrawberryFields from '../assets/images/projects/detail/contra-coffee-sticker-pack/sketch-strawberry-fields.png'
import finalStickerGoldRush from '../assets/images/projects/detail/contra-coffee-sticker-pack/final-sticker-gold-rush.png'
import finalStickerKuyaLatte from '../assets/images/projects/detail/contra-coffee-sticker-pack/final-sticker-kuya-latte.png'
import finalStickerStrawberryFields from '../assets/images/projects/detail/contra-coffee-sticker-pack/final-sticker-strawberry-fields.png'
import finalCast1 from '../assets/images/projects/detail/contra-coffee-sticker-pack/final-cast-1.png'
import finalCast2 from '../assets/images/projects/detail/contra-coffee-sticker-pack/final-cast-2.png'
import finalCast3 from '../assets/images/projects/detail/contra-coffee-sticker-pack/final-cast-3.png'
import waterBottleMockup from '../assets/images/projects/detail/contra-coffee-sticker-pack/water-bottle-mockup.jpg'
import tshirtMockup from '../assets/images/projects/detail/contra-coffee-sticker-pack/tshirt-mockup.jpg'
import keychainMockup from '../assets/images/projects/detail/contra-coffee-sticker-pack/keychain-mockup.jpg'

import showBoston2 from '../assets/images/projects/detail/afi-marketing-campaign/show-boston-2.jpg'
import showPhilly from '../assets/images/projects/detail/afi-marketing-campaign/show-philly.jpg'
import showBoston1 from '../assets/images/projects/detail/afi-marketing-campaign/show-boston-1.jpg'
import visionCards from '../assets/images/projects/detail/afi-marketing-campaign/vision-cards.jpg'
import showFullStage from '../assets/images/projects/detail/afi-marketing-campaign/show-full-stage.jpg'

import resonancePoster from '../assets/images/projects/detail/ui-design-for-resonance/poster.jpg'
import splash1 from '../assets/images/projects/detail/ui-design-for-resonance/splash-1.jpg'
import splash2 from '../assets/images/projects/detail/ui-design-for-resonance/splash-2.jpg'
import resonanceTrailer from '../assets/images/projects/detail/ui-design-for-resonance/trailer.mp4'
import resonanceRunAlpha from '../assets/images/projects/detail/ui-design-for-resonance/run-alpha.webm'
import resonanceTrailerPoster from '../assets/images/projects/detail/ui-design-for-resonance/trailer-poster.jpg'
import logoConcept1 from '../assets/images/projects/detail/ui-design-for-resonance/logo-concept-1.jpg'
import logoConcept2 from '../assets/images/projects/detail/ui-design-for-resonance/logo-concept-2.jpg'
import gameIcon from '../assets/images/projects/detail/ui-design-for-resonance/game-icon.jpg'
import fontSpecimen from '../assets/images/projects/detail/ui-design-for-resonance/font-specimen.png'
import weaponSkinKatto from '../assets/images/projects/detail/ui-design-for-resonance/weapon-skin-katto.jpg'
import hud1 from '../assets/images/projects/detail/ui-design-for-resonance/hud-1.jpg'
import matchEndLoop from '../assets/images/projects/detail/ui-design-for-resonance/match-end-loop.mp4'

import boardHoodie from '../assets/images/projects/detail/nikkei-student-union/board-hoodie.jpg'
import springFront from '../assets/images/projects/detail/nikkei-student-union/spring-merch-front.jpg'
import springBack from '../assets/images/projects/detail/nikkei-student-union/spring-merch-back.jpg'
import nsuLifestyleTee from '../assets/images/projects/detail/nikkei-student-union/lifestyle-tee.jpg'

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

import type { ImageGridLayout } from '../components/ImageGrid'

export interface ProjectImage {
  // Omit `src` (and width/height) to render a dashed placeholder box
  // instead -- for a chapter whose real asset hasn't been supplied
  // yet. `alt` doubles as that box's own label in that case.
  src?: string
  // Set instead of `src` to render a <video> in this slot. `videoMode`
  // 'loop' autoplays muted/looped with no controls (ambient UI or
  // environment footage); 'autoplay' plays once scrolled into view,
  // pauses once scrolled out, starting muted but keeping controls so
  // a visitor can unmute; the default, 'controls', is a plain
  // user-initiated player with `poster` as its thumbnail.
  video?: string
  videoMode?: 'controls' | 'loop' | 'autoplay'
  poster?: string
  alt: string
  width?: number
  height?: number
  caption?: string
  // `cluster` layout only -- how wide this image renders relative to
  // the others in the same free-wrapping group. Defaults to 'md'.
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

// One image block: a layout plus the images it renders. A chapter's
// primary block is its own `layout`/`images`/`tall`; `moreImages` adds
// further blocks in sequence below it, for a chapter that needs more
// than one distinct grouping (e.g. a run of full-page product shots).
export interface ProjectImageBlock {
  layout: ImageGridLayout
  images: ProjectImage[]
  // `full-page` only -- use a taller-than-viewport box, for a square
  // or portrait source a plain viewport-height crop cuts too hard.
  tall?: boolean
}

export interface ProjectChapter extends ProjectImageBlock {
  // Omit for a chapter meant to read as pure imagery with no eyebrow
  // label above its copy.
  label?: string
  // A single paragraph, or several -- rendered as separate <p>s, with
  // the label (if any) only ever sitting above the first. Omit
  // alongside `label` for a chapter that's pure imagery, no copy at all.
  text?: string | string[]
  moreImages?: ProjectImageBlock[]
  // False drops ImageGrid's rounded bg-cream/5 card backdrop for this
  // chapter's images -- for transparent-background cutouts (sketches,
  // sticker renders) where that backdrop would show as an unwanted
  // grey box around the art. Defaults to true.
  imagesOnCard?: boolean
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
  // Overrides the hero image's CSS object-position independently of
  // CASE_STUDIES' own `imagePosition` -- that field also drives the
  // homepage WorkPanel crop, so reusing it here would recrop that too.
  // Defaults to `project.imagePosition ?? 'center'` when unset.
  heroImagePosition?: string
  tags: string[]
  intro: string
  // An optional small mark (a logo, a wordmark) rendered centered
  // between the intro and the first chapter.
  brandMark?: { src: string; alt: string }
  links?: ProjectLinks
  // Optional concrete number/credit -- omitted everywhere for now since
  // none of these are verified yet (see the per-project ask list this
  // was shipped with).
  proofPoint?: string
  chapters: ProjectChapter[]
}

export const PROJECT_DETAILS: Record<string, ProjectDetailData> = {
  'contra-coffee-sticker-pack': {
    heroLead: 'A cohesive collection for',
    heroTagline: ' designed to function as their Spring Y2K Merch Drop.',
    // The cover photo is a tall shot of stickers spread across a table --
    // centering it (the default) pushes the visible crop down toward
    // the lower, sparser half. Biasing toward the top keeps more of the
    // actual sticker faces in frame.
    heroImagePosition: 'center 20%',
    tags: ['Illustration', 'Character Design', 'Merchandise', 'Branding'],
    intro:
      'Contra reimagines the café with signature coffee and tea on draft, served in a minimalist space made for studying, unwinding, and browsing Resident Vinyl’s record collection. Community drives the brand, so this collection was designed for the people who love it most.',
    brandMark: { src: contraLogoMark, alt: 'Contra Coffee & Tea icon' },
    links: {
      featuredOn: [
        { label: 'Instagram Post', href: 'https://www.instagram.com/p/DYU0v_kNiai/?hl=en' },
        {
          label: 'Instagram Highlight',
          href: 'https://www.instagram.com/stories/highlights/18089602946612492/?hl=en',
        },
      ],
    },
    chapters: [
      {
        label: 'Ideation',
        text: 'Inspired by bold colors, organic free-flowing sketchwork, and retro motifs, these stickers were designed to resonate subtly while still achieving that Y2K aesthetic. What makes Contra unique is that their drinks are served on tap, so the collection highlights their fun menu by focusing on the drinks themselves. The concept draws from blind boxes, specifically Peach Riot, where the creator used each series to promote their own music. In the same spirit, Contra’s drinks are personified as a band of playful characters. Peach Riot perfectly represents the Y2K retro style, which made it the ideal reference for the collection.',
        layout: 'full-bleed',
        images: [
          {
            src: contraMoodboard,
            alt: 'Mood board referencing Peach Riot and Y2K character design for the Contra merch drop',
            width: 1800,
            height: 1440,
          },
        ],
      },
      {
        label: 'Character Concepting',
        text: 'Early concepts drew on a retro, school sketchbook style, with each drink playing the electric guitar. Picking which drinks to personify was tricky, so Contra shared their most popular orders to avoid bias. The final lineup balanced drinks that were fun to draw with ones that deserved more attention. Initial sketches began with Kuya Latte (ube latte), Gold Rush (Vietnamese coffee), and Strawberry Fields (strawberry matcha latte).',
        layout: 'cluster',
        imagesOnCard: false,
        images: [
          {
            src: sketchGoldRush,
            alt: 'Character sketch for the Gold Rush sticker',
            width: 1200,
            height: 1200,
            size: 'lg',
          },
          {
            src: sketchKuyaLatte,
            alt: 'Character sketch for the Kuya Latte sticker',
            width: 1200,
            height: 1200,
            size: 'lg',
          },
          {
            src: sketchStrawberryFields,
            alt: 'Character sketch for the Strawberry Fields sticker',
            width: 1200,
            height: 1200,
            size: 'lg',
          },
        ],
      },
      {
        label: 'The Sticker Pack',
        text: [
          'Old manga from the early 2000s, like Soul Eater, shaped the Y2K look of the stickers. The first set of three featured only the heads of Kuya, Gold Rush, and Strawberry Fields, with each design drawn from the drink’s meaning, its typical customers, and its overall look.',
          'Kuya means “older brother” in Tagalog, and with the drink’s deep purple color, a monotone palette and a nonchalant expression best fit his personality. Gold Rush, a Vietnamese latte meant to wake you up, became a spunky baddie, and sparkles were added later to bring out the gold in its name. Strawberry Fields, with the drink’s pastel, pretty look, became a cottage-core soft girl whose strawberry pigtails, inspired by Strawberry Shortcake, set her apart from a regular matcha.',
          'For the full-body designs, more drinks from the taplist joined the band. Lucky Cat (mango kumquat green tea) became a nekomimi-inspired character, and That Orange Stuff (vanilla oat milk Thai tea) took after the soft style of Strawberry Fields. To balance out Strawberry Fields, MC² (matcha espresso) was added as her opposite, designed as a nerdy but stylish schoolboy.',
        ],
        layout: 'cluster',
        imagesOnCard: false,
        images: [
          {
            src: finalStickerGoldRush,
            alt: 'Final Gold Rush sticker design',
            width: 1200,
            height: 1200,
            size: 'md',
          },
          {
            src: finalStickerKuyaLatte,
            alt: 'Final Kuya Latte sticker design',
            width: 1200,
            height: 1199,
            size: 'md',
          },
          {
            src: finalStickerStrawberryFields,
            alt: 'Final Strawberry Fields sticker design',
            width: 1200,
            height: 1039,
            size: 'md',
          },
          {
            src: finalCast1,
            alt: 'Final character illustration: MC Squared',
            width: 1200,
            height: 1200,
            size: 'xl',
          },
          {
            src: finalCast2,
            alt: 'Final character illustrations: Lucky Cat, Gold Rush, and That Orange Stuff',
            width: 1200,
            height: 1200,
            size: 'xl',
          },
          {
            src: finalCast3,
            alt: 'Final character illustrations: Strawberry Fields and Kuya Latte',
            width: 1200,
            height: 1200,
            size: 'xl',
          },
        ],
      },
      {
        // No label and no copy -- per direct request, this chapter runs
        // as pure imagery.
        layout: 'full-page',
        tall: true,
        images: [
          {
            src: tshirtMockup,
            alt: 'Contra Coffee & Tea t-shirt with speech bubble logo and character illustration',
          },
        ],
        moreImages: [
          {
            layout: 'full-page',
            tall: true,
            images: [
              {
                src: keychainMockup,
                alt: 'MC Squared acrylic keychain with dice charms',
              },
            ],
          },
          {
            layout: 'full-page',
            tall: true,
            images: [
              {
                src: waterBottleMockup,
                alt: 'Contra Coffee stickers applied to reusable glass growlers',
              },
            ],
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
        layout: 'full-page',
        images: [
          {
            src: showBoston2,
            alt: 'AFI performing live in Boston, 2025',
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
      {
        // No label -- closing on the full stage shot, pure imagery.
        layout: 'full-page',
        images: [
          {
            src: showFullStage,
            alt: 'AFI performing live on stage with full band and backdrop',
          },
        ],
      },
    ],
  },

  'ui-design-for-resonance': {
    heroLead: 'Twelve fighters. One arena that listens. Branding, UI, and HUD design for',
    heroBold: 'Resonance',
    heroTagline: '.',
    tags: ['Branding', 'UI/UX', 'HUD Design', 'Game Art'],
    intro:
      'Corporations run Resonance’s arenas, pitting fighters against each other to stress-test experimental weapons and augments in front of a live audience — weapons R&D disguised as spectator sport, broadcast for entertainment. Built by a small student team in about three months for a university capstone, then submitted to IEEE GameSIG 2026.',
    chapters: [
      {
        label: 'Gameplay Trailer',
        text: 'Every match comes down to the Overdrive — a high-stakes ability that can turn a fight around, best saved for when it counts. Stay in the lead too long, though, and a spotlight turns you into the target: the whole lobby’s bounty.',
        layout: 'full-page',
        images: [
          {
            video: resonanceTrailer,
            videoMode: 'autoplay',
            poster: resonanceTrailerPoster,
            alt: 'Resonance gameplay trailer, submitted to IEEE GameSIG 2026',
          },
        ],
      },
      {
        label: 'The World',
        text: 'Two medium-sized maps support three modes apiece — Arena, Polarity, and Synthesis — each built around the same economy, so skill and loadouts carry across all of them instead of resetting per mode.',
        layout: 'two-up',
        imagesOnCard: false,
        images: [
          {
            src: resonancePoster,
            alt: 'Resonance key art poster',
            width: 1125,
            height: 2000,
          },
          {
            video: resonanceRunAlpha,
            videoMode: 'loop',
            alt: 'Resonance character running, transparent background',
            width: 480,
            height: 786,
          },
        ],
      },
      {
        label: 'Brand Identity',
        text: [
          'The wordmark went through several passes before landing on its final glitch-edged look — the same mark that carried straight into the game’s icon.',
          'That identity extended into the world itself: Azonix became the display type running through menus and HUD, and in-universe sponsors like Katto got their own weapon-skin branding, reinforcing the sponsor-driven, broadcast-for-entertainment premise.',
        ],
        layout: 'cluster',
        images: [
          {
            src: logoConcept1,
            alt: 'Resonance wordmark concept, variant one',
            width: 1600,
            height: 1067,
            size: 'lg',
          },
          {
            src: gameIcon,
            alt: 'Resonance game icon',
            width: 1200,
            height: 800,
            size: 'lg',
          },
          {
            src: logoConcept2,
            alt: 'Resonance wordmark concept, variant two',
            width: 1600,
            height: 1112,
            size: 'lg',
          },
        ],
        moreImages: [
          {
            layout: 'full-bleed',
            images: [
              {
                src: fontSpecimen,
                alt: 'Azonix display typeface specimen, full alphabet and numerals',
                width: 2000,
                height: 1250,
              },
            ],
          },
          {
            layout: 'full-bleed',
            images: [
              {
                src: weaponSkinKatto,
                alt: 'Katto sponsor weapon skin branding',
                width: 2000,
                height: 1333,
              },
            ],
          },
        ],
      },
      {
        label: 'HUD & Interface',
        text: 'The HUD had to surface rank, health, ammo, and ability cooldowns at a glance without crowding the frame — color-coded enhancement states let players read their own build mid-fight.',
        layout: 'contained',
        images: [
          {
            src: hud1,
            alt: 'Resonance in-game HUD, magenta health variant',
            width: 2000,
            height: 1117,
          },
        ],
      },
      {
        label: 'Game Over & Victory Screens',
        text: 'Both screens are built around the same audio-reactive waveform that runs through the rest of the game — the world still reacting to sound even after the match ends.',
        layout: 'contained',
        images: [
          {
            video: matchEndLoop,
            videoMode: 'loop',
            alt: 'Resonance match-end screen background, audio-reactive waveform',
            width: 1280,
            height: 720,
          },
        ],
      },
      {
        label: 'Splash Screens',
        layout: 'full-page',
        images: [
          {
            src: splash1,
            alt: 'Resonance splash screen, first variant',
          },
        ],
        moreImages: [
          {
            layout: 'full-page',
            images: [
              {
                src: splash2,
                alt: 'Resonance splash screen, second variant',
              },
            ],
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
      {
        // No label -- closing on a lifestyle shot of the shirt in wear.
        layout: 'full-page',
        tall: true,
        images: [
          {
            src: nsuLifestyleTee,
            alt: 'Model holding up an NSU t-shirt with embroidered logo',
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
        layout: 'full-page',
        images: [
          {
            src: fetchTruck,
            alt: 'fetch! doggy deli delivery truck with full brand wrap',
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
        layout: 'full-page',
        images: [
          {
            src: usSignage1,
            alt: 'Urban Seoul on-site event signage',
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
        layout: 'full-page',
        tall: true,
        images: [
          {
            src: jadeKeyArt,
            alt: 'Jade Sword final key art, character with glowing blade',
          },
        ],
      },
      {
        label: 'Expanded Studies',
        text: 'Supporting studies pushed the character and pose further before the final render locked in.',
        layout: 'cluster',
        images: [
          {
            src: jadeExpanded1,
            alt: 'Jade Sword character study, variant one',
            width: 2000,
            height: 1333,
            size: 'lg',
          },
          {
            src: jadeExpanded2,
            alt: 'Jade Sword character study, variant two',
            width: 2000,
            height: 1333,
            size: 'lg',
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
      {
        label: 'In Production',
        text: 'Placeholder chapter — add a product shot of the pattern printed on an actual tote or pouch once one exists.',
        layout: 'contained',
        images: [{ alt: 'Add a product photo of the printed tote or pouch' }],
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
        layout: 'full-page',
        images: [
          {
            src: chichaMailer,
            alt: 'Chi-Cha direct mailer design',
          },
        ],
        moreImages: [
          {
            layout: 'full-page',
            images: [
              {
                src: chichaPackagingMockup,
                alt: 'Chi-Cha blueberry packaging mockup',
              },
            ],
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
      {
        label: 'Environment & Lighting',
        text: 'Placeholder chapter — add a render or screenshot of the environment build and lighting setup once you have one.',
        layout: 'contained',
        images: [{ alt: 'Add an environment or lighting render' }],
      },
      {
        label: 'Character Animation',
        text: 'Placeholder chapter — add an animation still, turntable, or breakdown shot once you have one.',
        layout: 'contained',
        images: [{ alt: 'Add a character animation still' }],
      },
    ],
  },
}

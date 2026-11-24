import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { Draggable } from 'gsap/Draggable'
import { InertiaPlugin } from 'gsap/InertiaPlugin'
import { Observer } from 'gsap/Observer'
import { Flip } from 'gsap/Flip'

gsap.registerPlugin(ScrollTrigger, SplitText, Draggable, InertiaPlugin, Observer, Flip)

// Mobile Safari (and Chrome on Android) resize the viewport by a few
// dozen px as the address bar/toolbar shows or hides during an ordinary
// scroll -- not a real layout change, but ScrollTrigger's default
// `resize` listener would otherwise recompute every pin's start/end on
// each one of those, mid-scroll, which is exactly the kind of jank this
// is meant to prevent. Pairs with the `svh`-based heights on every
// pinned section (CinematicIntro, JourneyDesktop) -- those no longer
// change size as the toolbar toggles, so there's nothing left for a
// real resize listener to even need to catch here.
ScrollTrigger.config({ ignoreMobileResize: true })

export { gsap, ScrollTrigger, SplitText, Draggable, InertiaPlugin, Observer, Flip }

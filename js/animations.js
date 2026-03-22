import { getCurrentShowcaseCards } from './showcase.js'

/**
* GSAP plugins.
***********************************************************************************/
gsap.registerPlugin(ScrollTrigger)
gsap.registerPlugin(TextPlugin)
gsap.registerPlugin(SplitText)

let showcaseScrollTriggers = []

/**
* Animate the greeting.
***********************************************************************************/
function animateGreeting() {
  const h1 = document.querySelector('h1')
  const finalTop = h1.getBoundingClientRect().top + window.scrollY

  const tl = gsap.timeline()

  gsap.set('h1', {
    position: 'fixed',
    top: '50%',
    yPercent: -50,
    scale: 1.33,
    zIndex: 100
  })

  tl.to('.greeting', {
    duration: 0.2,
    text: 'Hi!',
    ease: 'none',
    delay: 0.5
  })
  .to('.greeting', {
    duration: 0.75,
    text: `Hi! I'm Juan`,
    ease: 'none',
    delay: 0.25
  })
  .to('h1', {
    delay: 0.25,
    duration: 0.65,
    top: finalTop,
    yPercent: 0,
    scale: 1,
    ease: 'power2.inOut'
  })
  .to('.preloader', {
    duration: 0.85,
    height: 0,
    ease: 'power2.inOut'
  }, '<')
  .set('h1', {
    clearProps: 'all'
  })

  return tl
}

/**
* Animate the intro links.
***********************************************************************************/
function animateIntroLinks() {
  const tl = gsap.timeline()

  tl.from('.intro-links a', {
    autoAlpha: 0,
    stagger: 0.15,
    ease: 'power2.inOut'
  })

  return tl
}

/**
* Animate the intro text.
***********************************************************************************/
function animateIntroText() {
  const tl = gsap.timeline()

  tl.from('.intro-text p', {
    autoAlpha: 0,
    stagger: 0.15,
    duration: 0.75,
    ease: 'power2.inOut'
  })

  return tl
}

/**
* Animate the showcase section.
***********************************************************************************/
function animateShowcaseSection() {
  const tl = gsap.timeline()

  tl.from('.showcase-buttons', {
    autoAlpha: 0,
    y: 25,
    duration: 0.75,
    ease: 'power2.inOut'
  })
  .from('.showcase-list', {
    autoAlpha: 0,
    y: 25,
    duration: 0.75,
    ease: 'power2.inOut',
    delay: 0.25
  }, '<')

  return tl
}

/**
* When showcase list changes, animate cards.
***********************************************************************************/
document.addEventListener('showcaseChanged', () => {
  animateShowcaseCards()
})

/**
* Animate showcase cards on scroll.
***********************************************************************************/
export function animateShowcaseCards() {
  // Kill old showcase scrollTriggers to prevent stale ones.
  showcaseScrollTriggers.forEach(st => st.kill())
  showcaseScrollTriggers = []

  const cards = getCurrentShowcaseCards()

  cards.forEach(card => {
    // Reset leftover inline styles from previous animations.
    gsap.set(card, { clearProps: 'all' })
  })

  // Wait one frame for layout to refresh.
  requestAnimationFrame(() => {
    ScrollTrigger.refresh()

    cards.forEach(card => {
      const anim = gsap.from(card, {
        y: 50,
        opacity: 0,
        duration: 0.75,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: card,
          start: 'top 90%',
        }
      })

      // Track this trigger so we can kill it on next switch.
      showcaseScrollTriggers.push(anim.scrollTrigger)
    })
  })
}

/**
* Wait until everything is loaded.
***********************************************************************************/
function waitForPageLoad() {
  return new Promise(resolve => {
    if (document.readyState === 'complete') resolve()
    else window.addEventListener('load', resolve)
  })
}

/**
* Wait until showcase is ready.
***********************************************************************************/
function waitForShowcaseReady() {
  return new Promise(resolve => {
    document.addEventListener('showcaseReady', resolve, { once: true })
  })
}

/**
* Start all animations after everything is loaded.
***********************************************************************************/
export async function initAnimations() {
  await Promise.all([
    waitForPageLoad(),
    waitForShowcaseReady()
  ])

  const tl = gsap.timeline()

  gsap.set('html, body', {
    overflow: 'hidden',
  })

  tl
    .add(animateGreeting())
    .add(animateIntroLinks())
    .add(animateIntroText())
    .set('html, body', { clearProps: 'all' })
    .add(animateShowcaseSection())

  animateShowcaseCards()
}
import { initAnimations } from './animations.js'
import { initShowcase } from './showcase.js'
import { toggleTheme } from './theme.js'

window.history.scrollRestoration = 'manual'
window.scrollTo(0, 0)

document.querySelector('.toggle-button').addEventListener('click', toggleTheme)

initAnimations()
initShowcase()

document.querySelector('.year').textContent = new Date().getFullYear()
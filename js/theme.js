/**
* Apply the specified theme.
***********************************************************************************/
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme)
}

/**
* Toggle themes.
***********************************************************************************/
export function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme')
  const nextTheme = currentTheme === 'light' ? 'dark' : 'light'
  applyTheme(nextTheme)
  localStorage.setItem('theme', nextTheme)
}
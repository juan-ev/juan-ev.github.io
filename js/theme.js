/**
* Apply the specified theme.
***********************************************************************************/
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme)
  const meta = document.querySelector('meta[name="theme-color"]')
  meta.setAttribute('content', theme === 'dark' ? '#1E1F23' : '#E8E6E1')
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
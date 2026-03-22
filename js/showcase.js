/**
* Handle clicking on showcase buttons (hide/show lists).
***********************************************************************************/
export function initShowcaseButtons() {
  const selectedClass = 'selected'
  const hiddenClass = 'hidden'
  const showcaseButtons = [...document.querySelectorAll('.showcase-button')]

  // On click, switch showcase lists.
  showcaseButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      // If the clicked button is already selected, do nothing.
      if (e.target.classList.contains(selectedClass)) return

      // Find and hide the currently selected list.
      const currentButton = showcaseButtons.find(button =>
        button.classList.contains(selectedClass)
      )

      if (currentButton) {
        currentButton.classList.remove(selectedClass)
        getShowcaseListForButton(currentButton).classList.add(hiddenClass)
      }

      // Select the new button and show the list.
      e.target.classList.add(selectedClass)
      getShowcaseListForButton(e.target).classList.remove(hiddenClass)

      document.dispatchEvent(new CustomEvent('showcaseChanged'))
    })
  })
}

/**
* Given a showcase button, get the associated showcase list.
***********************************************************************************/
function getShowcaseListForButton(showcaseButton) {
  return document.querySelector(`#${showcaseButton.dataset.listId}`)
}

/**
* Get the current showcase list.
***********************************************************************************/
export function getCurrentShowcaseList(showcaseButton) {
  return document.querySelector('.showcase-list:not(.hidden)')
}

/**
* Get the current showcase cards.
***********************************************************************************/
export function getCurrentShowcaseCards(showcaseButton) {
  const currentShowcaseList = getCurrentShowcaseList()
  return currentShowcaseList.querySelectorAll('.showcase-card')
}

/**
* Load and render data into a container using a template.
***********************************************************************************/
async function loadData(url, templateId, containerId) {
  try {
    const response = await fetch(url)
    const data = await response.json()
    const template = document.querySelector(`#${templateId}`)
    const container = document.querySelector(`#${containerId}`)

    data.forEach(exp => {
      container.appendChild(createShowcaseCard(exp, template))
    })
  } catch (error) {
    console.error('Error loading data: ', error)
  }
}

/**
* Set up title and image links.
***********************************************************************************/
function setupShowcaseCardLinks(clone, url, urlName) {
  const hasUrl = url && url !== ''
  const titleLink = clone.querySelector('.showcase-card-title-link')
  const imgLink = clone.querySelector('.showcase-card-img-link')
  const imgLinkIcon = clone.querySelector('.showcase-card-img-icon')

  if (hasUrl) {
    titleLink.href = url
    imgLink.href = url
    imgLinkIcon.querySelector('.showcase-card-link-name').textContent = urlName
  } else {
    titleLink.href = '#!'
    titleLink.target = '_self'
    imgLink.href = '#!'
    imgLink.target = '_self'
    imgLinkIcon.remove()
  }
}

/**
* Set up the expand/collapse toggle for a description.
***********************************************************************************/
function setupShowcaseCardReadMore(description, button) {
  button.addEventListener('click', () => {
    const isCollapsed = description.classList.contains('collapsed')

    // This is for the CSS collapsed/expanded transition to work.
    if (isCollapsed) {
      description.style.maxHeight = description.scrollHeight + 'px'
      description.classList.remove('collapsed')
    } else {
      description.style.maxHeight = description.scrollHeight + 'px'
      description.offsetHeight // Force reflow
      description.style.maxHeight = null
      description.classList.add('collapsed')
    }
    button.textContent = isCollapsed ? 'Read less' : 'Read more'
  })

  // Don't display the read more button if not necessary. Wait for one
  // frame in order to wait for the layout to be refreshed.
  requestAnimationFrame(() => {
    if (description.scrollHeight <= description.offsetHeight) {
      button.style.display = 'none'
      description.classList.remove('collapsed')
    }
  })
}

/**
* Create a showcase card from template and data.
***********************************************************************************/
function createShowcaseCard(data, template) {
  const clone = template.content.cloneNode(true)

  setupShowcaseCardLinks(clone, data.url, data.urlName)

  // Content.
  clone.querySelector('.showcase-card-title').textContent = data.title
  clone.querySelector('.showcase-card-subtitle').textContent = data.subtitle

  const img = clone.querySelector('.showcase-card-img')
  img.src = data.media
  img.alt = data.title

  const description = clone.querySelector('.showcase-card-description')
  description.textContent = data.description

  setupShowcaseCardReadMore(description, clone.querySelector('.showcase-card-read-more'))

  const tagsContainer = clone.querySelector('.showcase-card-tags')
  data.tags.forEach(tag => {
    const li = document.createElement('li')
    li.textContent = tag
    tagsContainer.appendChild(li)
  })

  return clone
}

/**
* Initialize showcase - load all data and setup interactions
***********************************************************************************/
export async function initShowcase() {
  initShowcaseButtons()
  await loadData('../data/experience.json', 'experience-card', 'showcase-experience')
  await loadData('../data/side-projects.json', 'side-project-card', 'showcase-side-projects')

  document.dispatchEvent(new CustomEvent('showcaseReady'))
}
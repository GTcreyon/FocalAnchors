const focalAnchors = {}

focalAnchors.attrName = 'has-focal-anchors'
// this attribute marks containers that already have anchors assigned
// containers with the attribute have the anchors removed rather than readded

focalAnchors.toggleAnchors = function (id) { // eslint-disable-line
  const container = document.getElementById(id)
  if (container.hasAttribute(focalAnchors.attrName)) {
    focalAnchors.clearAnchors(container)
  } else {
    focalAnchors.addAnchorsToContainer(container)
  }
}

// clear all anchors inside a container
focalAnchors.clearAnchors = function (container) {
  container.innerHTML = container.innerHTML.replaceAll('<b>', '')
  focalAnchors.clearElementByRef(container)
}

// add anchors to children of container, recursively
focalAnchors.addAnchorsToContainer = function (container) {
  const stack = [container]
  while (stack.length > 0) {
    const topElement = stack.pop()
    Array.from(topElement.childNodes).forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) { // eslint-disable-line
        focalAnchors.markElementByRef(node.parentNode)
        focalAnchors.injectAnchorText(node)
        node.parentNode.removeChild(node)
      } else {
        if (!node.hasAttribute(focalAnchors.attrName)) {
          stack.push(node)
        }
      }
    })
  }
}

// add anchor points to a text string
focalAnchors.injectAnchorText = function (node) {
  const words = node.textContent.split(' ')
  for (let wordID = 0; wordID < words.length; wordID++) {
    let word = words[wordID]
    const length = word.replaceAll(/\W/g, '').length
    const boldNum = Math.min(Math.ceil(length / 2), 2)
    if (length > 0) {
      word = '<b>' + word.substring(0, boldNum) + '</b>' + word.substring(boldNum)
    } else {
      word = ''
    }
    words[wordID] = word
  }

  // workaround to parse HTML lazily
  const dummy = document.createElement('div')
  dummy.innerHTML = words.join(' ')
  const nodes = Array.from(dummy.childNodes)
  nodes.forEach(dummyNode => {
    node.parentNode.insertBefore(dummyNode, node)
  })
}

focalAnchors.markElementById = function (id) {
  document.getElementById(id).setAttribute(focalAnchors.attrName, '')
}

focalAnchors.markElementByRef = function (element) {
  element.setAttribute(focalAnchors.attrName, '')
}

focalAnchors.clearElementById = function (id) {
  document.getElementById(id).removeAttribute(focalAnchors.attrName)
}

focalAnchors.clearElementByRef = function (element) {
  element.removeAttribute(focalAnchors.attrName)
}

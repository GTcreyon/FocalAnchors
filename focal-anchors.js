const focalAnchors = {}

focalAnchors.attrNameContainer = 'focal-anchors-has'
// this attribute marks elements that already have anchors assigned
// elements with the attribute have the anchors removed rather than readded

focalAnchors.attrNameHighlight = 'focal-anchor-is'
// this attribute marks the anchor tags themselves
// elements with the attribute are removed and merged when clearing anchors

focalAnchors.classNameHighlight = 'focal-anchor'
// this class is used on focal anchor tags to give them css styling

focalAnchors.toggleAnchors = function (id) { // eslint-disable-line
  const container = document.getElementById(id)
  if (container.hasAttribute(focalAnchors.attrNameContainer)) {
    focalAnchors.clearAnchors(container)
  } else {
    focalAnchors.addAnchorsToContainer(container)
  }
}

// clear all anchors inside a container
focalAnchors.clearAnchors = function (container) {
  const stack = [container]
  while (stack.length > 0) {
    const topElement = stack.pop()
    topElement.removeAttribute(focalAnchors.attrNameContainer)
    Array.from(topElement.childNodes).forEach(node => {
      if (node.nodeType !== Node.TEXT_NODE) { // eslint-disable-line
        if (node.hasAttribute(focalAnchors.attrNameContainer)) {
          stack.push(node)
        }
        if (node.hasAttribute(focalAnchors.attrNameHighlight)) {
          const prev = node.previousSibling
          const next = node.nextSibling
          if (prev !== null && prev.nodeType === Node.TEXT_NODE) { // eslint-disable-line
            // merge with previous node
            prev.textContent += node.textContent
            if (next.nodeType === Node.TEXT_NODE) { // eslint-disable-line
              // merge with next node
              prev.textContent += next.textContent
              node.parentNode.removeChild(next)
            }
          } else if (next !== null && next.nodeType === Node.TEXT_NODE) { // eslint-disable-line
            next.textContent = node.textContent + next.textContent
          } else {
            // if there are no adjacent text nodes, just insert
            node.parentNode.insertBefore(document.createTextNode(node.textContent), node)
          }
          node.parentNode.removeChild(node)
        }
      }
    })
  }
}

// add anchors to children of container, recursively
focalAnchors.addAnchorsToContainer = function (container) {
  const stack = [container]
  while (stack.length > 0) {
    const topElement = stack.pop()
    Array.from(topElement.childNodes).forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) { // eslint-disable-line
        node.parentNode.setAttribute(focalAnchors.attrNameContainer, '')
        focalAnchors.injectAnchorText(node)
        node.parentNode.removeChild(node)
      } else {
        if (!node.hasAttribute(focalAnchors.attrNameHighlight)) {
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
    const word = words[wordID]
    const length = word.replaceAll(/\W/g, '').length
    const boldNum = Math.min(Math.ceil(length / 2), 2)
    if (length > 0) {
      const bold = document.createElement('b')
      bold.setAttribute('class', focalAnchors.classNameHighlight)
      bold.setAttribute(focalAnchors.attrNameHighlight, '')
      bold.textContent = word.substring(0, boldNum)
      node.parentNode.insertBefore(bold, node)
      node.parentNode.insertBefore(document.createTextNode(word.substring(boldNum) + ' '), node)
    }
  }
}

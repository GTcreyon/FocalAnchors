const focalAnchors = {}

focalAnchors.attrNameContainer = 'focal-anchors-has'
// This attribute marks elements that already have anchors assigned.
// Elements with the attribute have the anchors removed rather than readded.

focalAnchors.attrNameHighlight = 'focal-anchor-is'
// This attribute marks the anchor tags themselves.
// Elements with the attribute are removed and merged when clearing anchors.

focalAnchors.classNameHighlight = 'focal-anchor'
// This class is used on focal anchor tags to give them css styling.

focalAnchors.toggleAnchorsById = function (id) {
  focalAnchors.toggleAnchorsByRef(document.getElementById(id))
}

focalAnchors.toggleAnchorsByRef = function (container) {
  if (container.hasAttribute(focalAnchors.attrNameContainer)) {
    focalAnchors.clearAnchors(container)
  } else {
    focalAnchors.addAnchorsToContainer(container)
  }
}

// Clear all anchors inside a container.
focalAnchors.clearAnchors = function (container) {
  const stack = [container]
  while (stack.length > 0) {
    const topElement = stack.pop()
    topElement.removeAttribute(focalAnchors.attrNameContainer)
    Array.from(topElement.childNodes).forEach(node => {
      if (node.nodeType !== Node.TEXT_NODE) {
        if (node.hasAttribute(focalAnchors.attrNameContainer)) {
          stack.push(node)
        }
        if (node.hasAttribute(focalAnchors.attrNameHighlight)) {
          const prev = node.previousSibling
          const next = node.nextSibling
          if (prev !== null && prev.nodeType === Node.TEXT_NODE) {
            // Merge with previous node.
            prev.textContent += node.textContent
            if (next.nodeType === Node.TEXT_NODE) {
              // Merge with next node.
              prev.textContent += next.textContent
              node.parentNode.removeChild(next)
            }
          } else if (next !== null && next.nodeType === Node.TEXT_NODE) {
            next.textContent = node.textContent + next.textContent
          } else {
            // If there are no adjacent text nodes, just insert.
            node.parentNode.insertBefore(document.createTextNode(node.textContent), node)
          }
          node.parentNode.removeChild(node)
        }
      }
    })
  }
}

// Add anchors to children of container, recursively.
focalAnchors.addAnchorsToContainer = function (container) {
  const stack = [container]
  while (stack.length > 0) {
    const topElement = stack.pop()
    Array.from(topElement.childNodes).forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        node.parentNode.setAttribute(focalAnchors.attrNameContainer, '')
        focalAnchors.injectAnchorText(node)
        node.parentNode.removeChild(node)
      } else {
        if (!node.hasAttribute(focalAnchors.attrNameContainer)) {
          stack.push(node)
        }
      }
    })
  }
}

// Add anchor points to a text string.
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

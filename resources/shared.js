/* global chrome, browser */

function inFirefox () {
  if (window.location.protocol.indexOf('moz-') === 0) {
    return true
  }
  return false
}

function inIframe () {
  try {
    return window.self !== window.top
  } catch (e) {
    return true
  }
}

function getBrowser () {
  try {
    if (typeof chrome !== 'undefined') {
      return chrome
    }
    if (typeof browser !== 'undefined') {
      return browser
    }
  } catch (e) {
    console.log('no-direct-ip: failed to get the browser:', e)
  }
  return null
}

function getStorageMechanism () {
  const b = getBrowser()
  if (b === null) { return null }
  const storageMechanism = typeof b.storage !== 'undefined'
    ? (
        typeof b.storage.sync !== 'undefined' ? b.storage.sync : b.storage.local
      )
    : null
  return storageMechanism
}

function doesStorageMechanismExist () {
  return getStorageMechanism() !== null
}

function doesBrowserSearchQueryExists () {
  // chromium / v3 based
  const b = getBrowser()
  return (
    b !== null &&
    typeof (b.search) !== 'undefined' &&
    typeof (b.search.query) !== 'undefined'
  )
}

function doesBrowserSearchSearchExists () {
  // firefox / v2 based
  const b = getBrowser()
  return (
    b !== null &&
    typeof (b.search) !== 'undefined' &&
    typeof (b.search.search) !== 'undefined'
  )
}

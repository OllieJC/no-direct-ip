/* global browser, chrome, module */

import * as rules from './rules.js'

if (typeof (chrome) !== 'undefined') {
  browser = chrome
}

export function checkIp (details) {
  const url = new URL(details.url)
  const hostname = url.hostname

  let cancel = false

  if (hostname.length > 0 && (hostname.indexOf('.') > -1 || hostname.indexOf(':') > -1)) {
    let shouldSkip = false
    rules.getRules(true).forEach(function (i, n) {
      if (shouldSkip) {
        return
      }
      if (i[1].test(hostname)) {
        if (i[0] === 'allow') {
          shouldSkip = true
        } else if (i[0] === 'redirect') {
          cancel = true
          shouldSkip = true
        }
      }
    })
  }

  if (cancel) {
    console.log(`no-direct-ip: blocked access to: ${hostname}`)
    if (typeof (browser) !== 'undefined') {
      return { redirectUrl: browser.runtime.getURL('resources/blocked.html?hostname=' + hostname) }
    }
  }

  return { cancel: cancel }
}

if (typeof (browser) !== 'undefined') {
  browser.webRequest.onBeforeRequest.addListener(
    checkIp,
    { urls: ['<all_urls>'] },
    ['blocking']
  )
  console.log('no-direct-ip: added listener to browser')
}

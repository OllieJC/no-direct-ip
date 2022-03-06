/* global browser, module */

import * as rules from './rules.js'

const globalIPRules = rules.getRules(true)

export function checkIp (details, b) {
  const url = new URL(details.url)
  const hostname = url.hostname

  let cancel = false

  if (
    hostname.length > 0 && (
      !/\.[a-z]/i.test(hostname) || hostname.indexOf(':') > -1
    )
  ) {
    for (let i = 0; i < globalIPRules.length; i++) {
      if (globalIPRules[i][1].test(hostname)) {
        if (globalIPRules[i][0] === 'allow') {
          break
        } else if (globalIPRules[i][0] === 'redirect') {
          cancel = true
          break
        }
      }
    }
  }

  if (cancel) {
    console.log(`no-direct-ip: blocked access to: ${hostname}`)
    const hasBrowser = typeof (browser) !== 'undefined'
    if (hasBrowser || typeof (b) !== 'undefined') {
      const url = (hasBrowser ? browser : b).runtime.getURL('resources/blocked.html?hostname=' + hostname)
      return { redirectUrl: url }
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

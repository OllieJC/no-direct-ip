/* global browser, module */

import * as rules from './rules.js'

export function checkIp (details) {
  const url = new URL(details.url)
  const hostname = url.hostname

  let cancel = false

  if (
    hostname.length > 0 && (
      !/\.[a-z]/i.test(hostname) || hostname.indexOf(':') > -1
    )
  ) {
    let shouldSkip = false
    let ipRules = rules.getRules(true)
    for (var i = 0; i < ipRules.length; i++) {
      if (ipRules[i][1].test(hostname)) {
        if (ipRules[i][0] === 'allow') {
          break
        } else if (ipRules[i][0] === 'redirect') {
          cancel = true
          break
        }
      }
    }
  }

  if (cancel) {
    console.log(`no-direct-ip: blocked access to: ${hostname}`)
    if (typeof (browser) !== 'undefined') {
      let url = browser.runtime.getURL('resources/blocked.html?hostname=' + hostname)
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

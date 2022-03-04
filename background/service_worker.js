/* global browser, chrome, module */

import * as rules from './rules.js'

function trim (str, ch) {
  let start = 0
  let end = str.length
  while (start < end && str[start] === ch) { ++start }
  while (end > start && str[end - 1] === ch) { --end }
  return (start > 0 || end < str.length) ? str.substring(start, end) : str
}

rules.getRules().forEach(function (i, n) {
  const id = n + 1
  chrome.declarativeNetRequest.updateDynamicRules(
    {
      addRules: [
        {
          id: id,
          priority: i[2],
          action: (i[0] === 'redirect'
            ? {
                type: 'redirect',
                redirect: {
                  regexSubstitution: chrome.runtime.getURL('resources/blocked.html') + '?hostname=\\1&path='
                }
              }
            : { type: 'allow' }),
          condition: {
            regexFilter: trim(trim(i[1], 'i'), '/'),
            resourceTypes: ['main_frame']
          }
        }
      ],
      removeRuleIds: [id]
    }
  )
})

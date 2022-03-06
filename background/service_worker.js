/* global browser, chrome, module */

import * as rules from './rules.js'
import * as utils from './utils.js'

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
            regexFilter: utils.trimListOfCharacters(i[1], ['i', '/']),
            resourceTypes: ['main_frame']
          }
        }
      ],
      removeRuleIds: [id]
    }
  )
})

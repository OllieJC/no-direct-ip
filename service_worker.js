/* global browser, chrome, module */

[
  ['allow', '^\\w+://(10|127)\\.\\d+\\.\\d+\\.\\d+(?:\\:\\d+)?(?:\\/|$)'],
  ['allow', '^\\w+://(?:192\\.168|169\\.254)\\.\\d+\\.\\d+(?:\\:\\d+)?(?:\\/|$)'],
  ['allow', '^\\w+://172\\.(?:1[6789]|2\\d|3[01])\\.\\d+\\.\\d+(?:\\:\\d+)?(?:\\/|$)'],
  ['redirect', '^\\w+://(\\d+\\.\\d+\\.\\d+\\.\\d+)(?:\\:\\d+)?(?:\\/|$)'],
  ['allow', '(?i)^\\w+://\\[(?:fd[a-f0-9]*:+[a-f0-9:]+|(?:[0:]+)+1)\\](?:\\:\\d+)?(?:\\/|$)'],
  ['redirect', '(?i)^\\w+://(\\[(?:[0-9:a-f]*:[0-9:a-f]*)\\])(?:\\:\\d+)?(?:\\/|$)]']
].forEach(function (i, n) {
  const id = n + 1
  chrome.declarativeNetRequest.updateDynamicRules(
    {
      addRules: [
        {
          id: id,
          priority: 1,
          action: (i[0] === 'redirect'
            ? {
                type: 'redirect',
                redirect: {
                  regexSubstitution: chrome.runtime.getURL('resources/blocked.html') + '?hostname=\\1'
                }
              }
            : { type: 'allow' }),
          condition: {
            regexFilter: i[1],
            resourceTypes: ['main_frame']
          }
        }
      ],
      removeRuleIds: [id]
    }
  )
})

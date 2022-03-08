/* global getTranslation, getStorageMechanism, getBrowser, doesBrowserSearchQueryExists, doesBrowserSearchSearchExists */

const urlparams = new URLSearchParams(window.location.search)
const hostname = urlparams.get('hostname')
const storageMechanism = getStorageMechanism()

function showContainer () {
  document.getElementsByClassName('container')[0].style.display = 'block'
}
function searchError (e) {
  console.log('no-direct-ip: doSearch error:', e)
  showContainer()
}

function doSearch () {
  const browser = getBrowser()
  try {
    if (storageMechanism === null) {
      throw new Error('No storageMechanism')
    }

    const storageMechanismResult = new Promise(resolve => storageMechanism.get('blockedAction', resolve))
    storageMechanismResult.then((s) => {
      if (typeof (s.blockedAction) === 'undefined') {
        throw new Error('No blockedAction')
      }

      if (s.blockedAction !== 'search') {
        throw new Error("blockedAction isn't 'search'")
      }

      if (doesBrowserSearchQueryExists()) {
        browser.search.query({
          text: hostname
        })
      } else if (doesBrowserSearchSearchExists()) {
        const tabsQueryResult = new Promise(resolve => browser.tabs.query({
          currentWindow: true,
          active: true
        }, resolve))
        tabsQueryResult.then((queryInfo) => {
          console.log('no-direct-ip: queryInfo:', queryInfo)
          if (
            queryInfo.length === 1 &&
            typeof (queryInfo[0].id) !== 'undefined'
          ) {
            browser.search.search({
              query: hostname,
              tabId: queryInfo[0].id
            })
          }
        }).catch(err => searchError(err))
      }
    }).catch(err => searchError(err))
  } catch (e) {
    searchError(e)
  }
}

window.onload = function () {
  const blocked = getTranslation('Blocked')
  document.getElementsByTagName('h1')[0].innerText = blocked
  document.title = blocked

  if (typeof (hostname) === 'string' && hostname.length > 0) {
    document.getElementById('hostname-label').innerText = hostname
    document.title += ' - ' + hostname
  }

  doSearch()

  // this is to catch some error and display the blocked page
  window.setTimeout(showContainer, 2000)
}

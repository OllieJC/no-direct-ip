/* global getTranslation, getStorageMechanism, inFirefox, inIframe, getBrowser */

const storageMechanism = getStorageMechanism()

if (!inFirefox() && !inIframe()) {
  document.getElementsByTagName('html')[0].classList.remove('in-frame')
}

function blockedActionOnChange () {
  let continueForEach = true
  document.getElementsByName('blockedAction').forEach((s) => {
    if (!continueForEach) {
      return false
    }
    if (s.checked) {
      if (storageMechanism !== null) {
        storageMechanism.set({ blockedAction: s.value })
        console.log('no-direct-ip: setting blockedAction to', s.value)
      } else {
        console.log('no-direct-ip: setting blockedAction failed')
      }
      continueForEach = false
    }
  })
}

function setBlockedAction (toValue) {
  document.getElementsByName('blockedAction').forEach((s) => {
    s.checked = false
    if (s.value === toValue) {
      s.checked = true
    }
    s.onchange = blockedActionOnChange
  })
}

window.onload = function () {
  document.getElementById('h2BlockedAction').innerText = getTranslation('Blocked Action')
  document.getElementById('lblForBlockedAction').innerText = getTranslation('Choose the action to take when visiting a blocked IP address:')
  document.getElementById('op1lbl').innerText = getTranslation('Show blocked page')
  document.getElementById('op2lbl').innerText = getTranslation('Redirect to default search')

  document.getElementById('preDebug').innerText = window.location.protocol + '\ninFirefox: ' + inFirefox() + '\ninIframe: ' + inIframe()

  if (storageMechanism !== null) {
    storageMechanism.get('blockedAction', function (s) {
      console.log('no-direct-ip: blockedAction:', s)
      if (typeof (s.blockedAction) !== 'undefined') {
        setBlockedAction(s.blockedAction)
      }
    })
  }

  document.getElementsByName('blockedAction').forEach((s) => {
    s.onchange = blockedActionOnChange
  })

  const b = getBrowser()

  if (
    b === null ||
    storageMechanism === null
  ) {
    document.getElementById('op1').disabled = 'disabled'
    const pageLabel = document.getElementById('op1lbl')
    pageLabel.title = getTranslation('Not available in this browser')
    pageLabel.innerText += ' (' + getTranslation('not available') + ')'
  }

  if (
    b === null ||
    storageMechanism === null ||
    (b !== null && typeof (b.search) === 'undefined')
  ) {
    // Disable search option
    document.getElementById('op2').disabled = 'disabled'
    const searchLabel = document.getElementById('op2lbl')
    searchLabel.title = getTranslation('Not available in this browser')
    searchLabel.innerText += ' (' + getTranslation('not available') + ')'
  }
}

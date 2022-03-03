/* global getTranslation */

window.onload = function () {
  const blocked = getTranslation('Blocked')
  document.getElementsByTagName('h1')[0].innerText = blocked
  document.title = blocked

  const urlParams = new URLSearchParams(window.location.search)
  const hostname = urlParams.get('hostname')

  if (typeof (hostname) === 'string' && hostname.length > 0) {
    document.getElementById('hostname-label').innerText = hostname
    document.title += ' - ' + hostname
  }

  document.getElementsByClassName('container')[0].style.display = 'block'
}

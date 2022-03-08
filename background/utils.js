/* global browser, chrome */

export function trim (str, ch) {
  let start = 0
  let end = str.length
  while (start < end && str[start] === ch) { ++start }
  while (end > start && str[end - 1] === ch) { --end }
  return (start > 0 || end < str.length) ? str.substring(start, end) : str
}

export function trimListOfCharacters (str, l) {
  for (let i = 0; i < l.length; i++) {
    str = trim(str, l[i])
  }
  return str
}

export function getBrowser () {
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

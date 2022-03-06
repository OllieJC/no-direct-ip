#!/usr/bin/env jest

import * as background from './background.js'

describe('checkIp tests', () => {
  test('external IP should result in a cancelled request', () => {
    expect(background.checkIp({ url: 'https://1.1.1.1' })).toEqual({ cancel: true })
  })

  test('external IP with port should result in a cancelled request', () => {
    expect(background.checkIp({ url: 'https://8.8.8.8:8443' })).toEqual({ cancel: true })
  })

  test('private IP should not be cancelled', () => {
    expect(background.checkIp({ url: 'https://10.0.0.1' })).toEqual({ cancel: false })
  })

  test('localhost IP should not be cancelled', () => {
    expect(background.checkIp({ url: 'https://127.0.0.1' })).toEqual({ cancel: false })
  })

  test('localhost IP with port should not be cancelled', () => {
    expect(background.checkIp({ url: 'https://127.0.0.1:8443' })).toEqual({ cancel: false })
  })

  test('example URL should work and not be cancelled', () => {
    expect(background.checkIp({ url: 'https://example.com' })).toEqual({ cancel: false })
  })

  test('a file URL should work and not be cancelled', () => {
    expect(background.checkIp({ url: 'file://../test' })).toEqual({ cancel: false })
  })

  test('empty URL should fail', () => {
    try {
      background.checkIp({ url: '' })
    } catch (error) {
      expect(error.message).toBe('Invalid URL')
    }
  })
})

describe('with browser tests', () => {
  const browser = {}
  browser.runtime = {}
  browser.runtime.getURL = function (t) {
    return t
  }
  browser.webRequest = {}
  browser.webRequest.onBeforeRequest = {}
  browser.webRequest.onBeforeRequest.addListener = function (f, u, p) {
    return true
  }

  const consoleSpy = jest.spyOn(console, 'log');

  test('external IP should result in a redirected request', () => {
    expect(background.checkIp({ url: 'https://1.1.1.1' }, browser)).toEqual(
      { "redirectUrl": "resources/blocked.html?hostname=1.1.1.1" }
    )
    expect(consoleSpy).toHaveBeenCalledWith('no-direct-ip: blocked access to: 1.1.1.1')
  })
})

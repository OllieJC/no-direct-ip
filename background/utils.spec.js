#!/usr/bin/env jest

import * as utils from './utils.js'


describe('utils trim functions', () => {
  test('trim with empty input returns empty output', () => {
    const t1 = utils.trim('', 't')
    expect(t1).toBe("")
  })

  test('trim with empty character does nothing', () => {
    const t1 = utils.trim('testing   ', '')
    expect(t1).toBe("testing   ")
  })

  test('trim removes the right characters', () => {
    const t1 = utils.trim('testing the test', 't')
    expect(t1).toBe("esting the tes")
  })

  test('trimListOfCharacters removes the right characters', () => {
    const t1 = utils.trimListOfCharacters('testing the test', ['t', 's'])
    expect(t1).toBe("esting the te")
  })

  test('trimListOfCharacters removes the mulitples of the same characters', () => {
    const t1 = utils.trimListOfCharacters('aaaaabc___1234__a__', ['_', 'a'])
    expect(t1).toBe("bc___1234__")
  })
})

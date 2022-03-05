#!/usr/bin/env jest

import * as rules from './rules.js'


describe('rules IPv6 tests', () => {
  test('cidrToRegex should generate an IPv6/8 bit regex correctly', () => {
    const r1 = rules.cidrToRegex("fd00::/8")

    expect(r1.test("fd12:3456:789a:1::")).toEqual(true)

    expect(r1.test("0000:fd00::")).toEqual(false)
  })

  test('cidrToRegex should generate an IPv6/128 bit regex correctly', () => {
    const r1 = rules.cidrToRegex("::1/128")

    expect(r1).toEqual(/^(?:(?:https?|[a-z\.-]+):\/\/)?\[?[0:]+:0*1\]?(?:\:[0-9]+)?(?:\/|$)/i)

    expect(r1.test("::1")).toEqual(true)
    expect(r1.test("0:0:0:0:0:0:0:0001")).toEqual(true)
    expect(r1.test("0000:0000:0000:0000:0000:0000:0000:0001")).toEqual(true)

    expect(r1.test("2001:0db8:85a3:0000:0000:8a2e:0370:7334")).toEqual(false)
    expect(r1.test("2001::1")).toEqual(false)
    expect(r1.test("[2001::1]")).toEqual(false)
    expect(r1.test("https://[2001::1]")).toEqual(false)
    expect(r1.test("https://[2001::1]:8443")).toEqual(false)
    expect(r1.test("https://[2001::1]:8443/path")).toEqual(false)
  })
})


describe('rules IPv4 tests', () => {
  test('cidrToRegex should generate an IPv4 regex correctly', () => {
    const r1 = rules.cidrToRegex("10.0.0.0/8")

    expect(r1).toEqual(/^(?:(?:https?|[a-z\.-]+):\/\/)?10\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?:\:[0-9]+)?(?:\/|$)/i)

    expect(r1.test("10.0.0.1")).toEqual(true)
    expect(r1.test("https://10.0.0.1")).toEqual(true)
    expect(r1.test("https://10.0.0.1:8443")).toEqual(true)
    expect(r1.test("https://10.0.0.1:8443/")).toEqual(true)
    expect(r1.test("https://10.0.0.1:8443/path")).toEqual(true)

    expect(r1.test("10.1.1.256")).toEqual(false)
    expect(r1.test("1.1.1.1")).toEqual(false)
    expect(r1.test("example.com")).toEqual(false)
    expect(r1.test("10.0.0.0.example.com")).toEqual(false)
  })

  test('cidrToRegex should generate an IPv4/16 bit regex correctly', () => {
    const r1 = rules.cidrToRegex("192.168.0.0/16")

    expect(r1.test("192.168.0.1")).toEqual(true)

    expect(r1.test("10.0.0.1")).toEqual(false)
  })

  test('cidrToRegex should generate an IPv4/12 bit regex correctly', () => {
    const r1 = rules.cidrToRegex("172.16.0.0/12")

    expect(r1.test("172.16.0.1")).toEqual(true)
    expect(r1.test("172.31.128.128")).toEqual(true)

    expect(r1.test("172.15.0.1")).toEqual(false)
    expect(r1.test("172.32.0.1")).toEqual(false)
  })

  test('cidrToRegex should generate an IPv4/24 bit regex correctly', () => {
    const r1 = rules.cidrToRegex("1.1.1.0/24")

    expect(r1.test("1.1.1.1")).toEqual(true)
    expect(r1.test("1.1.1.128")).toEqual(true)
    expect(r1.test("1.1.1.255")).toEqual(true)

    expect(r1.test("1.1.0.0")).toEqual(false)
    expect(r1.test("1.1.1.256")).toEqual(false)
  })

  test('cidrToRegex should generate an IPv4/32 bit regex correctly', () => {
    const r1 = rules.cidrToRegex("192.168.0.1/32")

    expect(r1.test("192.168.0.1")).toEqual(true)

    expect(r1.test("192.168.0.10")).toEqual(false)
  })
})

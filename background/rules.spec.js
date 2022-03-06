#!/usr/bin/env jest

import * as rules from './rules.js'

describe('IPv4 CIDR functions', () => {
  test('calculateCidrIPv4Range returns valid range with a 10 bit mask', () => {
    const cr1 = rules.calculateCidrIPv4Range("10.64.0.0/10")
    expect(cr1.length).toBe(2)
    expect(cr1).toEqual(["10.64.0.0", "10.127.255.255"])
  })

  test('calculateCidrIPv4Range returns valid range with no mask', () => {
    const cr1 = rules.calculateCidrIPv4Range("127.0.0.1")
    expect(cr1.length).toBe(2)
    expect(cr1).toEqual(["127.0.0.1", "127.0.0.1"])
  })
})


describe('getting all rules using getRules', () => {
  test('the default return a valid list of lists', () => {
    const rs1 = rules.getRules()

    expect(rs1.length).toBeGreaterThan(0)

    expect(typeof(rs1[0][1])).toBe("string")
    const re1 = new RegExp(rs1[0][1])
    expect(re1.test("test")).toBe(false)

    rs1.forEach(function (i, n) {
      expect(i.length).toBe(3)
      expect(i[1]).not.toContain("{") // Chrome doesn't support (results in too complex error)
    })
  })

  test('should be able to return RegExp objects', () => {
    const rs1 = rules.getRules(true)

    expect(typeof(rs1[0][1])).toBe("object")
    expect(typeof(rs1[0][1].test)).toBe("function")
    expect(rs1[0][1].test("test")).toBe(false)
  })
})


describe('rules IPv6 tests', () => {
  test('cidrToRegex should generate an IPv6/8 bit regex correctly', () => {
    const r1 = rules.cidrToRegex("fd00::/8")

    expect(r1.test("fd12:3456:789a:1::")).toEqual(true)

    expect(r1.test("fd12:FF56:78Da:1::")).toEqual(true)

    expect(r1.test("0000:fd00::")).toEqual(false)
  })

  test('cidrToRegex should generate an IPv6/128 bit regex correctly', () => {
    const r1 = rules.cidrToRegex("::1/128")

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

  test('cidrToRegex should not generate an IPv6/20 bit regex', () => {
    expect(() => {rules.cidrToRegex("fd00::/20")}).toThrowError('IPv6 mask not implemented: 20')
  })

  test('cidrToRegex with IPv6 and without bit mask should default to 128', () => {
    const r1 = rules.cidrToRegex("fd00:3456::")

    expect(r1.test("fd00:3456::0000")).toEqual(true)

    expect(r1.test("fd00:3456:789a:1::0000")).toEqual(false)

    expect(r1.test("fd12:3456:0000::1")).toEqual(false)
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

  test('cidrToRegex with IPv4/0 to match any IPv4', () => {
    const r1 = rules.cidrToRegex("192.168.0.1/0")

    expect(r1.test("192.168.0.1")).toEqual(true)
    expect(r1.test("1.1.1.1")).toEqual(true)
    expect(r1.test("255.255.255.255")).toEqual(true)
    expect(r1.test("127.0.0.1")).toEqual(true)
    expect(r1.test("10.0.12.34")).toEqual(true)
    expect(r1.test("0.0.0.0")).toEqual(true)
  })

  test('cidrToRegex with IPv4 and without bit mask should default to 32', () => {
    const r1 = rules.cidrToRegex("192.168.0.1")

    expect(r1.test("192.168.0.1")).toEqual(true)

    expect(r1.test("192.168.0.0")).toEqual(false)
    expect(r1.test("192.168.0.2")).toEqual(false)
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

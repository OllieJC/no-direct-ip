function allowedIPs () {
  return [
    '127.0.0.0/8',
    '10.0.0.0/8',
    '172.16.0.0/12',
    '192.168.0.0/16',
    '169.254.0.0/16',
    '::1/128',
    'fd00::/8'
  ]
}

const ip4ToInt = ip => ip.split('.').reduce(
  (int, oct) => (int << 8) + parseInt(oct, 10), 0
) >>> 0

const intToIp4 = int => [
  (int >>> 24) & 0xFF, (int >>> 16) & 0xFF, (int >>> 8) & 0xFF, int & 0xFF
].join('.')

const calculateCidrIPv4Range = cidr => {
  const [range, bits = 32] = cidr.split('/')
  const mask = ~(2 ** (32 - bits) - 1)
  return [intToIp4(ip4ToInt(range) & mask), intToIp4(ip4ToInt(range) | ~mask)]
}

function intRange (start, end) {
  return Array(
    parseInt(end) - parseInt(start) + 1
  ).fill().map((_, idx) => parseInt(start) + idx)
}

const anyIPv4Octet = '(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)'

function cidrIPv4ToRegexString (cidr) {
  const range = calculateCidrIPv4Range(cidr)

  const startIP = range[0].split('.')
  const endIP = range[1].split('.')

  let res = ''

  for (let i = 0; i < startIP.length; i++) {
    if (startIP[i] === endIP[i]) {
      res += startIP[i]
    } else if (startIP[i] === '0' && endIP[i] === '255') {
      res += anyIPv4Octet
    } else {
      res += '(?:' + intRange(startIP[i], endIP[i]).join('|') + ')'
    }
    if (i !== 3) {
      res += '\\.'
    }
  }

  return res
}

export function cidrToRegex (cidr) {
  let mask = 0
  let ip = ''

  if (cidr.indexOf('/') > -1) {
    mask = parseInt(cidr.split('/')[1])
    ip = cidr.split('/')[0]
  } else {
    ip = cidr
  }

  let res = '^(?:\\w+://)?'

  if (cidr.indexOf(':') > -1) {
    // IPv6
    if (mask === 0) { mask = 128 }
    const ipv6 = ip.split(':')

    res += '\\[?'
    switch (mask) {
      case 128:
        res += '(?:[0:]+)+:0*' + ipv6[ipv6.length - 1]
        break
      case 8:
        res += ipv6[0][0] + ipv6[0][1] + '[a-f0-9]*:+[a-f0-9:]+'
        break
      default:
        throw new Error('IPv6 mask not implemented: ' + mask)
    }

    res += '\\]?'
  } else {
    // IPv4
    if (mask === 0) { mask = 32 }
    const ipv4 = ip.split('.')
    switch (mask) {
      case 0:
        break
      case 8:
        res += ipv4[0] + '\\.'
        res += anyIPv4Octet + '\\.' + anyIPv4Octet + '\\.' + anyIPv4Octet
        break
      case 16:
        res += ipv4[0] + '\\.' + ipv4[1] + '\\.'
        res += anyIPv4Octet + '\\.' + anyIPv4Octet
        break
      case 24:
        res += ipv4[0] + '\\.' + ipv4[1] + '\\.' + ipv4[2] + '\\.'
        res += anyIPv4Octet
        break
      case 32:
        res += ipv4.join('\\.')
        break
      default:
        res += cidrIPv4ToRegexString(ip + '/' + mask)
    }
  }

  res += '(?:\\:[0-9]+)?(?:\\/|$)'

  return new RegExp(res, 'i')
}

export function getRules (asRegexObj) {
  if (typeof (asRegexObj) === 'undefined') {
    asRegexObj = false
  }

  const res = []

  allowedIPs().forEach(function (i) {
    let r = cidrToRegex(i)
    if (!asRegexObj) {
      r = r.toString()
    }
    res.push(['allow', r, 20])
  })

  const ipv4CatchAll = '^(?:\\w+://)?(' + anyIPv4Octet + '\\.' + anyIPv4Octet + '\\.' + anyIPv4Octet + '\\.' + anyIPv4Octet + ')(?:\\:\\d+)?(?:\\/|$)'
  res.push(['redirect', asRegexObj ? new RegExp(ipv4CatchAll) : ipv4CatchAll, 5])

  const ipv6CatchAll = '^(?:\\w+://)?(\\[(?:[0-9:a-f]*:[0-9:a-f]*)\\])(?:\\:\\d+)?(?:\\/|$)'
  res.push(['redirect', asRegexObj ? new RegExp(ipv6CatchAll, 'i') : ipv6CatchAll, 5])

  return res
}

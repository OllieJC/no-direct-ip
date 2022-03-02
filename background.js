function isPrivateIPv4(ip) {
  const parts = ip.split('.');
  const result = (parts[0] === '10' || parts[0] === '127' ||
    (parts[0] === '172' && (parseInt(parts[1], 10) >= 16 && parseInt(parts[1], 10) <= 31)) ||
    (parts[0] === '192' && parts[1] === '168') ||
    (parts[0] === '169' && parts[1] === '254'));
  if (result) {
    console.log(`no-direct-ip: private IPv4 address: ${ip}`);
  }
  return result;
}

function isExternalIPv4(ip) {
  if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ip)) {
    if (!isPrivateIPv4(ip)) {
      return true;
    }
  }
  return false;
}

function isPrivateIPv6(ip) {
  if (/^\[?(?:fd[a-f0-9]*:+[a-f0-9:]+|(?:[0:]+)+1)\]?$/i.test(ip)) {
    console.log(`no-direct-ip: private IPv6 address: ${ip}`);
    return true;
  }
  return false;
}

function checkIp(details) {
  const url = new URL(details.url);
  const hostname = url.hostname;

  var cancel = false;
  var ipType = "";

  if (hostname.length > 0) {
    // if hostname starts with a number and is external IPv4
    if (!isNaN(hostname[0]) && isExternalIPv4(hostname)) {
      cancel = true;
      ipType = "IPv4";
    } else if (hostname.indexOf(":") > -1 && !isPrivateIPv6(hostname)) {
      cancel = true;
      ipType = "IPv6";
    }
  }

  if (cancel) {
    console.log(`no-direct-ip: blocked access to ${ipType} address: ${hostname}`);
  }

  return {cancel: cancel};
}

browser.webRequest.onBeforeRequest.addListener(
  checkIp,
  {urls: ["<all_urls>"]},
  ["blocking"]
);

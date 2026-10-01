var Url = require("url")
var assign = require("oolong").assign
var merge = require("oolong").merge
var PARSE_QUERY = false
var PROTOCOL_RELATIVE = true // Enable //example.com/models to mimic browsers.

exports = module.exports = function(fetch, rootUrl, defaults) {
  if (typeof rootUrl === "string") rootUrl = parseUrl(rootUrl)
  else defaults = rootUrl, rootUrl = null
  return assign(exports.fetch.bind(null, fetch, rootUrl, defaults), fetch)
}

exports.fetch = function(fetch, rootUrl, defaults, url, opts) {
  // Request instances carry URL + init; expand them so defaults still apply.
  if (isRequest(url)) {
    var request = url
    var requestUrl = String(request.url)
    var requestOpts = requestToOptions(request)
    if (rootUrl != null) requestUrl = rootUrl.resolve(requestUrl)
    if (typeof defaults === "function") defaults = defaults(requestUrl, requestOpts)
    var merged = defaults == null ? requestOpts : merge({}, defaults, requestOpts)
    return fetch(requestUrl, merged)
  }

  if (rootUrl != null) url = rootUrl.resolve(url)
  if (typeof defaults === "function") defaults = defaults(url, opts)
  return fetch(url, opts == null ? defaults : merge({}, defaults, opts))
}

function isRequest(value) {
  return value != null &&
    typeof value === "object" &&
    typeof value.url === "string" &&
    value.headers != null
}

function requestToOptions(request) {
  var opts = {
    method: request.method || "GET",
    headers: headersToObject(request.headers)
  }

  if (!request.bodyUsed) {
    if (typeof request._bodyInit !== "undefined" && request._bodyInit != null) {
      opts.body = request._bodyInit
    } else if (typeof request.body !== "undefined" && request.body != null) {
      opts.body = request.body
    }
  }

  if (request.credentials && request.credentials !== "omit") {
    opts.credentials = request.credentials
  }
  if (request.mode) opts.mode = request.mode
  return opts
}

function headersToObject(headers) {
  var obj = {}
  if (headers == null) return obj
  if (typeof headers.forEach === "function") {
    headers.forEach(function(value, key) { obj[key] = value })
    return obj
  }
  return merge({}, headers)
}

function parseUrl(url) {
  return Url.parse(url, PARSE_QUERY, PROTOCOL_RELATIVE)
}

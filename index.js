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
  // fetch(Request) / fetch(Request, init): unwrap so rootUrl.resolve works and
  // defaults merge with the Request's own method/headers/body (whatwg-fetch
  // replaces Request headers when a second init is passed).
  if (isRequestLike(url)) {
    opts = mergeRequestOpts(url, opts)
    url = url.url
  }

  if (rootUrl != null) url = rootUrl.resolve(url)
  if (typeof defaults === "function") defaults = defaults(url, opts)
  return fetch(url, opts == null ? defaults : merge({}, defaults, opts))
}

function isRequestLike(value) {
  return value != null && typeof value !== "string" && typeof value.url === "string"
}

function mergeRequestOpts(req, opts) {
  var base = {}
  if (req.method != null) base.method = req.method
  if (req.headers != null) base.headers = headersToObject(req.headers)
  if (req.credentials != null) base.credentials = req.credentials
  if (req.mode != null) base.mode = req.mode
  if (req.referrer != null) base.referrer = req.referrer
  // whatwg-fetch stores the constructor body on _bodyInit; prefer that so body
  // survives unwrapping. Native Request body streams are not copied synchronously.
  if (req._bodyInit != null) base.body = req._bodyInit
  return opts == null ? base : merge({}, base, opts)
}

function headersToObject(headers) {
  var obj = {}
  if (headers && typeof headers.forEach === "function") {
    headers.forEach(function(value, name) { obj[name] = value })
  } else if (headers && typeof headers === "object") {
    assign(obj, headers)
  }
  return obj
}

function parseUrl(url) {
  return Url.parse(url, PARSE_QUERY, PROTOCOL_RELATIVE)
}

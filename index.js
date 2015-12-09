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
  if (rootUrl != null) url = rootUrl.resolve(url)
  if (typeof defaults === "function") defaults = defaults(url, opts)
  return fetch(url, opts == null ? defaults : merge({}, defaults, opts))
}

function parseUrl(url) {
  return Url.parse(url, PARSE_QUERY, PROTOCOL_RELATIVE)
}

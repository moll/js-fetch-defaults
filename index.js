var resolve = require("url").resolve
var assign = require("oolong").assign
var merge = require("oolong").merge

exports = module.exports = function(fetch, rootUrl, defaults) {
  if (typeof rootUrl !== "string") defaults = rootUrl, rootUrl = null
  return assign(exports.fetch.bind(null, fetch, rootUrl, defaults), fetch)
}

exports.fetch = function(fetch, rootUrl, defaults, url, opts) {
  if (rootUrl != null) url = resolve(rootUrl, url)
  if (typeof defaults === "function") defaults = defaults(url, opts)
  return fetch(url, opts == null ? defaults : merge({}, defaults, opts))
}

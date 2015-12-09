var resolve = require("url").resolve
var assign = require("oolong").assign
var merge = require("oolong").merge

module.exports = function(fetch, rootUrl, defaults) {
  if (typeof rootUrl !== "string") defaults = rootUrl, rootUrl = null

  return assign(function(url, opts) {
    if (rootUrl != null) url = resolve(rootUrl, url)
    if (typeof defaults == "function") defaults = defaults(url, opts)
    return fetch(url, opts == null ? defaults : merge({}, defaults, opts))
  }, fetch)
}

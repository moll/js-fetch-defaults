var $ = require("oolong")

module.exports = Function.bind.bind(function(fetch, defaults, url, opts) {
  if (typeof defaults == "function") defaults = defaults(url, opts)
  if (opts == null) opts = defaults
  else opts = $.merge({}, defaults, opts)

  return fetch(url, opts)
}, null)

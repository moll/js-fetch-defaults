var assign = require("oolong").assign
var merge = require("oolong").merge

module.exports = function(fetch, defaults) {
  return assign(function(url, opts) {
    if (typeof defaults == "function") defaults = defaults(url, opts)
    return fetch(url, opts == null ? defaults : merge({}, defaults, opts))
  }, fetch)
}

try {
  var self = global.self = {}
  require("whatwg-fetch")
  exports = module.exports = self.fetch
  exports.Headers = self.Headers
  exports.Request = self.Request
  exports.Response = self.Response

}
finally { delete global.self }

// Cannot reload the polyfill as it mutates world state and doesn't return
// exports.
require("require-guard")(module.id)

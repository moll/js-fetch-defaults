var Sinon = require("sinon")
var Fetch = require("./fetch")
var defaults = require("..")

function headersIncluding(actual, expected) {
  for (var key in expected) {
    actual.must.have.property(key, expected[key])
  }
}

describe("FetchDefaults", function() {
  beforeEach(function() {
    var xhr = global.XMLHttpRequest = Sinon.FakeXMLHttpRequest
    xhr.onCreate = Array.prototype.push.bind(this.requests = [])
  })

  it("must return fetch with Headers, Request and Response", function() {
    var fetch = defaults(Fetch, {headers: {"X-Time-Zone": "UTC"}})
    fetch.Headers.must.equal(Fetch.Headers)
    fetch.Request.must.equal(Fetch.Request)
    fetch.Response.must.equal(Fetch.Response)
  })

  it("must request with resolved path and options", function() {
    var root = "https://example.com"
    var fetch = defaults(Fetch, root, {headers: {"X-Time-Zone": "UTC"}})
    fetch("/models", {method: "POST"})

    this.requests[0].method.must.equal("POST")
    this.requests[0].url.must.equal("https://example.com/models")
    headersIncluding(this.requests[0].requestHeaders, {"x-time-zone": "UTC"})
  })

  it("must respond", function*() {
    var res = defaults(Fetch, "https://example.com")("/models")
    this.requests[0].respond(200, {}, "Hello")

    res = yield res
    res.status.must.equal(200)
    ;(yield res.text()).must.equal("Hello")
  })

  it("must request with URL if given", function() {
    var fetch = defaults(Fetch, "https://example.com")
    fetch("https://api.example.com/models")
    this.requests[0].url.must.equal("https://api.example.com/models")
  })

  it("must request with default options if no URL given", function() {
    var fetch = defaults(Fetch, {headers: {"X-Time-Zone": "UTC"}})
    fetch("/models", {method: "POST"})

    this.requests[0].method.must.equal("POST")
    this.requests[0].url.must.equal("/models")
    headersIncluding(this.requests[0].requestHeaders, {"x-time-zone": "UTC"})
  })

  it("must merge options", function() {
    var fetch = defaults(Fetch, {headers: {"X-CSRF-Token": "Foo"}})
    fetch("/", {headers: {"X-Time-Zone": "UTC"}})

    headersIncluding(this.requests[0].requestHeaders, {
      "x-csrf-token": "Foo",
      "x-time-zone": "UTC"
    })
  })

  it("must not overwrite headers", function() {
    var fetch = defaults(Fetch, {headers: {"X-Time-Zone": "UTC"}})
    fetch("/", {headers: {"X-Time-Zone": "Europe/Tallinn"}})
    headersIncluding(this.requests[0].requestHeaders, {
      "x-time-zone": "Europe/Tallinn"
    })
  })

  it("must call default function with url and options", function() {
    var options = Sinon.spy()
    var fetch = defaults(Fetch, options)
    fetch("/models", {method: "POST"})

    options.callCount.must.equal(1)
    options.firstCall.args[0].must.equal("/models")
    options.firstCall.args[1].must.eql({method: "POST"})
  })

  it("must merge options given a function", function() {
    function options() { return {headers: {"X-Time-Zone": "UTC"}} }
    var fetch = defaults(Fetch, options)
    fetch("/models", {method: "POST"})

    this.requests[0].method.must.equal("POST")
    this.requests[0].url.must.equal("/models")
    headersIncluding(this.requests[0].requestHeaders, {"x-time-zone": "UTC"})
  })

  describe("given Request", function() {
    it("must apply defaults when called with Request alone", function() {
      var fetch = defaults(Fetch, {headers: {"X-Time-Zone": "UTC"}})
      var req = new Fetch.Request("/models", {
        method: "POST",
        headers: {"X-CSRF-Token": "Foo"}
      })
      fetch(req)

      this.requests[0].method.must.equal("POST")
      this.requests[0].url.must.equal("/models")
      headersIncluding(this.requests[0].requestHeaders, {
        "x-csrf-token": "Foo",
        "x-time-zone": "UTC"
      })
    })

    it("must resolve Request URL against root and apply defaults", function() {
      var fetch = defaults(Fetch, "https://example.com", {
        headers: {"X-Time-Zone": "UTC"}
      })
      fetch(new Fetch.Request("/models", {method: "POST"}))

      this.requests[0].method.must.equal("POST")
      this.requests[0].url.must.equal("https://example.com/models")
      headersIncluding(this.requests[0].requestHeaders, {"x-time-zone": "UTC"})
    })

    it("must let explicit init override Request and defaults", function() {
      var fetch = defaults(Fetch, {headers: {"X-Time-Zone": "UTC"}})
      var req = new Fetch.Request("/models", {
        method: "POST",
        headers: {"X-CSRF-Token": "Foo"}
      })
      fetch(req, {method: "PUT", headers: {"X-Time-Zone": "Europe/Tallinn"}})

      this.requests[0].method.must.equal("PUT")
      headersIncluding(this.requests[0].requestHeaders, {
        "x-csrf-token": "Foo",
        "x-time-zone": "Europe/Tallinn"
      })
    })

    it("must preserve Request body when applying defaults", function() {
      var fetch = defaults(Fetch, {headers: {"X-Time-Zone": "UTC"}})
      fetch(new Fetch.Request("/models", {method: "POST", body: "John"}))

      this.requests[0].method.must.equal("POST")
      this.requests[0].requestBody.must.equal("John")
      headersIncluding(this.requests[0].requestHeaders, {"x-time-zone": "UTC"})
    })
  })
})

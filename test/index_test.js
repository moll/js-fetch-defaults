var Sinon = require("sinon")
var Fetch = require("./fetch")
var defaults = require("..")

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

  it("must request with resolved path and options", function*() {
    var root = "https://example.com"
    var fetch = defaults(Fetch, root, {headers: {"X-Time-Zone": "UTC"}})
    var res = fetch("/models", {method: "POST"})

    this.requests[0].method.must.equal("POST")
    this.requests[0].url.must.equal("https://example.com/models")
    this.requests[0].requestHeaders.must.eql({"x-time-zone": "UTC"})

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
    this.requests[0].requestHeaders.must.eql({"x-time-zone": "UTC"})
  })

  it("must merge options", function() {
    var fetch = defaults(Fetch, {headers: {"X-CSRF-Token": "Foo"}})
    fetch("/", {headers: {"X-Time-Zone": "UTC"}})

    this.requests[0].requestHeaders.must.eql({
      "x-csrf-token": "Foo",
      "x-time-zone": "UTC"
    })
  })

  it("must not overwrite headers", function() {
    var fetch = defaults(Fetch, {headers: {"X-Time-Zone": "UTC"}})
    fetch("/", {headers: {"X-Time-Zone": "Europe/Tallinn"}})
    this.requests[0].requestHeaders.must.eql({"x-time-zone": "Europe/Tallinn"})
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
    this.requests[0].requestHeaders.must.eql({"x-time-zone": "UTC"})
  })
})

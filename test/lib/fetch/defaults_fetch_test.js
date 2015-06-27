var _ = require("root/lib/underscore")
var Sinon = require("sinon")
var DefaultsFetch = require("root/lib/fetch/defaults_fetch")

describe("DefaultsFetch", function() {
  beforeEach(function() {
    var xhr = window.XMLHttpRequest = Sinon.FakeXMLHttpRequest
    xhr.onCreate = Array.prototype.push.bind(this.requests = [])
  })

  it("must request with default options", function*() {
    var fetch = DefaultsFetch(window.fetch, {headers: {"X-Time-Zone": "UTC"}})
    var res = fetch("/models", {method: "POST"})

    this.requests[0].method.must.equal("POST")
    this.requests[0].url.must.equal("/models")
    this.requests[0].requestHeaders.must.eql({"x-time-zone": "UTC"})

    this.requests[0].respond(200, {}, "Hello")
    res = yield res
    res.status.must.equal(200)
    ;(yield res.text()).must.equal("Hello")
  })

  it("must merge options", function*() {
    var fetch = DefaultsFetch(window.fetch, {headers: {"X-CSRF-Token": "Foo"}})
    fetch("/", {headers: {"X-Time-Zone": "UTC"}})

    this.requests[0].requestHeaders.must.eql({
      "x-csrf-token": "Foo",
      "x-time-zone": "UTC"
    })
  })

  it("must not overwrite headers", function() {
    var fetch = DefaultsFetch(window.fetch, {headers: {"X-Time-Zone": "UTC"}})
    fetch("/", {headers: {"X-Time-Zone": "Europe/Tallinn"}})
    this.requests[0].requestHeaders.must.eql({"x-time-zone": "Europe/Tallinn"})
  })

  it("must call default function with url and options", function*() {
    var defaults = Sinon.spy()
    var fetch = DefaultsFetch(window.fetch, defaults)
    fetch("/models", {method: "POST"})

    defaults.callCount.must.equal(1)
    defaults.firstCall.args[0].must.equal("/models")
    defaults.firstCall.args[1].must.eql({method: "POST"})
  })

  it("must merge options given a function", function() {
    var defaults = _.constant({headers: {"X-Time-Zone": "UTC"}})
    var fetch = DefaultsFetch(window.fetch, defaults)
    fetch("/models", {method: "POST"})

    this.requests[0].method.must.equal("POST")
    this.requests[0].url.must.equal("/models")
    this.requests[0].requestHeaders.must.eql({"x-time-zone": "UTC"})
  })
})

FetchDefaults.js
================
[![NPM version][npm-badge]](https://www.npmjs.com/package/fetch-defaults)
[![Build status][travis-badge]](https://travis-ci.org/moll/js-fetch-defaults)

FetchDefaults.js is a mixin for the [Fetch API][fetch] for browsers and Node.js that allows you to set a base URL (to then make relative requests) and default options (such as headers) for `fetch` calls. It's functional and immutable, in that it doesn't modify any objects given to it.

[npm-badge]: https://img.shields.io/npm/v/fetch-defaults.svg
[travis-badge]: https://travis-ci.org/moll/js-fetch-defaults.png?branch=master
[fetch]: https://developer.mozilla.org/en/docs/Web/API/Fetch_API


Installing
----------
```sh
npm install fetch-defaults
```

FetchDefaults.js follows [semantic versioning](http://semver.org), so feel free to depend on its major version with something like `>= 1.0.0 < 2` (a.k.a `^1.0.0`).


Using
-----
Pass the native `fetch` function and a base URL and/or options to `fetchDefaults`:

```javascript
var fetchDefaults = require("fetch-defaults")

var apiFetch = fetchDefaults(fetch, "https://example.com", {
  headers: {Authorization: "Bearer 42"}
})
```

Then use the returned function as you would before:

```javascript
var res = apiFetch("/models", {method: "POST", body: "John"})
```

The above will then call the original function with a URL of `https://example.com/models` and a new merged options object. Options are merged recursively, so even nested objects, like headers, will work. The object you pass in will not be modified, just in case you were worried.

If you don't need to set any options, omit the second argument:

```javascript
var apiFetch = fetchDefaults(fetch, "https://example.com")
var res = apiFetch("/models", {method: "POST", body: "John"})
```

Likewise, if you don't need a base URL, pass only options:

```javascript
var apiFetch = fetchDefaults(fetch, {
  headers: {Authorization: "Bearer 42"}
})

var res = apiFetch("https://example.com/models", {
  method: "POST", body: "John"
})
```

### Browser
Browsers have the Fetch API available at `window.fetch`:

```javascript
var fetchDefaults = require("fetch-defaults")
var apiFetch = fetchDefaults(fetch, "https://example.com")
```

### Node.js
Node.js doesn't have a built-in implementation of the Fetch API, but you can use any library with a compatible interface, such as my [Fetch/Off.js][fetch-off] or [node-fetch][node-fetch]:

[fetch-off]: https://github.com/moll/node-fetch-off
[node-fetch]: https://github.com/bitinn/node-fetch

```javascript
var fetch = require("fetch-off")
var fetchDefaults = require("fetch-defaults")
var apiFetch = fetchDefaults(fetch, "https://example.com")
```


License
-------
FetchDefaults.js is released under a *Lesser GNU Affero General Public License*, which in summary means:

- You **can** use this program for **no cost**.
- You **can** use this program for **both personal and commercial reasons**.
- You **do not have to share your own program's code** which uses this program.
- You **have to share modifications** (e.g. bug-fixes) you've made to this program.

For more convoluted language, see the `LICENSE` file.


About
-----
**[Andri Möll][moll]** typed this and the code.  
[Monday Calendar][monday] supported the engineering work.

If you find FetchDefaults.js needs improving, please don't hesitate to type to me now at [andri@dot.ee][email] or [create an issue online][issues].

[email]: mailto:andri@dot.ee
[issues]: https://github.com/moll/js-fetch-defaults/issues
[moll]: http://themoll.com
[monday]: https://mondayapp.com

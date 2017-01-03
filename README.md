# api-handler

## Installation
Install via npm using your protocol of choice pointing to this repository. Here's an example of installing the latest version using SSH:
```
$ npm install --save git+ssh://git@gitlab.ubermonitoring.com:modules/api-handler.git
```
To install a specific version, a git tag may be added.
```
$ npm install --save git+ssh://git@gitlab.ubermonitoring.com:modules/api-handler.git#v0.0.0
```

## Usage Overview
```js
const apiHandler = require('api-handler')

const middleware = apiHandler.http(promiseyApiMethod)
const rejection = apiHandler.reject(404)
const logger = apiHandler.logger('logFile.log')
```

## `apiHandler.http(promiseyApiMethod)`
`http` turns a promisey API method into an Express middleware.

Here's an example promisey API method that requires a query parameter called name in order to say hello. It rejects if there's no name provided and resolves otherwise with a template string.
```js
const sayHelloInAPromise = (req) => {
  if (!req.query.name) {
    return Promise.reject(new Error('name is required'))
  }
  return Promise.resolve(`Hello ${req.query.name}`)
}
```

With `apiHandler.http()` we can turn it into a middleware.
```js
const sayHelloMiddleware = apiHandler.http(sayHelloInAPromise)
```

And then we can use it like this
```js
const app = require('express')()

app.get('/hello', sayHelloMiddleware)
```

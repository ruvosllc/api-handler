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

## `apiHandler.reject(obj|status|message)`
`reject` is a factory for creating useful promise rejections that are instances of Error.

It accepts an object
```js
const missingRequiredName = apiHandler.reject({ status: 400, message: 'name is required' })
```

Or a numeric status
```js
const notFound = apiHandler.reject(404)
```

Or a message string
```js
const genericRejection = apiHandler.reject('there was a problem')
```

We can leverage `reject` in conjunction with `http` to do some nice rejection handling.
```js
const sayHelloInAPromise = (req) => {
  if (!req.query.name) {
    return apiHandler.reject({ status: 400, message: 'name is required' })
  }
  return Promise.resolve(`Hello ${req.query.name}`)
}

app.get('/hello', apiHandler.http(sayHelloInAPromise))
```
When the name query parameter is missing, we'll get a 400 HTTP response with our message while adhering to Promise rejection guidelines.


## `apiHandler.logger(filename)`
`logger` is a middleware for logging JSON-formatted request and response information.

```js
const logger = apiHandler.logger('logFile.log')
app.get('/hello', logger, someOtherMiddleware)
```

someOtherMiddleware will be unaffected by the presence of the logger, but we'll get a new line in our logFile.log with JSON describing what occurred.

The log filename is optional. If it is omitted, you'll get a warning message but things will just be written to process.stdout.
```js
const logToStdOut = apiHandler.logger()
```

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
const rejection = apiHandler.reject(404) || apiHandler[404]()
const resolution = apiHandler.resolve(201) || apiHandler[201]()
const logger = apiHandler.logger('logFile.log')
const inputIsValid = apiHandler.validate('someInput', /expectedFormat/)
apiHandler.require('someInput', /expectedFormat/)
```

## apiHandler.http(promiseyApiMethod)
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

If you resolve or reject with an object having a numeric `status` property, that status will be set as the HTTP response status.
```js
const sayHelloInAPromise = (req) => {
  if (!req.query.name) {
    return Promise.reject({ status: 400 })
  }
  return Promise.resolve({ status: 200})
}
```

When rejecting, a `message` may be included to respond with an error message.
```js
const sayHelloInAPromise = (req) => {
  if (!req.query.name) {
    return Promise.reject({ status: 400, message: 'name is required' })
  }
  return Promise.resolve({ status: 200})
}
```

And when resolving, a `data` property may be included to respond with some data.
```js
const sayHelloInAPromise = (req) => {
  if (!req.query.name) {
    return Promise.reject({ status: 400, message: 'name is required' })
  }
  return Promise.resolve({ status: 200, data: `Hello ${req.query.name}`})
}
```

## apiHandler.reject(obj|status|message)
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

## apiHandler.resolve(status|any)
`resolve` is a factory for creating promise resolutions. Its use is not required but it offers some convenience.

It accepts a numeric status
```js
const created = apiHandler.resolve(201)
```

And anything else will just be passed along to `Promise.resolve()`
```js
const someStuff = apiHandler.resolve({ some: 'stuff' })
```

## apiHandler.validate(actual, [expected|regex|validator])
`validate` will check actual values against expected values, types, regular expressions, or validator functions.

Without a second argument, it simply checks truthiness.
```js
apiHandler.validate('') // false
apiHandler.validate('something') // true
```

With an expected value, strict equality is checked.
```js
apiHandler.validate(3, 3) // true
apiHandler.validate(3, '3') // false
apiHandler.validate('string', 'string') // true
```

Types can be checked.
```js
apiHandler.validate(100, String) // false
apiHandler.validate(100, Number) // true
```

Regular expressions are sure handy.
```js
apiHandler.validate('something', /something/) // true
apiHandler.validate('something', /nothing/) // false
```

If you need to get fancy, pass a validator function.
```js
apiHandler.validate('word', item => item.indexOf('p') > -1) // false
apiHandler.validate('word up', item => item.indexOf('p') > -1) // true
```

Objects can be checked as well.
```js
apiHandler.validate({ stuff: { things: 'yep' } }, { stuff: { things: 'yep' } }) // true
apiHandler.validate({ stuff: { things: 'yep' } }, { stuff: { things: 'nope' } }) // false
```

Mix and match to create a schema.
```js
const data = {
  aNumber: 100,
  aString: 'something',
  nest: {
    anArray: [1, '1']
  }
}
const schema = {
  aNumber: Number,
  aString: /something/,
  nest: {
    anArray: [Number, String]
  }
}
apiHandler.validate(data, schema) // true
```

## apiHandler.require(actual, expected, message, optional)
`require` wraps validate and throws 400 errors when things are invalid.
```js
// Throws an Error with { message: 'should be a string', status: 400 }
apiHandler.require(100, String, 'should be a string')
```

When a message is not provided, a simple one will be generated when a key is available.
```js
// Throws an Error with { message: 'thing is invalid', status: 400 }
apiHandler.require({ thing: 'something' }, { thing: 'somethingElse' })

// Throws an Error with { status: 400 }
apiHandler.require('something', 'somethingElse')
```

To skip missing parameters, set `optional` to true.
```js
// Doesn't throw an Error
apiHandler.require({}, { thing: 'somethingElse' }, null, true)

// Throws an Error
apiHandler.require({}, { thing: 'somethingElse' })
```

This works well for request validation when used in conjunction with `http`.
```js
const app = require('express')()

const sayHelloInAPromise = (req) => {
  apiHandler.require(req.query, { name: String })
  return Promise.resolve(`Hello ${req.query.name}`)
}

app.get('/hello', apiHandler.http(sayHelloInAPromise))
```

## apiHandler.accept(actual, expected, message)
`accept` is shorthand for `require` with the `optional` flag set to `true`.
```js
// Using `accept` like this
apiHandler.accept('actual', 'expected')

// Is the same thing as
apiHandler.require('actual', 'expected', null, true)
```

## apiHandler.logger(filename)
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

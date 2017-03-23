'use strict'

const http = require('./lib/http')
const logger = require('./lib/logger')
const error = require('./lib/error')
const reject = require('./lib/reject')
const statuses = require('./lib/statuses')
const validate = require('./lib/validate')
const requ = require('./lib/require')
const accept = require('./lib/accept')
const resolve = require('./lib/resolve')

const apiHandler = {
  http,
  logger,
  error,
  reject,
  validate,
  require: requ,
  accept,
  resolve,
}

Object.assign(apiHandler, statuses)

module.exports = apiHandler

'use strict'

const http = require('./lib/http')
const logger = require('./lib/logger')
const error = require('./lib/error')
const reject = require('./lib/reject')
const statuses = require('./lib/statuses')
const validate = require('./lib/validate')

const apiHandler = {
  http,
  logger,
  error,
  reject,
  validate,
}

Object.assign(apiHandler, statuses)

module.exports = apiHandler

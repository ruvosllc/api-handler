'use strict'

const http = require('./lib/http')
const logger = require('./lib/logger')
const error = require('./lib/error')
const reject = require('./lib/reject')

const apiHandler = {
  http,
  logger,
  error,
}

module.exports = apiHandler

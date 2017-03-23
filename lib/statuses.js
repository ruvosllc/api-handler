'use strict'

const http = require('http')
const reject = require('./reject')
const resolve = require('./resolve')

const codes = Object.keys(http.STATUS_CODES)

module.exports = codes.reduce((handlers, status) => {
  if (status < 400) {
    handlers[status] = data => resolve({ status, data })
  } else {
    handlers[status] = message => reject({ status, message })
  }
  return handlers
}, {})

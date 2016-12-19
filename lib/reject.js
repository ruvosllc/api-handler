'use strict'

const error = require('./error')

module.exports = errorData => Promise.reject(error(errorData))

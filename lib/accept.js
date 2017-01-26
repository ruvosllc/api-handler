'use strict'

const requ = require('./require')

module.exports = (actual, expected, message) => requ(actual, expected, message, true)

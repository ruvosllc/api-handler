'use strict'

const validate = require('./validate')
const error = require('./error')

module.exports = (actual, expected) => {
  if (!validate(actual, expected)) {
    throw error({ status: 400 })
  }
}

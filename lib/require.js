'use strict'

const validate = require('./validate')
const error = require('./error')

const requ = (actual, expected, message, objectPath) => {
  if (actual instanceof Object && expected instanceof Object) {
    if (objectPath) {
      objectPath = `${objectPath}.`
    } else {
      objectPath = ''
    }
    Object.keys(expected)
    .forEach(key => requ(actual[key], expected[key], message, `${objectPath}${key}`))
  } else if (!validate(actual, expected)) {
    throw error({ status: 400, message: message || `${objectPath} is invalid` })
  }
}

module.exports = requ

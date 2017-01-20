'use strict'

const validate = (actual, expected) => {
  if (expected instanceof RegExp) {
    return expected.test(actual)
  }
  if (actual instanceof Object && expected instanceof Object) {
    return Object.keys(expected)
    .reduce((valid, key) => valid && validate(actual[key], expected[key]), true)
  }
  if (typeof expected === 'object') {
    return validate(JSON.stringify(actual), JSON.stringify(expected))
  }
  if (typeof expected === 'function') {
    return !!expected(actual)
  }
  if (expected) {
    return actual === expected
  }
  return !!actual
}

module.exports = validate

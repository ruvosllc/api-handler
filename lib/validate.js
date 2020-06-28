'use strict'

function isSet (val) {
  return val !== undefined && val !== null
}

function typeMatch (actual, expected) {
  let isInstanceOf
  try {
    isInstanceOf = actual instanceof expected
  } catch (err) {
    // No worries
  }
  return isSet(actual) && (actual.constructor === expected || isInstanceOf)
}

function isBoolConstructor (func) {
  return func === Boolean || func.prototype instanceof Boolean
}

function validatorPasses (actual, expected) {
  return !isBoolConstructor(expected) && expected(actual) === true
}

const validate = (actual, expected) => {
  if (expected instanceof RegExp) {
    return expected.test(actual)
  }
  if (typeof expected === 'function') {
    return typeMatch(actual, expected) || validatorPasses(actual, expected)
  }
  if (actual instanceof Object && expected instanceof Object) {
    return Object.keys(expected)
      .reduce((valid, key) => valid && validate(actual[key], expected[key]), true)
  }
  if (typeof expected === 'object') {
    return validate(JSON.stringify(actual), JSON.stringify(expected))
  }
  if (expected) {
    return actual === expected
  }
  return !!actual
}

module.exports = validate

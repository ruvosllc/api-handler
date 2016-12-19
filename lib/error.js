'use strict'

module.exports = (errorData) => {
  errorData = errorData || {}
  if (typeof errorData == 'string') {
    errorData = { message: errorData }
  }
  return Object.assign(new Error(), errorData)
}

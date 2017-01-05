'use strict'

module.exports = (errorData) => {
  errorData = errorData || {}
  if (typeof errorData === 'string') {
    errorData = { message: errorData }
  } else if (typeof errorData === 'number') {
    errorData = { status: errorData }
  }
  return Object.assign(new Error(), errorData)
}

'use strict'

module.exports = (resolution) => {
  resolution = resolution || {}
  if (typeof resolution === 'number') {
    resolution = { status: resolution }
  }
  return Promise.resolve(resolution)
}

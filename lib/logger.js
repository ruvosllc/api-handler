const fs = require('fs')
const morgan = require('morgan')
const morganJson = require('morgan-json')

morgan.token('token-iss', req => req.validClientToken && req.validClientToken.content.iss)
morgan.token('token-email', req => req.validClientToken && req.validClientToken.content.email)

module.exports = (logFilePath) => {
  let stream = process.stdout
  if (!logFilePath) {
    console.warn('No logFilePath provided to logger.')
  } else {
    stream = fs.createWriteStream(logFilePath, {flags: 'a'})
  }
  const format = morganJson(`${morgan.combined} :token-iss :token-email`)
  return morgan(format, {stream: stream})
}

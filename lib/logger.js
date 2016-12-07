const fs = require('fs')
const morgan = require('morgan')
const morganJson = require('morgan-json')

morgan.token('token-raw', req => req.token)
morgan.token('token-iss', req => req.validClientToken && req.validClientToken.content.iss)
morgan.token('token-email', req => req.validClientToken && req.validClientToken.content.email)

module.exports = (logFilePath) => {
  const stream = fs.createWriteStream(logFilePath, {flags: 'a'})
  const format = morganJson(':date[clf] :method :url :status :remote-addr :token-iss :token-email :token-raw')
  return morgan(format, {stream: stream})
}

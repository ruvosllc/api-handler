const fs = require('fs')
const morgan = require('morgan')
const morganJson = require('morgan-json')

morgan.token('token-iss', req => req.validClientToken && req.validClientToken.iss)
morgan.token('token-email', req => req.validClientToken && req.validClientToken.email)

module.exports = (logFilePath) => {
  const stream = fs.createWriteStream(logFilePath, {flags: 'a'})
  const format = morganJson(':date[clf] :method :url :token-iss :token-email')
  return morgan(format, {stream: stream})
}

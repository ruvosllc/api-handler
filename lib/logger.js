const fs = require('fs')
const morgan = require('morgan')

morgan.token('token-iss', req => req.validClientToken && req.validClientToken.iss)
morgan.token('token-email', req => req.validClientToken && req.validClientToken.email)

module.exports = (logFilePath) => {
  const stream = fs.createWriteStream(logFilePath, {flags: 'a'})
  const format = ':date[clf] :method :url :token-iss :token-email'
  return morgan(format, {stream: stream})
}

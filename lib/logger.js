const fs = require('fs')
const morgan = require('morgan')

morgan.token('token', req => req.token)

module.exports = (logFilePath) => {
  const stream = fs.createWriteStream(logFilePath, {flags: 'a'})
  const format = ':method :url :remote-user :date[clf] :token'
  return morgan(format, {stream: stream})
}

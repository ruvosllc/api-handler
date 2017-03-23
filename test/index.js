'use strict'

const apiHandler = require('../index')
const mocha = require('mocha')
require('should')

const describe = mocha.describe
const it = mocha.it

describe('API Handler', () => {
  it('exports http', () => {
    apiHandler.http.should.be.a.Function()
  })
  it('exports logger', () => {
    apiHandler.logger.should.be.a.Function()
  })
  it('exports error', () => {
    apiHandler.error.should.be.a.Function()
  })
  it('exports reject', () => {
    apiHandler.reject.should.be.a.Function()
  })
  it('exports validate', () => {
    apiHandler.validate.should.be.a.Function()
  })
  it('exports require', () => {
    apiHandler.require.should.be.a.Function()
  })
  it('exports accept', () => {
    apiHandler.accept.should.be.a.Function()
  })
  it('exports resolve', () => {
    apiHandler.resolve.should.be.a.Function()
  })
})

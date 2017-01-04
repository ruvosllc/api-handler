'use strict'

const error = require('../lib/error')
const mocha = require('mocha')
const should = require('should')

const describe = mocha.describe
const it = mocha.it

describe('error', () => {
  describe('turns a message string into an error that', () => {
    const message = 'woot'
    const err = error(message)
    it('is an instance of Error', () => {
      err.should.be.a.Error()
    })
    it('has the message in it', () => {
      err.should.have.property('message', message)
    })
  })
  describe('turns an HTTP status into an error that', () => {
    const status = 404
    const err = error(status)
    it('is an instance of Error', () => {
      err.should.be.a.Error()
    })
    it('has the status in it', () => {
      err.should.have.property('status', status)
    })
  })
  describe('turns an object into an error that', () => {
    const obj = { status: 403, message: 'no entry', extra: 'threeve' }
    const err = error(obj)
    it('is an instance of Error', () => {
      err.should.be.a.Error()
    })
    it('has the status in it', () => {
      err.should.have.property('status', obj.status)
    })
    it('has the message in it', () => {
      err.should.have.property('message', obj.message)
    })
    it('has the extra in it', () => {
      err.should.have.property('extra', obj.extra)
    })
  })
})

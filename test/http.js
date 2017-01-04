'use strict'

const http = require('../lib/http')
const mocha = require('mocha')
const should = require('should')

const describe = mocha.describe
const it = mocha.it

describe('http', () => {
  let called
  let passedReq
  const apiMethod = (req) => {
    passedReq = req
    called = true
    if (req && req.fail) {
      return Promise.reject(req.fail)
    }
    return Promise.resolve(called)
  }
  const middleware = http(apiMethod)
  describe('returns a middleware that', () => {
    it('is a function', () => {
      should(typeof middleware).equal('function')
    })
    it('calls the apiMethod', () => {
      const res = { json: () => {} }
      middleware(null, res)
      called.should.be.true()
    })
    it('passes the request object to the apiMethod', () => {
      const req = { data: 'stuff' }
      const res = { json: () => {} }
      middleware(req, res)
      passedReq.should.equal(req)
    })
    it('writes the promise resolution to the response', (done) => {
      const res = {
          json: (data) => {
            data.should.equal(called)
            done()
          }
      }
      middleware({}, res, done)
    })
    it('passes promise rejection to next', (done) => {
      const req = { fail: 'some error'}
      const next = (rejection) => {
        try {
          should(rejection).equal(req.fail)
          done()
        } catch (err) {
          done(err)
          throw err
        }
      }
      middleware(req, {}, next)
    })
  })
})

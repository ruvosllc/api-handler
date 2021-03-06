'use strict'

const http = require('../lib/http')
const mocha = require('mocha')
const should = require('should')

const describe = mocha.describe
const it = mocha.it

describe('http', () => {
  describe('returns a middleware that', () => {
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
      const req = { fail: 'some error' }
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
  describe('handles thrown exceptions', () => {
    const apiMethod = (req) => {
      if (req && req.fail) {
        throw req.fail
      }
      return Promise.resolve(req.success)
    }
    const middleware = http(apiMethod)
    it('by passing to next when no status is found', (done) => {
      const req = { fail: 'some error' }
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
    it('by writing to the response when there is a status', (done) => {
      const req = {
        fail: {
          status: 400
        }
      }
      const res = {
        status: (status) => {
          status.should.equal(req.fail.status)
          done()
        }
      }
      middleware(req, res, done)
    })
  })
  describe('handles http statuses', () => {
    it('by writing to the response when there is a status', (done) => {
      let resStatus
      const res = {
        status: (status) => {
          resStatus = status
        },
        json: (obj) => {
          should(resStatus).equal(201)
          should(obj).not.have.property('status')
          done()
        }
      }
      http(() => Promise.resolve({ status: 201 }))({}, res, done)
    })
    it('by writing to the response when there is a status and data', (done) => {
      let resStatus
      const data = {
        some: 'data'
      }
      const res = {
        status: (status) => {
          resStatus = status
        },
        json: (obj) => {
          should(resStatus).equal(201)
          should(obj).deepEqual(data)
          done()
        }
      }
      http(() => Promise.resolve({ status: 201, data }))({}, res, done)
    })
  })
})

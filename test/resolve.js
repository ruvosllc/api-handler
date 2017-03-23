'use strict'

const resolve = require('../lib/resolve')
const mocha = require('mocha')
require('should')

const describe = mocha.describe
const it = mocha.it

describe('resolve', () => {
  describe('returns a promise resolving to an object', () => {
    it('with status when given status', () => {
      const status = 200
      return resolve(status).should.be.fulfilled()
      .then((res) => {
        res.should.have.property('status', status)
      })
    })
    it('and acts like a pass through when given an object', () => {
      const data = { some: 'data' }
      return resolve(data).should.be.fulfilled()
      .then((res) => {
        res.should.deepEqual(data)
      })
    })
    it('and acts like a pass through when given an string', () => {
      const string = 'blah'
      return resolve(string).should.be.fulfilled()
      .then((res) => {
        res.should.deepEqual(string)
      })
    })
  })
})

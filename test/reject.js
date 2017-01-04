'use strict'

const reject = require('../lib/reject')
const mocha = require('mocha')
const should = require('should')

const describe = mocha.describe
const it = mocha.it

describe('reject', () => {
  it('wraps error in a promise rejection', () => {
    const err = { message: 'spoon' }
    return reject(err).should.be.rejectedWith(err.message)
  })
})

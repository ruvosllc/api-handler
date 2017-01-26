'use strict'

const accept = require('../lib/accept')
const mocha = require('mocha')
require('should')

const describe = mocha.describe
const it = mocha.it

describe('accept validates things that exist by throwing 400s', () => {
  it('so when nothing is provided that\'s fine', () => {
    accept.bind().should.not.throw()
  })
  it('when the actual value is not equal to the expected value', () => {
    accept.bind(null, 'thing', 'notThing').should.throw({ status: 400 })
    accept.bind(null, 'thing', 'thing').should.not.throw()
    accept.bind(null, undefined, 'thing').should.not.throw()
  })
  it('when the actual value does not match the expected regex', () => {
    accept.bind(null, 'thing', /notThing/).should.throw({ status: 400 })
    accept.bind(null, 'thing', /thing/).should.not.throw()
  })
  it('when the actual object does not contain the expected values', () => {
    accept.bind(null, { body: { thing: 'thing' } }, { body: { thing: 'notThing' } })
    .should.throw({ status: 400 })
    accept.bind(null, { body: {} }, { body: { thing: 'thing' } })
    .should.not.throw()
  })
  it('when the actual value does not pass the provided validator', () => {
    accept.bind(null, 'thing', () => false).should.throw({ status: 400 })
    accept.bind(null, 'thing', () => true).should.not.throw()
    accept.bind(null, undefined, () => false).should.not.throw()
    accept.bind(null, { a: 'b' }, item => item.a === 'a').should.throw({ status: 400 })
    accept.bind(null, { a: 'a' }, item => item.a === 'a').should.not.throw()
    accept.bind(null, undefined, item => item.a === 'a').should.not.throw()
  })
  it('and will handle messages', () => {
    accept.bind(null, false, true, 'a message').should.throw({ status: 400, message: 'a message' })
    accept.bind(null, { a: 'b' }, { a: 'c' }, 'a message').should.throw({ status: 400, message: 'a message' })
  })
  it('and will generate error messages for object validations', () => {
    accept.bind(null, { body: { thing: 'thing' } }, { body: { thing: 'notThing' } })
    .should.throw({ status: 400, message: 'body.thing is invalid' })
  })
  it('and will not generate error messages for non-object validations', () => {
    accept.bind(null, 'thing', 'notThing')
    .should.throw({ status: 400, message: undefined })
  })
})

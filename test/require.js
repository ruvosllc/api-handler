'use strict'

const requ = require('../lib/require')
const mocha = require('mocha')
require('should')

const describe = mocha.describe
const it = mocha.it

describe('require validates things by throwing 400s', () => {
  it('when nothing is provided', () => {
    requ.should.throw({ status: 400 })
    requ.bind(null, true).should.not.throw()
  })
  it('when the actual value is not equal to the expected value', () => {
    requ.bind(null, 'thing', 'notThing').should.throw({ status: 400 })
    requ.bind(null, 'thing', 'thing').should.not.throw()
  })
  it('when the actual value does not match the expected regex', () => {
    requ.bind(null, 'thing', /notThing/).should.throw({ status: 400 })
    requ.bind(null, 'thing', /thing/).should.not.throw()
  })
  it('when the actual object does not contain the expected values', () => {
    requ.bind(null, { body: { thing: 'thing' } }, { body: { thing: 'notThing' } })
    .should.throw({ status: 400 })
    requ.bind(null, { body: { thing: 'thing' } }, { body: { thing: 'thing' } })
    .should.not.throw()
  })
  it('when the actual value does not pass the provided validator', () => {
    requ.bind(null, 'thing', () => false).should.throw({ status: 400 })
    requ.bind(null, 'thing', () => true).should.not.throw()
    requ.bind(null, { a: 'b' }, item => item.a === 'a').should.throw({ status: 400 })
    requ.bind(null, { a: 'a' }, item => item.a === 'a').should.not.throw()
  })
  it('and will handle accept messages', () => {
    requ.bind(null, false, true, 'a message').should.throw({ status: 400, message: 'a message' })
    requ.bind(null, { a: 'b' }, { a: 'c' }, 'a message').should.throw({ status: 400, message: 'a message' })
  })
  it('and will generate error messages for object validations', () => {
    requ.bind(null, { body: { thing: 'thing' } }, { body: { thing: 'notThing' } })
    .should.throw({ status: 400, message: 'body.thing is invalid' })
  })
  it('and will not generate error messages for non-object validations', () => {
    requ.bind(null, 'thing', 'notThing')
    .should.throw({ status: 400, message: undefined })
  })
})

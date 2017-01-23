'use strict'

const validate = require('../lib/validate')
const mocha = require('mocha')
require('should')

const describe = mocha.describe
const it = mocha.it

describe('validate returns booleans to describe validity', () => {
  it('which usually means they should not be undefined', () => {
    validate().should.be.false()
    validate(undefined).should.be.false()
    validate('').should.be.false()
    validate('something').should.be.true()
  })
  it('and can check things for equality', () => {
    validate(null, null).should.be.true()
    validate(null, 'anything').should.be.false()
    validate('something', null).should.be.false()
    validate('something', 'nothing').should.be.false()
    validate('something', 'something').should.be.true()
    validate(12, 10).should.be.false()
    validate(12, 12).should.be.true()
  })
  it('and can check objects for equality', () => {
    validate(null, {}).should.be.false()
    validate({ things: [1, 2] }, { things: [1, 2, 3] }).should.be.false()
    validate({ stuff: { things: 'yep' } }, { stuff: { things: 'nope' } }).should.be.false()
    validate({ stuff: { things: 'yep' } }, { stuff: { things: 'yep' } }).should.be.true()
  })
  it('and can test things using regex', () => {
    validate(null, /anything/).should.be.false()
    validate('something', /nothing/).should.be.false()
    validate('something', /something/).should.be.true()
  })
  it('and can check type', () => {
    validate(null, String).should.be.false()
    validate(null, Object).should.be.false()
    validate(3, String).should.be.false()
    validate(3, Number).should.be.true()
    validate('string', String).should.be.true()
    validate('string', Boolean).should.be.false()
    validate('string', Object).should.be.false()
    validate(false, Boolean).should.be.true()
    validate({ a: 'b' }, Object).should.be.true()
    validate({ a: 'b' }, { a: String }).should.be.true()
    validate({ a: 'b' }, { a: Boolean }).should.be.false()
  })
  it('and can test things using a function', () => {
    validate(null, item => item === null).should.be.true()
    validate(null, item => item !== null).should.be.false()
    validate('b', item => item.indexOf('a') > -1).should.be.false()
    validate('ba', item => item.indexOf('a') > -1).should.be.true()
    validate({ a: 'b' }, item => item.a === 'a').should.be.false()
    validate({ a: 'a' }, item => item.a === 'a').should.be.true()
  })
  it('and can test things using functions in objects', () => {
    validate({ a: 'b' }, { a: item => item === 'c' }).should.be.false()
    validate({ a: 'b' }, { a: item => item === 'b' }).should.be.true()
  })
})

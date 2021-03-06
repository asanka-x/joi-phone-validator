/* global describe, it */
const Joi = require('joi')
const phoneRule = require('../lib/phone_validator').default
const chai = require('chai')

describe('Joi custom phone validation', function() {
  it('phone rule must validate only valid phone numbers', function(done) {
    const schema = phoneRule.phone().validate()
    const validation = Joi.validate('+33123456789', schema)
    if (validation.error) {
      return done(validation.error)
    }
    chai.expect(validation.value).to.eql('+33123456789')
    done()
  })

  it('phone rule must not validate non E164 compliant phone numbers', function(done) {
    const schema = phoneRule.phone().validate()
    const validation = Joi.validate('07 70 48 29 49', schema)
    if (validation.error) {
      return done()
    }
    done('Invalid phone number has been validated incorrectly')
  })


  it('phone rule must not validate invalid phone numbers with fake prefix', function(done) {
    const schema = phoneRule.phone().validate()
    const validation = Joi.validate('0000123456789', schema)
    if (validation.error) {
      return done()
    }
    done('Invalid phone number has been validated incorrectly')
  })

  it('phone rule must format phone numbers', function(done) {
    const schema = phoneRule.phone().validate()
    const validation = Joi.validate('+33 7 70 48 29 49', schema)
    chai.expect(validation.value).to.eql('+33770482949')
    done()
  })

  it('phone rule must format phone numbers', function(done) {
    const schema = phoneRule.phone().validate()
    const validation = Joi.validate('+337.70.48.29.49', schema)
    chai.expect(validation.value).to.eql('+33770482949')
    done()
  })

  it('phone rule must format phone numbers', function(done) {
    const schema = phoneRule.phone().validate()
    const validation = Joi.validate('+1 202-456-1414', schema)
    chai.expect(validation.value).to.eql('+12024561414')
    done()
  })

  it('phone rule must validate only mobile numbers', function(done) {
    const schema = phoneRule.phone().mobile()
    const validation = Joi.validate('+33601020304', schema)
    if (validation.error) {
      return done(validation.error)
    }
    done()
  })

  it('phone rule must validate various countries mobile numbers', function(done) {
    const schema = phoneRule.phone().mobile()
    const errors = [
      '+14033060485', // Canada
      '+32460224941', // Belgium
      '+447520632751', // UK
      '+16149438597' // USA
    ]
      .map(phone => Joi.validate(phone, schema).error)
      .filter(e => !!e)
      .join('\n')

    done(errors.length ? new Error(errors) : undefined)
  })

  it('phone rule must not validate fixed line numbers',function(done) {
    const schema = phoneRule.phone().mobile()
    const validation = Joi.validate('+33101020304', schema)
    if (validation.error) {
      return done()
    }
    done('Fixed line number has been validated incorrectly')
  })
})

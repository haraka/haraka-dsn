const assert = require('node:assert/strict')
const { describe, it, beforeEach } = require('node:test')

const constants = require('haraka-constants')

constants.import(global)

describe('haraka-dsn', () => {
  let DSN

  beforeEach(() => {
    DSN = require('../index')
  })

  it('should load', () => {
    assert.ok(DSN)
  })

  it('create, only code', () => {
    // DSN.create returns a class instance; spread to a plain object so
    // strict deepEqual (prototype-sensitive) compares fields only.
    assert.deepEqual(
      { ...DSN.create(200) },
      {
        code: 200,
        msg: undefined,
        cls: 2,
        sub: 0,
        det: 0,
        default_msg: 'Other undefined status',
        reply: '2.0.0 Other undefined status',
      },
    )
  })

  it('create, code w/msg', () => {
    assert.deepEqual(
      { ...DSN.create(200, 'test msg') },
      {
        code: 200,
        msg: 'test msg',
        cls: 2,
        sub: 0,
        det: 0,
        default_msg: 'Other undefined status',
        reply: '2.0.0 test msg',
      },
    )
  })

  it('create, code w/msg & subject', () => {
    assert.deepEqual(
      { ...DSN.create(200, 'test msg', 7) },
      {
        code: 200,
        msg: 'test msg',
        cls: 2,
        sub: 7,
        det: 0,
        default_msg: 'Authentication Succeeded',
        reply: '2.7.0 test msg',
      },
    )
  })

  it('net_unspecified returns expected code & message', () => {
    const r = DSN.net_unspecified()
    assert.equal(r.code, 450)
    assert.equal(r.default_msg, 'Other or undefined network or routing status')
  })

  it('net_unable_to_route returns expected code & message', () => {
    const r = DSN.net_unable_to_route()
    assert.equal(r.code, 550)
    assert.equal(r.default_msg, 'Unable to route')
  })
})

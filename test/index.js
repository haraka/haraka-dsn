const assert = require('assert')

const constants = require('haraka-constants')

constants.import(global)

describe('haraka-dsn', function () {
  beforeEach(function () {
    this.DSN = require('../index')
  })

  it('should load', function () {
    assert.ok(this.DSN)
  })

  it('create, only code', function () {
    assert.deepEqual(
      {
        code: 200,
        msg: undefined,
        cls: 2,
        sub: 0,
        det: 0,
        default_msg: 'Other undefined status',
        reply: '2.0.0 Other undefined status',
      },
      this.DSN.create(200),
    )
  })

  it('create, code w/msg', function () {
    assert.deepEqual(
      {
        code: 200,
        msg: 'test msg',
        cls: 2,
        sub: 0,
        det: 0,
        default_msg: 'Other undefined status',
        reply: '2.0.0 test msg',
      },
      this.DSN.create(200, 'test msg'),
    )
  })

  it('create, code w/msg & subject', function () {
    assert.deepEqual(
      {
        code: 200,
        msg: 'test msg',
        cls: 2,
        sub: 7,
        det: 0,
        default_msg: 'Authentication Succeeded',
        reply: '2.7.0 test msg',
      },
      this.DSN.create(200, 'test msg', 7),
    )
  })

  it('net_unspecified returns expected code & message', function () {
    const r = this.DSN.net_unspecified()
    assert.equal(r.code, 450)
    assert.equal(r.default_msg, 'Other or undefined network or routing status')
  })

  it('net_unable_to_route returns expected code & message', function () {
    const r = this.DSN.net_unable_to_route()
    assert.equal(r.code, 550)
    assert.equal(r.default_msg, 'Unable to route')
  })
})

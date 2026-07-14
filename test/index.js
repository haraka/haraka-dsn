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
        default_msg: 'Other or undefined security status',
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

  describe('CRLF injection', () => {
    it('strips \\n from scalar msg', () => {
      const r = DSN.no_such_user('injected\nX-Extra: header')
      assert.ok(!r.reply.includes('\n'), `reply must not contain LF: ${r.reply}`)
    })

    it('strips \\r\\n from scalar msg', () => {
      const r = DSN.no_such_user('bad\r\ngoodbye')
      assert.ok(!r.reply.includes('\r'), `reply must not contain CR: ${r.reply}`)
      assert.ok(!r.reply.includes('\n'), `reply must not contain LF: ${r.reply}`)
    })

    it('strips \\n from each element of array msg', () => {
      const r = DSN.create(550, ['line one\nX-Injected: evil', 'line two'])
      for (const line of r.reply) {
        assert.ok(!line.includes('\n'), `reply line must not contain LF: ${line}`)
      }
    })
  })

  describe('caller array not mutated', () => {
    it('original msg array is unchanged after constructing multi-line reply', () => {
      const msgs = ['first line', 'second line', 'third line']
      const original = [...msgs]
      DSN.create(550, msgs)
      assert.deepEqual(msgs, original, 'caller array must not be mutated')
    })
  })

  describe('toString', () => {
    it('returns the scalar reply string', () => {
      const r = DSN.sec_unauthorized('Try again later', 451)
      assert.equal(r.toString(), '4.7.1 Try again later')
    })

    it('serializes via String() and template literals', () => {
      const r = DSN.sec_unauthorized('Try again later', 451)
      assert.equal(String(r), '4.7.1 Try again later')
      assert.equal(`${r}`, '4.7.1 Try again later')
    })

    it('joins a multi-line reply with LF', () => {
      const r = DSN.create(550, ['line one', 'line two'])
      assert.equal(r.toString(), '5.0.0 line one\n5.0.0 line two')
    })

    it('never yields [object Object]', () => {
      assert.ok(!DSN.sec_unauthorized('nope', 451).toString().includes('[object Object]'))
    })
  })

  describe('sec_unspecified default message', () => {
    it('returns "Other or undefined security status" by default', () => {
      const r = DSN.sec_unspecified()
      assert.equal(r.reply, '4.7.0 Other or undefined security status')
    })

    it('caller-supplied msg overrides the default', () => {
      const r = DSN.sec_unspecified('custom message')
      assert.ok(r.reply.includes('custom message'))
    })

    it('auth_succeeded still returns "Authentication Succeeded" in reply', () => {
      const r = DSN.auth_succeeded()
      assert.equal(r.reply, '2.7.0 Authentication Succeeded')
    })
  })

  describe('cls is a primitive number', () => {
    it('cls is typeof number, not a boxed String', () => {
      const r = DSN.create(550, 'test')
      assert.equal(typeof r.cls, 'number')
      assert.equal(r.cls, 5)
    })
  })

  describe('RFC 7505 — null MX', () => {
    it('addr_null_mx returns 556 / X.1.10', () => {
      const r = DSN.addr_null_mx()
      assert.equal(r.code, 556)
      assert.equal(r.reply, '5.1.10 Recipient address has null MX')
    })

    it('sec_null_mx_sender returns 550 / X.7.27', () => {
      const r = DSN.sec_null_mx_sender()
      assert.equal(r.code, 550)
      assert.match(r.reply, /^5\.7\.27 /)
    })
  })

  describe('RFC 7372 — email authentication', () => {
    it('sec_dkim_no_pass returns 550 / X.7.20', () => {
      const r = DSN.sec_dkim_no_pass()
      assert.equal(r.code, 550)
      assert.match(r.reply, /^5\.7\.20 /)
    })

    it('sec_spf_fail returns 550 / X.7.23', () => {
      const r = DSN.sec_spf_fail()
      assert.equal(r.code, 550)
      assert.match(r.reply, /^5\.7\.23 /)
    })

    it('sec_spf_error returns 451 / X.7.24', () => {
      const r = DSN.sec_spf_error()
      assert.equal(r.code, 451)
      assert.match(r.reply, /^4\.7\.24 /)
    })

    it('sec_rdns_fail returns 550 / X.7.25', () => {
      const r = DSN.sec_rdns_fail()
      assert.equal(r.code, 550)
      assert.match(r.reply, /^5\.7\.25 /)
    })

    it('sec_multi_auth_fail returns 550 / X.7.26', () => {
      const r = DSN.sec_multi_auth_fail()
      assert.equal(r.code, 550)
      assert.match(r.reply, /^5\.7\.26 /)
    })
  })
})

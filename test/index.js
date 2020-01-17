'use strict';

const assert = require('assert')

const constants = require('haraka-constants');

constants.import(global);

describe('haraka-dsn', function () {
    beforeEach(function (done) {
        this.DSN = require('../index')
        done()
    })


    it('should load', function (done) {
        assert.ok(this.DSN);
        done()
    })

    it('create, only code', function (done) {
        assert.deepEqual({
            code: 200, msg: undefined, cls: 2, sub: 0, det: 0,
            default_msg: 'Other undefined status',
            reply: '2.0.0 Other undefined status'
        },
        this.DSN.create(200)
        );
        done()
    })

    it('create, code w/msg', function (done) {
        assert.deepEqual({
            code: 200, msg: 'test msg', cls: 2, sub: 0, det: 0,
            default_msg: 'Other undefined status',
            reply: '2.0.0 test msg'
        },
        this.DSN.create(200, 'test msg')
        );
        done()
    })

    it('create, code w/msg & subject', function (done) {
        assert.deepEqual({
            code: 200, msg: 'test msg', cls: 2, sub: 7, det: 0,
            default_msg: 'Other or undefined security status',
            reply: '2.7.0 test msg'
        },
        this.DSN.create(200, 'test msg', 7)
        );
        done()
    })

    it('net_unspecified returns expected code & message', function (done) {
        const r = this.DSN.net_unspecified()
        assert.equal(r.code, 450)
        assert.equal(r.default_msg, 'Other or undefined network or routing status')
        done()
    })

    it('net_unable_to_route returns expected code & message', function (done) {
        const r = this.DSN.net_unable_to_route()
        assert.equal(r.code, 550)
        assert.equal(r.default_msg, 'Unable to route')
        done()
    })
})

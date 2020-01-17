'use strict';

const assert = require('assert')

const constants = require('haraka-constants');

constants.import(global);

describe('haraka-dns', function () {
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
})

# Changelog

The format is based on [Keep a Changelog](https://keepachangelog.com/).

### Unreleased

### [1.2.1] - 2026-07-14

- feat: add toString()
- use haraka-utils sanitize() for SMTP injection guard (#26)

### [1.2.0] - 2026-05-19

- RFC 7505
  - feat: add `addr_null_mx()` helper (556 / X.1.10)
  - feat: add `sec_null_mx_sender()` helper (550 / X.7.27)
- RFC 7372
  - feat: add `sec_dkim_no_pass/not_acceptable/no_author_match()` helpers (550 / X.7.20-22)
  - feat: add `sec_spf_fail()` helper (550 / X.7.23)
  - feat: add `sec_spf_error()` helper (451 / X.7.24)
  - feat: add `sec_rdns_fail()` (550 / X.7.25) and `sec_multi_auth_fail()` (550 / X.7.26)
- fix: `auth_succeeded()` explicitly passes default message so X.7.0 enum change does not affect it
- fix(enum): X.7.0 description corrected to "Other or undefined security status" per RFC 3463
- fix(enum): remove invalid X.2.5 entry (no RFC defines X.2.5)
- feat(enum): add X.1.10, X.3.6, X.7.15-X.7.27 from RFCs 6710, 7293, 7372, 7505
- doc(README): add RFCs 5248, 6710, 7293, 7372, 7504, 7505
- doc(README): add new helper functions to table; revise "function for each status condition" claim
- fix(security): strip CR/LF from msg to prevent SMTP response injection
- fix: multi-line reply no longer mutates the caller's array
- fix: `sec_unspecified()` default message is now "Other or undefined security status"
  - was "Authentication Succeeded"
- fix: replace `new String()` with `String()` for class extraction
- doc(README): correct function names in table
- doc(README): correct `addr_rcpt_ok` default code from 220 to 250
- doc(README): document all `auth_*` helpers (RFC 4954) in table

### [1.1.1] - 2026-05-18

- change: dep haraka-constants 1.0.7
- change: test runner is now node:test

### [1.1.0] - 2024-05-07

- add/update DSNs from RFCs 3886, 4468, 4954
- doc(README): improve formatting, add RFCs to Reference
- doc(CONTRIBUTORS): added
- dep: eslint-plugin-haraka -> @haraka/eslint-config
- chore(ci): updated to latest shared GHA configs

### 1.0.5 - 2024-04-04

- dev: only install mocha/eslint with npx, on demand
- pack: declare files to publish (shrink package) #21
- test: remove useless use of done
- ci: add on.pull_request

### 1.0.4 - 2022-06-05

- ci: update with shared GHA workflows
- ci: add node 18 testing
- ci: replace travis & appveyor with github actions

### 1.0.3 - 2020-01-17

- Use es6 classes on full - static members instead of old style `exports.stuff`
- test runner: nodeunit -> mocha
- ci test: drop node 6,8 add node 12 testing
- use es6 class #7
- Fix execution rights on run_tests #2
- Replaced concatenated strings with template literals #1

### 1.0.2 - 2017-09-11

- es6: use arrow functions

### 1.0.1 - 2017-09-04

- initial release

[1.0.4]: https://github.com/haraka/haraka-dsn/releases/tag/v1.0.4
[1.0.5]: https://github.com/haraka/haraka-dsn/releases/tag/v1.0.5
[1.1.0]: https://github.com/haraka/haraka-dsn/releases/tag/v1.1.0
[1.1.1]: https://github.com/haraka/haraka-dsn/releases/tag/v1.1.1
[1.2.0]: https://github.com/haraka/haraka-dsn/releases/tag/v1.2.0
[1.2.1]: https://github.com/haraka/haraka-dsn/releases/tag/v1.2.1

# Changelog

The format is based on [Keep a Changelog](https://keepachangelog.com/).

### Unreleased

### [1.1.0] - 2024-05-07

- add/update DSNs from RFCs 3886, 4468, 4954
- doc(README): improve formatting, add RFCs to Reference
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

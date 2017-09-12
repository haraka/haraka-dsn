[![Build Status][ci-img]][ci-url]
[![Windows Build Status][ci-win-img]][ci-win-url]
[![Greenkeeper badge][gk-img]][gk-url]
[![Code Climate][clim-img]][clim-url]
[![Code Coverage][cov-img]][cov-url]
[![NPM][npm-img]][npm-url]

# haraka-notes

Notes are objects that exist on Haraka connections and transactions. Prior to the release of [haraka-notes](https://github.com/haraka/haraka-notes), notes was just an empty object. Now notes is an empty object with two functions:


### set (path, value)

Sets a note at a dot delimited path to the specified value. The path can be any number of levels deep and any missing objects in the path are [autovivified](https://en.wikipedia.org/wiki/Autovivification). Perl refugees, contain yourselves.

```js
connection.transaction.notes.set('queue.wants', 'smtp_forward');
```

The above command sets `connection.transaction.notes.queue.wants` to the value 'smtp_forward'.


### get (path)

Fetches the value of a note from a given dot delimited path.

```js
connection.transaction.notes.get('queue.wants');
```


## Array Syntax

The get and set functions support passing the path as an array of strings. This might be useful to the type of masochist that has dots in their JS/JSON keys. Example:

```js
connection.transaction.notes.get(['i.do','like','pa.in']);
```


## [Note Path Registry](https://github.com/haraka/haraka-notes/wiki)

To reduce the likelihood of namespace collisions in Haraka notes, consider registering the note paths your plugins use [in the registry](https://github.com/haraka/haraka-notes/wiki).

<!-- leave these buried at the bottom of the document -->
[ci-img]: https://travis-ci.org/haraka/haraka-notes.svg
[ci-url]: https://travis-ci.org/haraka/haraka-notes
[ci-win-img]: https://ci.appveyor.com/api/projects/status/lgdkqxv2pdtrsstg?svg=true
[ci-win-url]: https://ci.appveyor.com/project/haraka/haraka-lgdkqxv2pdtrsstg
[cov-img]: https://codecov.io/github/haraka/haraka-notes/coverage.svg
[cov-url]: https://codecov.io/github/haraka/haraka-notes
[clim-img]: https://codeclimate.com/github/haraka/haraka-notes/badges/gpa.svg
[clim-url]: https://codeclimate.com/github/haraka/haraka-notes
[gk-img]: https://badges.greenkeeper.io/haraka/haraka-notes.svg
[gk-url]: https://greenkeeper.io/
[npm-img]: https://nodei.co/npm/haraka-notes.png
[npm-url]: https://www.npmjs.com/package/haraka-notes

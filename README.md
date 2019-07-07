# phash-imagemagick

[![CircleCI](https://circleci.com/gh/science-periodicals/phash-imagemagick.svg?style=svg)](https://circleci.com/gh/science-periodicals/phash-imagemagick)

[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

Get and compare [perceptual hashes](http://en.wikipedia.org/wiki/Perceptual_hashing) ([as computed by imagemagick](http://www.fmwconcepts.com/misc_tests/perceptual_hash_test_results_510/index.html)).

Note: this module is auto published to npm on CircleCI. Only run `npm version
patch|minor|major` and let CI do the rest.

## Installation

- Install [imagemagick](http://www.imagemagick.org/) (```brew install imagemagick``` on OSX).

Run:

```sh
    npm install
```

## Usage


### Get a perceptual hash

```js
var pHash = require('phash-imagemagick');

pHash.get('image.png', function(err, data) {
  console.log(data.pHash);
});

```

```js
pHash.get(input, callback)
```

where `input` is a filePath or a readable stream.


### Test if 2 perceptual hashes are similar

```js
pHash.eq(obj1, obj2)
```

where `obj1` and `obj2` are object obtained from `pHash.get`.

## Test

Run:

```sh
    npm test
```

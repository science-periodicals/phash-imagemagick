# phash-imagemagick

Get and compare [perceptual hashes](http://en.wikipedia.org/wiki/Perceptual_hashing) ([as computed by imagemagick](http://www.fmwconcepts.com/misc_tests/perceptual_hash_test_results_510/index.html)).


## Installation

- Install [imagemagick](http://www.imagemagick.org/) (```brew install imagemagick``` on OSX).

Run:

    npm install



## Usage


### Get a perceptual hash

```
var pHash = require('phash-imagemagick');

pHash.get('image.png', function(err, data) {
  console.log(data.pHash);
});

```

pHash.get(input, callback)

where `input` is a filePath or a readable stream.


### Test if 2 perceptual hashes are similar

pHash.eq(obj1, obj2)

where `obj1` and `obj2` are object obtained from `pHash.get`.

## Test

Run:

    npm test

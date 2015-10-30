var util = require('util')
  , fs = require('fs')
  , path = require('path')
  , assert = require('assert')
  , async = require('async')
  , pHash = require('..');

var root = path.dirname(__filename);

var absPaths = fs.readdirSync(path.join(root, 'fixtures'))
      .filter(function(p) { return path.extname(p) === '.png' || path.extname(p) === '.jpg'; })
      .map(function(p) { return path.join(root, 'fixtures', p); });

var color = absPaths.filter(function(p) { return path.extname(p)=== '.png' && path.basename(p).indexOf('_gray') === -1; });
var colorLow =  absPaths.filter(function(p) { return path.extname(p)=== '.jpg' && path.basename(p).indexOf('_gray') === -1; });
var gray = absPaths.filter(function(p) { return path.extname(p)=== '.png' && path.basename(p).indexOf('_gray') !== -1; });
var grayLow =  absPaths.filter(function(p) { return path.extname(p)=== '.jpg' && path.basename(p).indexOf('_gray') !== -1; });

describe('pHash-imagemagick', function(){
  this.timeout(40000);

  // identify -verbose -moments figure.png
  describe('pHash', function(){
    it('should get perceptual hash values', function(done){
      pHash.get(color[0], function(err, data){
        assert(data.pHash.length === 42);
        done();
      });
    });
  });

  // compare -metric phash figure1.png figure2.png NULL:
  describe('pHash comparison', function(){
    var hashes;

    before(function(done) {
      async.parallel({
        color: function(cb) { async.mapSeries(color, pHash.get, cb); },
        colorLow: function(cb) { async.mapSeries(colorLow, pHash.get, cb); },
        gray: function(cb) { async.mapSeries(gray, pHash.get, cb); },
        grayLow: function(cb) { async.mapSeries(grayLow, pHash.get, cb); },
      }, function(err, res) {
        hashes = res;
        done();
      })
    });

    it('should compare hashes for color images of different resolutions', function() {
      for (var i=0; i < hashes.color.length; i++) {
        for (var j=0; j < hashes.colorLow.length; j++) {
          assert.equal(i===j, pHash.eq(hashes.color[i], hashes.colorLow[j]));
        }
      }
    });

    it('should compare hashes for gray images of different resolutions', function() {
      for (var i=0; i < hashes.gray.length; i++) {
        for (var j=0; j < hashes.grayLow.length; j++) {
          assert.equal(i===j, pHash.eq(hashes.gray[i], hashes.grayLow[j]));
        }
      }
    });

    it('should test if more than 2 images are similar', function() {
      Object.keys(hashes).forEach(function(key) {
        assert(!pHash.eq.apply(pHash, hashes[key]));
      });
    });

  });

});

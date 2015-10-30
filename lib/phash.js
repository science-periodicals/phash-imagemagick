var spawn = require('child_process').spawn
  , fs = require('fs')
  , readline = require('readline');

var IDENTIFY = process.env.IDENTIFY_BIN_PATH || 'identify';

module.exports = function(s, callback) {

  if (typeof s === 'string' || s instanceof String) {
    s = fs.createReadStream(s);
  }

  var args = ['-verbose', '-moments',  '-'];

  var child = spawn(IDENTIFY, args);

  s.pipe(child.stdin);

  var rl = readline.createInterface({
    input: child.stdout,
    output: process.stdout,
    terminal: false
  });

  // parsing inspired by https://github.com/aheckmann/gm/blob/master/lib/getters.js (but we use `readline`)
  var rgx1 = /^( *)(.+?): (.*)$/ // key: val
    , rgx2 = /^( *)(.+?):$/;     // key: begin nested object

  var rgxPh = /^PH\d$/;

  var data = {};
  var inPhash = false;

  rl.on('line', function(line) {
    var res = rgx1.exec(line) || rgx2.exec(line);

    if (res) {
      var key = res[2] ? res[2].trim() : '';
      var val = res[3] ? res[3].trim() : undefined;
      val = (val === 'Undefined') ? undefined : val;

      if (key === 'Mime type' && val) {
        data.fileFormat = val;
      } else if (key === 'Units' && val) {
        data.units = val;
      } else if (key === 'Type' && val) {
        data.colorType = val;
      } else if (key === 'Geometry' && val) {
        data.width =  parseInt(val.split('+')[0].split('x')[0], 10);
        data.height =  parseInt(val.split('+')[0].split('x')[1], 10);
      } else if (key === 'Resolution' && val) {
        data.ppi = {
          width: parseInt(val.split('x')[0], 10),
          height: parseInt(val.split('x')[1], 10)
        };
      } else if (key === 'Channel perceptual hash') {
        inPhash = true;
        data.pHash = [];
      }

      if (inPhash && rgxPh.test(key)) {
        Array.prototype.push.apply(data.pHash, val.split(',').map(function(x) {return parseFloat(x.trim(), 10);}));
        if (data.pHash.length >= 42) {
          inPhash = false;
        }
      }
    }
  });

  child.on('close', function (code) {
    rl.close();
    if (code !== 0) {
      return callback(new Error(code));
    }

    // post process
    // run: `identify -list Units` for the list of units -> ['PixelsPerInch', 'PixelsPerCentimeter']
    if (~['PixelsPerInch', 'PixelsPerCentimeter'].indexOf(data.units) && data.ppi) {
      if (data.units === 'PixelsPerCentimeter') {
        data.ppi.width *= 0.393701;
        data.ppi.height *= 0.393701;
      }
      delete data.units;
    } else {
      delete data.units;
      delete data.ppi;
    }

    callback(null, data);
  });

};

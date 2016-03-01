// see http://www.fmwconcepts.com/misc_tests/perceptual_hash_test_results_510/index.html
exports.THRESHOLD_COLOR = 21;
exports.THRESHOLD_GRAY = 3.7;

function toArray(x) {
  return x.match(/[\-0-9]{4}/g).map(function(x) {
    return parseInt(x, 10)/100;
  });
};

exports.compare = function(obj1, obj2) {
  var x = toArray(obj1.pHash)
    , y = toArray(obj2.pHash)
    , sse = 0;

  for (var i=0; i < x.length; i++) {
    sse += Math.pow(x[i] - y[i], 2);
  }

  return sse;
};


exports.eq = function() {
  for (var i=0;  i < arguments.length; i++) {
    for (var j=(i+1);  j < arguments.length; j++) {
      var sse = exports.compare(arguments[i], arguments[j]);
      var threshold;
      if (arguments[i].colorType === arguments[j].colorType) { //`identify -list Type` for the list of Type
        threshold = (/^Gray/.test(arguments[i].colorType)) ? exports.THRESHOLD_GRAY : exports.THRESHOLD_COLOR;
      } else {
        threshold = exports.THRESHOLD_COLOR;
      }
      if (sse > threshold) {
        return false;
      }
    }
  }

  return true;
};

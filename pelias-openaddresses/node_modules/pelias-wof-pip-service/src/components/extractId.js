var map = require('through2-map');

module.exports.create = function() {
  // this method just returns the id property of an object
  return map.obj(function(o, enc, callback) {
    return o.id.toString();
  });
}

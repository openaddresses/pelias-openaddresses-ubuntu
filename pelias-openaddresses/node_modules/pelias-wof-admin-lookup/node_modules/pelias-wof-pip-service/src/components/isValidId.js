var filter = require('through2-filter');

module.exports.create = function() {
  // return true if id length is gte 6, false otherwise
  return filter.obj(function(id) {
    return id.length >= 6;
  });
}

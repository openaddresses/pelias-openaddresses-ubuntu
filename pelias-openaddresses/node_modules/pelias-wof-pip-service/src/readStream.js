var parse = require('csv-parse');
var fs = require('fs');
var sink = require('through2-sink');
var extractId = require('./components/extractId');
var isValidId = require('./components/isValidId');
var loadJSON = require('./components/loadJSON');
var extractFields = require('./components/extractFields');
var simplifyGeometry = require('./components/simplifyGeometry');
var isActiveRecord = require('./components/isActiveRecord');
var filterOutNamelessRecords = require('./components/filterOutNamelessRecords');

/*
  This function finds all the `latest` files in `meta/`, CSV parses them,
  pushes the ids onto an array and calls the callback
*/
function readData(directory, layer, callback) {
  var features = [];

  var options = {
    delimiter: ',',
    columns: true
  };

  fs.createReadStream(directory + 'meta/wof-' + layer + '-latest.csv')
    .pipe(parse(options))
    .pipe(extractId.create())
    .pipe(isValidId.create())
    .pipe(loadJSON.create(directory))
    .pipe(isActiveRecord.create())
    .pipe(filterOutNamelessRecords.create())
    .pipe(extractFields.create())
    .pipe(simplifyGeometry.create())
    .pipe(sink.obj(function(feature) {
      features.push(feature);
    }))
    .on('finish', function() {
      callback(features);
    });

}

module.exports = readData;

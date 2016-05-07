var tape = require('tape');
var event_stream = require('event-stream');
var path = require('path');
var fs = require('fs-extra');
var _ = require('lodash');

function test_stream(input, testedStream, callback) {
  var input_stream = event_stream.readArray(input);
  var destination_stream = event_stream.writeArray(callback);

  input_stream.pipe(testedStream).pipe(destination_stream);
}

tape('loadJSON tests', function(test) {
  test.test('json should be loaded from file', function(t) {
    var input = '123456789';

    // create a directory to hold the temporary file
    var tmpDirectory = ['data', '123', '456', '789'];
    fs.mkdirsSync(tmpDirectory.join(path.sep));

    // write the contents to a file
    var filename = tmpDirectory.concat('123456789.geojson').join(path.sep);
    var fileContents = { a: 1, b: 2 };
    fs.writeFileSync(filename, JSON.stringify(fileContents) + '\n');

    var loadJSON = require('../../src/components/loadJSON').create('.');

    test_stream([input], loadJSON, function(err, actual) {
      // cleanup the tmp directory
      fs.removeSync(tmpDirectory[0]);

      t.deepEqual(actual, [fileContents], 'should be equal');
      t.end();
    });

  });

});

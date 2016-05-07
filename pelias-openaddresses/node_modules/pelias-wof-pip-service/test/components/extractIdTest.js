var tape = require('tape');
var event_stream = require('event-stream');

function test_stream(input, testedStream, callback) {
  var input_stream = event_stream.readArray(input);
  var destination_stream = event_stream.writeArray(callback);

  input_stream.pipe(testedStream).pipe(destination_stream);
}

tape('extractId tests', function(test) {
  test.test('id should be returned from object input', function(t) {
    var input = {
      id: 17,
      name: 'Name'
    };

    var expected = '17';

    var extractId = require('../../src/components/extractId').create();

    test_stream([input], extractId, function(err, actual) {
      t.deepEqual(actual, [expected], 'should be equal');
      t.end();
    });

  });

});

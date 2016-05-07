var tape = require('tape');
var event_stream = require('event-stream');

function test_stream(input, testedStream, callback) {
  var input_stream = event_stream.readArray(input);
  var destination_stream = event_stream.writeArray(callback);

  input_stream.pipe(testedStream).pipe(destination_stream);
}

tape('isValidId tests', function(test) {
  test.test('only ids with length >= 6 should be returned', function(t) {
    var input = [
      '1',
      '12',
      '123',
      '1234',
      '12345',
      '123456',
      '1234567',
      '12345678',
      '123456789'
    ];

    var expected = [
      '123456',
      '1234567',
      '12345678',
      '123456789'
    ];

    var isValidId = require('../../src/components/isValidId').create();

    test_stream(input, isValidId, function(err, actual) {
      t.deepEqual(actual, expected, 'should be equal');
      t.end();
    });

  });

});

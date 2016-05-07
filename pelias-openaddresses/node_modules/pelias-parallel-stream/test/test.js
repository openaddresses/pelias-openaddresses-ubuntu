var tape = require('tape');
var event_stream = require('event-stream');

var parallelStream = require('../index.js');

function test_stream(input, testedStream, callback) {
  var input_stream = event_stream.readArray(input);
  var destination_stream = event_stream.writeArray(callback);

  input_stream.pipe(testedStream).pipe(destination_stream);
}

tape('tests', function(test) {
  test.test('nothing but passthrough', function(t) {
    var input = [ 'one', 'two', 'three' ];

    var stream = parallelStream(1, function (doc, enc, next) {
      next(null, doc);
    });

    test_stream(input, stream, function(err, actual) {
      t.deepEqual(actual, input, 'no side-effects');
      t.end();
    });
  });

  test.test('simple processing', function(t) {
    var input    = [ 'one',        'two',        'three' ];
    var expected = [ 'twenty-one', 'twenty-two', 'twenty-three' ];

    var stream = parallelStream(1, function (doc, enc, next) {
      doc = 'twenty-' + doc;
      next(null, doc);
    });

    test_stream(input, stream, function(err, actual) {
      t.deepEqual(actual, expected, 'processed all objects');
      t.end();
    });
  });

  test.test('async', function(t) {
    var input    = [
      {name:'one', timeout: 100},
      {name:'two', timeout:0},
      {name:'three', timeout: 10}
    ];
    var expected = [
      {name:'twenty-two', timeout:0},
      {name:'twenty-three', timeout:10},
      {name:'twenty-one', timeout:100}
    ];

    var stream = parallelStream(100, function (doc, enc, next) {
      setTimeout(function () {
        doc.name = 'twenty-' + doc.name;
        next(null, doc);
      }, doc.timeout);
    });

    test_stream(input, stream, function(err, actual) {
      t.deepEqual(actual, expected, 'processed out of order due to async');
      t.end();
    });
  });

  test.test('error', function (t) {
    var input = 'bad bad data';

    var stream = parallelStream(100, function (doc, enc, next) {
      setTimeout(function () {
        next(new Error('I do not like this ' + doc));
      }, 0);
    });

    stream.on('error', function (err) {
      t.assert(err, 'error was detected');
      t.end();
    });

    stream.write(input);
  });

  test.test('end-handler', function (t) {
    t.plan(1);

    var input    = [ 'one', 'two'];
    var handled = 0;

    var stream = parallelStream( 1,
      function (doc, enc, next) {
        handled++;
        next(null, doc);
      },
      function () {
        t.equal(handled, 2, 'end handler called after processing');
      }
    );

    test_stream(input, stream, function(err, actual) {
      t.end();
    });
  });
});

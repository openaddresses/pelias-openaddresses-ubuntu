var tape = require('tape');
var event_stream = require('event-stream');

function test_stream(input, testedStream, callback) {
  var input_stream = event_stream.readArray(input);
  var destination_stream = event_stream.writeArray(callback);

  input_stream.pipe(testedStream).pipe(destination_stream);
}

tape('extractFields tests', function(test) {
  test.test('non-special case record', function(t) {
    var input = {
      properties: {},
      geometry: 'Geometry'
    };
    input.properties['wof:id'] = 17;
    input.properties['wof:name'] = 'Feature name';
    input.properties['wof:placetype'] = 'Feature placetype';
    input.properties['wof:hierarchy'] = 'Feature hierarchy';

    var expected = {
      properties: {
        Id: 17,
        Name: 'Feature name',
        Placetype: 'Feature placetype',
        Hierarchy: 'Feature hierarchy'
      },
      geometry: 'Geometry'
    };

    var extractFields = require('../../src/components/extractFields').create();

    test_stream([input], extractFields, function(err, actual) {
      t.deepEqual(actual, [expected], 'should be equal');
      t.end();
    });

  });

  test.test('US county placetype with qs:a2_alt should use that as name value', function(t) {
    var input = {
      properties: {}
    };
    input.properties['wof:id'] = 17;
    input.properties['wof:name'] = 'Feature name';
    input.properties['iso:country'] = 'US';
    input.properties['wof:placetype'] = 'county';
    input.properties['wof:hierarchy'] = 'Feature hierarchy';
    input.properties['qs:a2_alt'] = 'a2_alt value';

    var expected = {
      properties: {
        Id: 17,
        Name: 'a2_alt value',
        Placetype: 'county',
        Hierarchy: 'Feature hierarchy'
      },
      geometry: undefined
    };

    var extractFields = require('../../src/components/extractFields').create();

    test_stream([input], extractFields, function(err, actual) {
      t.deepEqual(actual, [expected], 'should be equal');
      t.end();
    });

  });

  test.test('county placetype with qs:a2_alt but not US should use wof:name', function(t) {
    var input = {
      properties: {}
    };
    input.properties['wof:id'] = 17;
    input.properties['wof:name'] = 'Feature name';
    input.properties['iso:country'] = 'non-US';
    input.properties['wof:placetype'] = 'county';
    input.properties['wof:hierarchy'] = 'Feature hierarchy';
    input.properties['qs:a2_alt'] = 'a2_alt value';

    var expected = {
      properties: {
        Id: 17,
        Name: 'Feature name',
        Placetype: 'county',
        Hierarchy: 'Feature hierarchy'
      },
      geometry: undefined
    };

    var extractFields = require('../../src/components/extractFields').create();

    test_stream([input], extractFields, function(err, actual) {
      t.deepEqual(actual, [expected], 'should be equal');
      t.end();
    });

  });

  test.test('US ISO but non-county placetype with qs:a2_alt should use wof:name', function(t) {
    var input = {
      properties: {}
    };
    input.properties['wof:id'] = 17;
    input.properties['wof:name'] = 'Feature name';
    input.properties['iso:country'] = 'US';
    input.properties['wof:placetype'] = 'non-county';
    input.properties['wof:hierarchy'] = 'Feature hierarchy';
    input.properties['qs:a2_alt'] = 'a2_alt value';

    var expected = {
      properties: {
        Id: 17,
        Name: 'Feature name',
        Placetype: 'non-county',
        Hierarchy: 'Feature hierarchy'
      },
      geometry: undefined
    };

    var extractFields = require('../../src/components/extractFields').create();

    test_stream([input], extractFields, function(err, actual) {
      t.deepEqual(actual, [expected], 'should be equal');
      t.end();
    });

  });

  test.test('US county placetype but without qs:a2_alt should use wof:name', function(t) {
    var input = {
      properties: {}
    };
    input.properties['wof:id'] = 17;
    input.properties['wof:name'] = 'Feature name';
    input.properties['iso:country'] = 'US';
    input.properties['wof:placetype'] = 'county';
    input.properties['wof:hierarchy'] = 'Feature hierarchy';

    var expected = {
      properties: {
        Id: 17,
        Name: 'Feature name',
        Placetype: 'county',
        Hierarchy: 'Feature hierarchy'
      },
      geometry: undefined
    };

    var extractFields = require('../../src/components/extractFields').create();

    test_stream([input], extractFields, function(err, actual) {
      t.deepEqual(actual, [expected], 'should be equal');
      t.end();
    });

  });

});

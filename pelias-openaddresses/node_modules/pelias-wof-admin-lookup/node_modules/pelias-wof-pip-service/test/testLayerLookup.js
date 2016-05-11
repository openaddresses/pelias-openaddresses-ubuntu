var fs = require('fs');
var path = require( 'path' );

var async = require('async');
var deep = require( 'deep-diff' );

var createPIPService = require('../src/index.js').create;

/*
 * Only run some layers to speed up the tests
 */
var layers = [
  //'continent',
  'country', // 216
  //'county', // 18166
  'dependency', // 39
  'disputed', // 39
  //'localadmin', // 106880
  //'locality', // 160372
  'macrocounty', // 350
  'macroregion', // 82
  //'neighbourhood', // 62936
  'region' // 4698
];

createPIPService(layers, function (err, pipService) {
  var basePath = path.resolve(__dirname);
  var inputDataPath = basePath + '/data/layerTestData.json';
  var inputData = require( inputDataPath );
  var results = [];
  var expectedPath = basePath + '/data/expectedLayerTestResults.json';

  async.forEach(inputData, function (location, done) {
    pipService.lookup(location.latitude, location.longitude, function (err, result) {
      results.push(result);
      done();
    }, location.layers);
  },
  function end() {
    var expected = JSON.parse(fs.readFileSync(expectedPath));

    // uncomment this to write the actual results to the expected file
    // make sure they look ok though. semicolon left off so jshint reminds you
    // not to commit this line
    //fs.writeFileSync(expectedPath, JSON.stringify(results, null, 2))

    var diff = deep(expected, results);

    if (diff) {
      console.log('expected and actual output are the same');
      console.log(diff);
      process.exit(1);
    } else {
      console.log('expected and actual output are the same');
    }

    pipService.end();
  });
});

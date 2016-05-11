var microtime = require('microtime');
var createPIPService = require('../src/index.js').create;
var fs = require('fs');
var async = require('async');
var _ = require('lodash');

var inputData = require('./testData.json');


var layers = [
  //'continent',
  'country', // 216
  'county', // 18166
  'dependency', // 39
  'disputed', // 39
  'localadmin', // 106880
  'locality', // 160372
  'macrocounty', // 350
  'macroregion', // 82
  'neighbourhood', // 62936
  'region' // 4698
];

var startTime = microtime.now();

createPIPService(layers, function (err, pipService) {

  console.log('Total load time (minutes) = ', (microtime.now() - startTime)/1000000/60);

  inputData = _.concat(inputData, _.clone(inputData));
  inputData = _.concat(inputData, _.clone(inputData));
  inputData = _.concat(inputData, _.clone(inputData));

  startTime = microtime.now();

  async.forEach(inputData, function (location, done) {
    pipService.lookup(location.latitude, location.longitude, function (err, results) {
      location.results = results;
      done();
    });
  },
  function end() {
    var reqDuration = (microtime.now() - startTime) / inputData.length;
    console.log('Query count = ', inputData.length);
    console.log('Average duration (μsec) = ', reqDuration);
    console.log('Computed req/sec = ', 1000000 / reqDuration);

    fs.writeFileSync('./actualTestResuts.json', JSON.stringify(inputData, null, 2));

    pipService.end();
  });

});

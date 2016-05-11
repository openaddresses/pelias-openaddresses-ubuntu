
var tape = require('tape');
var common = {};

var tests = [
  require('./Mergeable.js')
];

tests.map(function(t) {
  t.all(tape, common)
});
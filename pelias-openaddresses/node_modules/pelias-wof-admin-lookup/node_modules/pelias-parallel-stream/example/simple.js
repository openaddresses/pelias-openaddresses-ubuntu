var streamArray = require('stream-array');
var sink = require('through2-sink');

var maxInFlight = process.argv[2] || 1;
var parallelStream = require('../index.js');

var seeYouLaterStream = parallelStream(maxInFlight,
  function (doc, enc, next) {
    console.log('I see you, ' + doc.name);

    setTimeout(function () {
      doc.msg = 'Oh hey there again, ' + doc.name;
      next(null, doc);
    }, 1000);
  },
  function () {
    console.log('Ooh, looks like the stream is finished');
  });

streamArray([{name:'Diana'}, {name:'Julian'}, {name:'Stephen'}, {name:'Peter'}])
  .pipe(seeYouLaterStream)
  .pipe(sink.obj(function (doc) {
    console.log(doc.msg);
  }));


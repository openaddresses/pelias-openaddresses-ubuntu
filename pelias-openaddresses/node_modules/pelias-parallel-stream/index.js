var through2 = require('through2');

function createStream(maxInFlight, workerFunc, endFunc) {

  var resumeQueue = [];
  var queueDepth = 0;

  return through2.obj(function(doc, enc, next) {

    // bind the `this.push` function to `this` here so we can save the correct context for it
    // since it's going to be called from within a callback below and `this` will be different in there
    var scopedPush = this.push.bind(this);

    queueDepth++;

    workerFunc(doc, enc, function (err, docToPush) {
      queueDepth--;

      if (err) {
        return next(err);
      }

      scopedPush(docToPush);

      // check to see if we're currently blocking the stream and waiting to call `next()`
      // until a slot opens up in the queue. Since at this point a space is free, call `next()`
      if (resumeQueue.length > 0) {
        var resume = resumeQueue.pop();
        resume();
      }
    });

    // if we've reached maxInFlight, don't call `next()` right away to force upstream to pause
    // instead, queue `next` up so it can be called from the response callback
    if ( queueDepth < maxInFlight ) {
      next();
    }
    else {
      resumeQueue.push(next);
    }
  },
  // we need to keep an eye on the EOF signal in order to halt it being passed downstream
  // wait until there are no more requests in flight and once queueDepth === 0 call next() to flush the stream
  // (without this, the stream cannot complete properly unless maxInFlight === 1
  function (next) {
    var interval = setInterval(function () {
      if (queueDepth === 0) {
        clearInterval(interval);

        // call the end handler if one was provided
        if (endFunc && typeof endFunc === 'function') {
          endFunc();
        }
        next();
      }
    }, 100);
  });
}

module.exports = createStream;

# pelias-parallel-stream

Sometimes you want to call an async function inside a transform stream and be able to
take full advantage of the magical asynchronicity of node.js.
 
In order to do this, we must decouple the `this.push(data)` from the `next()`.
 
This module allows you to do that in a clean and simple way. See below.


## usage

```javascript
var parallelStream = require('pelias-parallel-stream');

var maxInFlight = 2;

var seeYouLaterStream = parallelStream(maxInFlight, 
  function (doc, enc, next) {
    console.log('I see you, ' + doc.name);
    
    setTimeout(function () {
      doc.msg = 'Oh hey there, ' + doc.name;
      next(null, doc);
    }, 1000);
  },
  function () {
     console.log('Ooh, looks like the stream is finished');
  });
```

> NOTE: the end function is optional

Once you've made your new parallel stream, you can use it just like you would any normal transform stream.
Just throw it into a `.pipe()` call, like so.

```javascript
var streamArray = require('stream-array');
var sink = require('through2-sink');

streamArray([{name:'Diana'}, {name:'Julian'}, {name:'Stephen'}, {name:'Peter'}])
  .pipe(seeYouLaterStream)  // <--- there it is
  .pipe(sink.obj(function (doc) {
    console.log(doc.msg);
  }));
```

You can see the full example [here](example/simple.js)

Now let's play around with this `maxInFlight` parameter.
Let's first see how setting the `maxInFlight` to `1` results in a strandard ___serial___ transform stream.
So the output will look like this...

```bash
$ time npm run example -- 1
I see you, Diana
Oh hey there again, Diana
I see you, Julian
Oh hey there again, Julian
I see you, Stephen
Oh hey there again, Stephen
I see you, Peter
Oh hey there again, Peter

real	0m4.256s
user	0m0.114s
sys	    0m0.021s
```

Now let's set it to `2` and see how different the output looks, and if performance has improved.

```bash
$ time npm run example -- 2
I see you, Diana
I see you, Julian
Oh hey there again, Diana
I see you, Stephen
Oh hey there again, Julian
I see you, Peter
Oh hey there again, Stephen
Oh hey there again, Peter

real	0m2.258s
user	0m0.128s
sys	    0m0.025s
```

You can see when we allow 2 requests in flight, we get the first 2 requests back-to-back, send then off for async
handling and then pause to wait for one of them to return and make room for the next incoming request.
As soon as we've seen one of the first 2 requests come back (`Oh hey there again, Diana`),
another incoming requests comes in (`I see you, Stephen`). And let's note that the amount of time it took to get through
all the data has been cut in half, because... __asynchronous__!
  
Finally, let's run it with `maxInFlight` set to `200`, which is just a number larger than the length of the input data array.

```bash
$ time npm run example -- 200
I see you, Diana
I see you, Julian
I see you, Stephen
I see you, Peter
Oh hey there again, Diana
Oh hey there again, Julian
Oh hey there again, Stephen
Oh hey there again, Peter

real	0m1.159s
user	0m0.121s
sys	    0m0.022s
```

You can see that all the requests were sent out at once, and all the responses came in shortly thereafter. 
Note how quickly it all happened, too. 
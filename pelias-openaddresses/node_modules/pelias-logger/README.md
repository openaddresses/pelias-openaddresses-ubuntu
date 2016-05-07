# logger

[![NPM](https://nodei.co/npm/pelias-logger.png)](https://nodei.co/npm/pelias-logger/)

The centralized logger package for Pelias, which wraps [winston](https://github.com/winstonjs/winston) with
Pelias-specific transports and default configurations.

### config
The logger will set its log levels to the `logger.level` property in `pelias-config`, which should be set to any of the
default winston [options](https://github.com/winstonjs/winston#logging-levels). `logger.timestamp` and
`logger.colorize` take boolean values (defaulting to `true`) that indicate whether log lines should have a
timestamp/be colorized.

### API
##### `get( name, loggerOpts )`
Retrieve a logger with a specific name or, if none is found, create a new one.

  * `name`: the name to search for/assign to the logger
  * `loggerOpts`: if a new logger has to be created, the options to pass to
    [`winston.Logger()`](https://github.com/winstonjs/winston#instantiating-your-own-logger)

##### `winston`
The winston package is exposed via this option, to provide access to any items needed in custom `loggerOpts` passed to
`get()` (like `winston.transports.*` classes).

### example
```javascript
var peliasLogger = require( 'pelias-logger' );
var logger1 = peliasLogger.get( 'logger1' );
var logger2 = peliasLogger.get( 'logger2', {
	transports: [
		new peliasLogger.winston.transports.File( {
			filename: 'output.txt',
			timestamp: true
		})
	]
});
logger1.warn( 'hello' );
```

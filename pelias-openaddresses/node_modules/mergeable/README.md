## Installation

```bash
$ npm install mergeable
```

[![NPM](https://nodei.co/npm/mergeable.png?downloads=true&stars=true)](https://nodei.co/npm/mergeable)

## Usage

Create a new Mergable object:

```javascript
var Mergeable = require('mergeable');

var config = new Mergeable( { a: 'b' } );
config.deepMerge( { a: 'c', d: 'e' } );

var copy = config.export();
console.log( config.stringify() );
```

## Interface

```javascript
// initialize with data
var Config = function( String|Object init )

// deep merge config
Config.prototype.deepMerge = function( Object data )

// deep merge config from path
Config.prototype.deepMergeFromPath = function( String path )

// shallow merge config
Config.prototype.shallowMerge = function( Object data )

// shallow merge config from path
Config.prototype.shallowMergeFromPath = function( String path )

// clear and replace config
Config.prototype.replace = function( Object data )

// replace config from path
Config.prototype.replaceFromPath = function( String path )

// clear all settings from this instance
Config.prototype.clear = function()

// strip out all functions etc and produce a copy
Config.prototype.export = function()

// return pretty formatting for easy reading
Config.prototype.stringify = function()
```

## NPM Module

The `mergeable` npm module can be found here:

[https://npmjs.org/package/mergeable](https://npmjs.org/package/mergeable)

## Contributing

Please fork and pull request against upstream master on a feature branch.

Pretty please; provide unit tests and script fixtures in the `test` directory.

### Running Unit Tests

```bash
$ npm test
```

### Continuous Integration

Travis tests every release against node version `0.10`

[![Build Status](https://travis-ci.org/pelias/mergeable.png?branch=master)](https://travis-ci.org/pelias/mergeable)
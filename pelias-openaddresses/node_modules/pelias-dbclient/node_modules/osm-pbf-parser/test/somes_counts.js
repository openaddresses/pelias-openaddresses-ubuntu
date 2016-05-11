var test = require('tape');
var fs = require('fs');
var path = require('path');
var parser = require('../');
var through = require('through2');

test('somes counts', function (t) {
    t.plan(1);
    var osm = parser();
    var counts = {};
    
    var file = path.join(__dirname, 'extracts/somes.osm.pbf');
    var rs = fs.createReadStream(file);
    rs.pipe(osm).pipe(through.obj(write, end));

    function write (row, enc, next) {
        row.forEach(function (item) {
            if (!counts[item.type]) counts[item.type] = 0;
            counts[item.type] ++;
        });
        next();
    }
    
    function end () {
        console.error(counts);
        t.deepEqual(counts, {
            node: 1494,
            way: 77,
            relation: 6
        });
        t.end();
    }
});

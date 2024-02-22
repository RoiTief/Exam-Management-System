// Copyright (c) 2012 Mark Cavage. All rights reserved.

var fs = require('fs');
var path = require('path');

var pino = require('pino');
var getopt = require('posix-getopt');
var restify = require('restify');

var system = require('./server');

///--- Globals

var NAME = 'Exam-Management-System';

var LOG = pino({ name: NAME });




///--- Mainline

(function main() {

    // First setup our 'database'
    var dir = path.normalize("" + '/todos');

    var server = todo.createServer({
        directory: dir,
        log: LOG
    });

    // At last, let's rock and roll
    server.listen( 8080, function onListening() {
        LOG.info('listening at %s', server.url);
    });
})();

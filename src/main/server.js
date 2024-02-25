var fs = require('fs');
var path = require('path');
var util = require('util');

var assert = require('assert-plus');
var pino = require('pino');
var restify = require('restify');
var errors = require('restify-errors');
const corsMiddleware = require('restify-cors-middleware2')


var service = require('./service');


///-- Formatters
function formatReq(req, res, body, cb) {
    if (body instanceof Error) {
        res.statusCode = body.statusCode || 500;
        body = body.message;
    } else if (typeof body === 'object') {
        body = body.task || JSON.stringify(body);
    } else {
        body = body.toString();
    }

    res.setHeader('Content-Length', Buffer.byteLength(body));
    return cb(null, body);
}

///--- Handlers
//todo 
function authenticate(req, res, next) {
    if (!req.allow) {
        req.log.debug('skipping authentication');
        next();
        return;
    }

    var authz = req.authorization.basic;

    if (!authz) {
        res.setHeader('WWW-Authenticate', 'Basic realm="todoapp"');
        next(new errors.UnauthorizedError('authentication required'));
        return;
    }

    if (
        authz.username !== req.allow.user ||
        authz.password !== req.allow.pass
    ) {
        next(new errors.ForbiddenError('invalid credentials'));
        return;
    }

    next();
}

///--API

function createServer(options) {
    assert.object(options, 'options');
    assert.string(options.directory, 'options.directory');
    assert.object(options.log, 'options.log');

    // Create a server with our logger and custom formatter
    // Note that 'version' means all routes will default to
    // 1.0.0
    var server = restify.createServer({
        formatters: {
            'application/ExamManagementSystem; q=0.9': formatReq
        },
        log: options.log,
        name: 'ExamManagementSystem',
        version: '1.0.0'
    });
    
    const cors = corsMiddleware({
        preflightMaxAge: 5, //Optional
        origins: ['*'],
        allowHeaders: ['API-Token'],
        exposeHeaders: ['API-Token-Expiry']
      })
      
      server.pre(cors.preflight)
      server.use(cors.actual)
    // Ensure we don't drop data on uploads
    server.pre(restify.plugins.pre.pause());

    // Clean up sloppy paths like //todo//////1//
    server.pre(restify.plugins.pre.sanitizePath());

    // Handles annoying user agents (curl)
    server.pre(restify.plugins.pre.userAgentConnection());

    // Set a per request pino logger (with requestid filled in)
    server.use(restify.plugins.requestLogger());

    // Allow 5 requests/second by IP, and burst to 10
    server.use(
        restify.plugins.throttle({
            burst: 10,
            rate: 5,
            ip: true
        })
    );

    // Use the common stuff you probably want
    server.use(restify.plugins.acceptParser(server.acceptable));
    server.use(restify.plugins.dateParser());
    server.use(restify.plugins.authorizationParser());
    server.use(restify.plugins.queryParser());
    server.use(restify.plugins.gzipResponse());
    server.use(restify.plugins.bodyParser());

    // Now our own handlers for authentication/authorization
    // Here we only use basic auth, but really you should look
    // at https://github.com/joyent/node-http-signature
    server.use(function setup(req, res, next) {
        req.dir = options.directory;

        if (options.user && options.password) {
            req.allow = {
                user: options.user,
                password: options.password
            };
        }
        next();
    });
    server.use(authenticate);

    /// Now the real handlers. Here we just CRUD on TODO blobs

    server.post('/signUp', service.signUp);
    server.post('/signIn', service.signIn);
    server.post('/logout', service.logout);
    server.post('/systemAdmin/addCourse', service.addCourse);
    server.post('/finishATask', service.finishATask);

    server.get('/viewMyTasks', service.viewMyTasks);
    server.get('/viewMyCourse', service.viewMyCourse);

    
    server.get('/', function root(req, res, next) {
        var routes = [
            'GET     /',
            'POST    /todo',
            'GET     /todo',
            'DELETE  /todo',
            'PUT     /todo/:name',
            'GET     /todo/:name',
            'DELETE  /todo/:name'
        ];
        res.send(200, routes);
        next();
    });

    // Setup an audit logger
    // if (!options.noAudit) {
    // server.on(
    // 'after',
    // restify.auditLogger({
    // body: true,
    // log: pino({ level: 'info', name: 'todoapp-audit' })
    // })
    // );
    // }

    return server;
}

///--- Exports

module.exports = {
    createServer: createServer
};


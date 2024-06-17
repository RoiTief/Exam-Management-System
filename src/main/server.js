require('dotenv').config();
var fs = require('fs');
var path = require('path');
var util = require('util');

var assert = require('assert-plus');
var pino = require('pino');
var restify = require('restify');
var errors = require('restify-errors');
const corsMiddleware = require('restify-cors-middleware2')
const jwt = require('jsonwebtoken');


var service = require('./service');

if(!process.env.SECRET_KEY){
    throw new Error('SECRET_KEY is required')
}
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

function extractAndVerifyJwt(req){
    if (req.headers && req.headers.authorization) {
        const parts = req.headers.authorization.split(' ');
        if (parts.length === 2) {
            const scheme = parts[0];
            const credentials = parts[1];

            if (/^(?:Bearer|JWT)$/i.test(scheme)) {
                var token = credentials;
                try {
                    token = jwt.verify(token, process.env.SECRET_KEY);
                    return token
                } catch (err) {
                    console.log({ err })
                    return null;
                }
            }
            else {
                return null
            }
        } else {
            return null
        }
    }
    else {
        return null
    }
}
///--- Handlers
//todo 
function authenticate(req) {
    let token = extractAndVerifyJwt(req);
    if(token){        
        if(!req.body) req.body = {} // when there is no body, create one so we can assign callingUser.

        // Calling user is the user who made the request, he is both register and logged in.
        req.body.callingUser = {username: token.username, type: token.type}
        return true;
    }
    return false;
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
        allowHeaders: ['API-Token', 'Authorization'],
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

    
    server.use(function setup(req, res, next) {
        if(authenticate(req)){
            next();
        }

        else if (req.url.startsWith('/signIn') || req.url.startsWith('/logout')) {
            next();
            return;
        }  
        else
            next(new errors.UnauthorizedError('invalid credentials'));
    });
    
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
    


     // request: username
    server.post('/signUp', service.signUp);

     //request: {username, password}
     //response: {User, token}
    server.post('/signIn', service.signIn);

    //request: {username, newPassword}
    //response: {User, token}
    server.post('/changePassword', service.changePassword);

    //request: {username}
    server.post('/resetPassword', service.resetPassword);

     // request: {}
    server.post('/logout', service.logout);
  
    //{"taskId", "response"}
    server.post('/finishATask', service.finishATask);

     // request: {username}
    server.post('/addTA', service.addTA)

     // request: {username}
    server.post('/addLecturer', service.addLecturer)

    //request: {
    //       keywords: str[],
    //       stem: str,
    //       keys: [{
    //         answer: str,
    //         explanation: str
    //         }],
    //       distractors: [{
    //         distractor: str,
    //         explanation: str
    //       }],
    //      appendix: {
    //          title: str,
    //          tag: str,
    //          content: str
    //       }
    //     }
    server.post('/addMetaQuestion', service.addMetaQuestion);

    //request: {
    //       keywords: str[],
    //       stem: str,
    //       keys: [{
    //         answer: str,
    //         explanation: str
    //         }],
    //       distractors: [{
    //         distractor: str,
    //         explanation: str
    //       }],
    //      appendix: {
    //          title: str,
    //          tag: str,
    //          content: str
    //       }
    //     }
    server.post('/editMetaQuestion', service.editMetaQuestion);

    // request:
    //  {    questions:[
    //   {
    //    stem: str
    //       appendix: {
    //              title: str,
    //              tag: str,
    //              content: str
    //        }
    //       answer: str,
    //       distractors: [str]
    //     }]
    //   }
    //  }
    server.post('/createExam', service.createExam)

    server.get('/getAllExams',service.getAllExams)

    // response: Task[]
    server.get('/viewMyTasks', service.viewMyTasks);
  
    // response: {TAs: [], Lecturers: []}
    server.get('/getAllStaff', service.getAllStaff);

    // response: User[]
    server.get('/getAllUsers', service.viewAllUsers);

    // response: MetaQuestion[]
    server.get('/getAllMetaQuestions', service.getAllMetaQuestions)

    // response: Appendix[]
    server.get('/getAllAppendices', service.getAllAppendices)

    // request: username
    server.del('/deleteUser', service.deleteUser)

    // request: username, type
    server.put('/editUser', service.editUser)



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


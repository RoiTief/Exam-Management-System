const ApplicationFacade = require("./business/applicationFacade");
const application = new ApplicationFacade();
var errors = require('restify-errors');


/// --- Errors 

const MissingParameterError = errors.makeConstructor('MissingParameterError', {
    statusCode: 409,
    restCode: 'MissingParameter',
    message: 'request is missing parameter'
});

const MissingUserError = errors.makeConstructor('MissingUserError', {
    statusCode: 410,
    restCode: 'MissingUser',
    message: 'user is not registered in the system'
});

function signUp(req, res, next) {
    if (!req.body.username | !req.body.password) {
        req.log.warn({ body: req.body }, 'signup option without all parameters');
        next(new MissingParameterError());
        return;
    }

    try{
        user = application.register(req.body.username, req.body.password);
        req.log.warn(req.body.username, 'new user registered');
        res.send(200, user)
        next()
    }
    catch(err){
        req.log.warn(err.message, 'unable to register user');
        next(err);
    }
}


module.exports = {
    signUp: signUp
};

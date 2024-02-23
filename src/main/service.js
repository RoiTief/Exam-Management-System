const ApplicationFacade = require("./business/applicationFacade");
const application = new ApplicationFacade();
const error = require('./error')


function signUp(req, res, next) {
    if (!req.body.username | !req.body.password) {
        req.log.warn({ body: req.body }, 'signup option without all parameters');
        next(error.MissingParameterError());
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

function signIn(req, res, next) {
    if (!req.body.username | !req.body.password) {
        req.log.warn({ body: req.body }, 'signup option without all parameters');
        next(error.MissingParameterError());
        return;
    }
    try{
        user = application.signIn(req.body.username, req.body.password);
        req.log.warn(req.body.username, 'user signed in');
        res.send(200, user)
        next()
    }
    catch(err){
        req.log.warn(err.message, 'user unable to signIn');
        next(err);
    }
}




module.exports = {
    signUp: signUp
    signIn: signIn
};

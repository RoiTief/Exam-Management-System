var errors = require('restify-errors');


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
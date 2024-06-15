// Error messages

/**
 * Holds all error messages that might occur in user processes such as register/login
 */
const USER_PROCESS_ERROR_MSGS = {
    // register
    USERNAME_DOESNT_EXIST: uname => `Username '${uname}' doesn't exist`,
    USERNAME_ALREADY_EXIST: uname => `Username '${uname}' already in use`,
    EMAIL_DOESNT_EXIST: email => `Email '${email}' doesn't exist`,
    EMAIL_ALREADY_EXIST: email => `Email '${email}' already in use`,
    USER_DETAILS_NULL: 'User details given are null',
    USER_DETAILS_MISSING_USERNAME: 'Username field is required',
    USER_DETAILS_MISSING_FNAME: 'First name field is required',
    USER_DETAILS_MISSING_LNAME: 'Last name field is required',
    USER_DETAILS_MISSING_EMAIL: 'Email field is required',
    USER_DETAILS_MISSING_TYPE: 'UserType field is required',
    INCORRECT_TYPE : (realType, expectedType) => `expected user type '${expectedType}', but got '${realType}'`,

    //Login
    USERNAME_LOGGED_IN: uname => `Username '${uname}' is already logged in`,
    USERNAME_NOT_LOGGED_IN: uname => `Username '${uname}' Not logged in`,
    INCORRECT_PASSWORD: 'Incorrect password',
    FAILED_LOGIN: 'Incorrect username or password'
}

const SESSION_PROCESS_ERROR_MSGS = {
    USERNAME_LOGGED_IN: USER_PROCESS_ERROR_MSGS.USERNAME_LOGGED_IN,
    USERNAME_NOT_LOGGED_IN: USER_PROCESS_ERROR_MSGS.USERNAME_NOT_LOGGED_IN,
    SESSION_IN_USE: 'Session is already in use',
    SESSION_NOT_IN_USE: 'Session is not in use',
}

// for MetaQuestions processes
const MQ_PROCESS_ERROR_MSGS = {
    APPENDIX_TAG_ALREADY_EXIST: tag => `Tag '${tag}' is already in use by another appendix`,
    APPENDIX_TAG_DOESNT_EXIST: tag => `Tag '${tag}' doesn't exist`,
    MQ_ID_DOESNT_EXIST: id => `A Meta-Question with ID '${id}' doesn't exist`,
}


module.exports = {
    USER_PROCESS_ERROR_MSGS,
    SESSION_PROCESS_ERROR_MSGS,
    MQ_PROCESS_ERROR_MSGS,
}
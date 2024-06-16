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

const FUNCTION_PARAMETERS_ERROR_MSGS = {
    MISSING_KEY: (key,callingFunctionName) => `Missing key: ${key}. ${callingFunctionName}`,
    TYPE_MISMATCH: (key, expectedType, realType,callingFunctionName) => `Type mismatch for key: ${key}. Expected: ${expectedType}, Found: ${realType}. ${callingFunctionName}`,
    UNSUPPORTED_TYPE: (key,callingFunctionName) => `Unsupported type specification for key: ${key}. ${callingFunctionName}`,
    NULL_OBJECT: (callingFunctionName) => `Cannot receive null object. ${callingFunctionName}`,
    NULL_VALUE: (key,callingFunctionName) => `Key: ${key} has value of null. ${callingFunctionName}`,
}

module.exports = {USER_PROCESS_ERROR_MSGS, SESSION_PROCESS_ERROR_MSGS, FUNCTION_PARAMETERS_ERROR_MSGS}
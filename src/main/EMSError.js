/**
 * @class EMSError
 * Custom error of Exam-Management-System (EMS) with an additional error code that may be used to indicate the error's cause.
 */
class EMSError extends Error {
    constructor(message, errorCode) {
        super(message);
        this.errorCode = errorCode;
    }
}

// Error codes for user process (login, register...)

const USER_PROCESS_ERROR_CODES = {
    //register
    USERNAME_DOESNT_EXIST: 50,
    USERNAME_ALREADY_EXIST: 51,
    EMAIL_DOESNT_EXIST: 52,
    EMAIL_ALREADY_EXIST: 53,

    USER_DETAILS_NULL: 54,
    USER_DETAILS_MISSING_USERNAME: 55,
    USER_DETAILS_MISSING_FNAME: 56,
    USER_DETAILS_MISSING_LNAME: 57,
    USER_DETAILS_MISSING_EMAIL: 58,
    USER_DETAILS_MISSING_TYPE: 59,
    INCORRECT_TYPE: 64,

    //log in
    USERNAME_NOT_LOGGED_IN: 60,
    USERNAME_ALREADY_LOGGED_IN: 61,
    INCORRECT_PASSWORD: 62,
    FAILED_LOGIN: 63,
}

const SESSION_PROCESS_ERROR_CODES = {
    USERNAME_NOT_LOGGED_IN: USER_PROCESS_ERROR_CODES.USERNAME_NOT_LOGGED_IN,
    USERNAME_ALREADY_LOGGED_IN: USER_PROCESS_ERROR_CODES.USERNAME_ALREADY_LOGGED_IN,
    SESSION_IN_USE: 100,
    SESSION_NOT_IN_USE: 101,
}

const FUNCTION_PARAMETERS_ERROR_CODES = {
    MISSING_KEY: 300,
    TYPE_MISMATCH: 301,
    UNSUPPORTED_TYPE: 302,
}

module.exports = {
    EMSError,
    USER_PROCESS_ERROR_CODES,
    SESSION_PROCESS_ERROR_CODES,
    FUNCTION_PARAMETERS_ERROR_CODES
}
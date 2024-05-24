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

// possible Error codes for EMSError defined with magic-numbers
const PK_NOT_EXISTS = 100;
const PK_ALREADY_EXISTS = 101;
const EMAIL_ALREADY_EXISTS = 102;
const LATEX_COMPILATION_FAILED = 200;

module.exports = {
    EMSError,
    PK_NOT_EXISTS,
    PK_ALREADY_EXISTS,
    EMAIL_ALREADY_EXISTS,
    LATEX_COMPILATION_FAILED,
}
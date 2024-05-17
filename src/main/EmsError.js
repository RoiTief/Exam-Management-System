
class EmsError extends Error {
    constructor(message, errorCode) {
        super(message);
        this.errorCode = errorCode;
    }
}

const PK_NOT_EXISTS = 100;
const PK_ALREADY_EXISTS = 101;
const EMAIL_ALREADY_EXISTS = 102;

module.exports = {
    EmsError,
    PK_NOT_EXISTS,
    PK_ALREADY_EXISTS,
    EMAIL_ALREADY_EXISTS,
}
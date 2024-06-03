// Error messages

/**
 * Holds all error messages that might occur in user processes such as register/login
 */
const USER_PROCESS = {
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

    //Login
    USERNAME_LOGGED_IN: uname => `Username '${uname}' is already logged in`,
    USERNAME_NOT_LOGGED_IN: uname => `Username '${uname}' Not logged in`,
    INCORRECT_PASSWORD: 'Incorrect password',
    FAILED_LOGIN: 'Incorrect username or password'
}


module.exports = {USER_PROCESS}
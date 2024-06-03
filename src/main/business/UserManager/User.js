const {EMSError, USER_PROCESS} = require("../../EMSError");
const {USER_PROCESS: ERROR_MSGS} = require("../../ErrorMessages");
const DEFAULT_PASSWORD = "123"

class User {
    #dalUser

    constructor(dalUser) {
        this.#dalUser = dalUser;
    }

    getUsername() {
        return this.#dalUser.username;
    }

    getFirstName() {
        return this.#dalUser.firstName;
    }

    getLastName() {
        return this.#dalUser.lastName;
    }

    getEmail() {
        return this.#dalUser.email;
    }

    getUserType(){
        return this.#dalUser.userType;
    }

    verifyType(type){
        return null
    }

    changePassword(password){
    }

    isFirstSignIn() {
        return this.#dalUser.password === DEFAULT_PASSWORD;
    }

    verifyPassword(password) {
        if (this.#dalUser.password !== password) throw new EMSError(ERROR_MSGS.INCORRECT_PASSWORD, USER_PROCESS.INCORRECT_PASSWORD);
    }
}


module.exports = { User, DEFAULT_PASSWORD };


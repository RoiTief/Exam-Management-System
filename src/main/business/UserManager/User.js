const {EMSError, USER_PROCESS_ERROR_CODES: ERROR_CODES} = require("../../EMSError");
const {USER_PROCESS_ERROR_MSGS: ERROR_MSGS} = require("../../ErrorMessages");
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

    async setFirstName(firstName) {
        this.#dalUser.firstName = firstName;
        await this.#dalUser.save();
    }

    getLastName() {
        return this.#dalUser.lastName;
    }

    async setLastName(lastName) {
        this.#dalUser.lastName = lastName;
        await this.#dalUser.save();
    }

    getEmail() {
        return this.#dalUser.email;
    }

    async setEmail(email){
        this.#dalUser.email = email;
        await this.#dalUser.save();
    }

    getUserType(){
        return this.#dalUser.userType;
    }

    async setUserType(userType){
        this.#dalUser.userType = userType;
        this.#dalUser.save();
    }

    verifyType(type){
        return null
    }

    async changePassword(password){
        this.#dalUser.password = password;
        await this.#dalUser.save();
    }

    isFirstSignIn() {
        return this.#dalUser.password === DEFAULT_PASSWORD;
    }

    verifyPassword(password) {
        if (this.#dalUser.password !== password) throw new EMSError(ERROR_MSGS.INCORRECT_PASSWORD, ERROR_CODES.INCORRECT_PASSWORD);
    }
}


module.exports = { User, DEFAULT_PASSWORD };


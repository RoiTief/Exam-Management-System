const { User, DEFAULT_PASSWORD} = require('./User');
const Admin = require('./Admin');
const Lecturer = require('./Lecturer');
const TA = require('./TA');
const types = require('../../Enums').USER_TYPES
const {USER_TYPES: userTypes, USER_TYPES} = require("../../Enums");
const {EMSError, PK_NOT_EXISTS, USER_PROCESS: ERROR_CODES} = require("../../EMSError");
const { USER_PROCESS: ERROR_MSGS } = require("../../ErrorMessages");

class UserController {
    #userRepo;
    // TODO: session manager should be a different entity outside UserController and work with the cookies given by the browser
    #sessionManager // session -> user
    #loggedUsers // username -> session

    constructor(userRepo){
        this.#sessionManager = new Map();
        this.#loggedUsers = new Map();
        this.#userRepo = userRepo;
    }

    /**
     * Checks whether given user is registered
     * @param username username to check
     * @returns true iff the user is registered
     */
    async #isRegistered(username){
        try {
            await this.#userRepo.getUser(username);
            return true;
        } catch (error) {
            if (error instanceof EMSError && error.errorCode === PK_NOT_EXISTS)
                return false;
            throw error;
        }
    }

    /**
     * Throws an error if given user is not registered
     * @param username username to verify
     * @throws EMSError iff user is not registered
     */
    async verifyUserRegistered(username) {
        if (! await this.#isRegistered(username)){
            throw new EMSError(ERROR_MSGS.USERNAME_DOESNT_EXIST(username), ERROR_CODES.USERNAME_DOESNT_EXIST);
        }
    }

    /**
     * Checks whether given user is logged in or not.
     * @param username user to test.
     * @returns true iff user is logged in
     */
    #isLoggedIn(username){
        if (!this.#loggedUsers.has(username)) return false;

        if (this.#isSessionStale(this.#loggedUsers.get(username))) {
            return !this.#loggedUsers.delete(username); // delete returns true iff deletion was successful
        }
        return true;
    }

    /**
     * Throws an error if given user is not logged in already.
     * @param username username to verify
     * @throws EMSError iff user is not logged in
     */
    verifyLoggedIn(username){
        if(! this.#isLoggedIn(username))
            throw new EMSError(ERROR_MSGS.USERNAME_NOT_LOGGED_IN(username), ERROR_CODES.USERNAME_NOT_LOGGED_IN);
    }

    /**
     * Returns whether the session is logged into a certain user or not.
     * @param session session to check.
     * @return true iff session is logged into a user.
     */
    #isSessionInUse(session) {
        return this.#sessionManager.has(session);
    }

    verifySessionNotInUse(session) {
        if(this.#isSessionInUse(session))
            throw new EMSError("session in use", -1);
    }

    async register(admin, userDetails){
        await this.#verifySystemAdmin(admin);
        this.#verifyUserDetails(userDetails);
        userDetails.password = DEFAULT_PASSWORD;
        const dalUser = await this.#userRepo.addUser(userDetails);
        switch (dalUser.userType) {
            case types.TA:
                return new TA(dalUser);
            case types.LECTURER:
                return new Lecturer(dalUser);
            default:
                return new Admin(dalUser);
        }
    }

    async signIn(session, username, password) {
        await this.verifySessionNotInUse(session);
        let user;
        try {
            user = await this.getUser(username);
            user.verifyPassword(password);
        } catch (error) {
            if (error instanceof EMSError && (error.errorCode === ERROR_CODES.USERNAME_DOESNT_EXIST || error.errorCode === ERROR_CODES.INCORRECT_PASSWORD)) {
                throw new EMSError(ERROR_MSGS.FAILED_LOGIN, ERROR_CODES.FAILED_LOGIN);
            }
            throw error;
        }
        this.#sessionManager.set(session, user)
        this.#loggedUsers.set(user.getUsername(), session)
        return user;
    }

    logout(username) {
        this.verifyLoggedIn(username);
        this.#sessionManager.delete(this.#loggedUsers.get(username));
        this.#loggedUsers.delete(username);
    }

    async getUser(username) {
        const dalUser = await this.#userRepo.getUser(username);
        switch (dalUser.userType) {
            case USER_TYPES.LECTURER:
                return new Lecturer(dalUser);
            case USER_TYPES.TA:
                return new TA(dalUser);
            default:
                return new Admin(dalUser);
        }
    }

    async #verifySystemAdmin(admin) {
        this.verifyLoggedIn(admin.getUsername());
        (await this.getUser(admin.getUsername())).verifyType(types.ADMIN);
    }

    verifyLecturer(lecturer) {
        this.verifyLoggedIn(lecturer.getUsername());
        let username = this._logged_in_users.get(pid)
        let user = this.getUser(username)
        user.verifyType(types.LECTURER);
        return true;
    }

    setUserAsLecturer(lecturerUsername, course) {
        this.verifyUserRegistered(lecturerUsername)
        let user = this._registered_users.get(lecturerUsername);
        this._registered_users.set(lecturerUsername, new Lecturer(user, course));
        course.setUserAsLecturer(lecturerUsername);
    }

    setUserAsTA(TAUsername) {
        this.verifyUserRegistered(TAUsername)
        let user = this._registered_users.get(TAUsername);
        this._registered_users.set(TAUsername, new TA(user));
    }

    getLoggedInName(pid){
        this._varifyLogged(pid);
        return this._logged_in_users.get(pid);
    }

    getAllUsers(pid){
        this.verifySystemAdmin(pid)
        return [...this._registered_users.values()].filter(user => user.type !== types.ADMIN)
    }

    getAllStaff(pid){
        this.verifyLecturer(pid)
        let allUsers = [...this._registered_users.values()].filter(user => user.type !== types.ADMIN)
        let allTAs = allUsers.filter(user => user.type === types.TA)
        let allLecturers = allUsers.filter(user => user.type === types.LECTURER)
        return {"TAs": allTAs, "Lecturers": allLecturers}
    }

    deleteUser(pid, username){
        this.verifySystemAdmin(pid)
        if (this._registered_users.get(username).getUserType() === types.ADMIN){
            throw new Error("can't delete system admin")
        }
        this._registered_users.delete(username)
    }

    changePasswordAfterFirstSignIn(pid, username, password){
        this._varifyLogged(pid)
        let user = this.getUser(username)
        this._registered_users.get(username).changePasswordAfterFirstSignIn(password)
        return user
    }

    /**
     * Input verification on userDetails
     * @param userDetails details to verify
     * @throws Error
     */
    #verifyUserDetails(userDetails) {
        if (!userDetails) throw new EMSError(ERROR_MSGS.USER_DETAILS_NULL, ERROR_CODES.USER_DETAILS_NULL)
        if (!userDetails.username) throw new EMSError(ERROR_MSGS.USER_DETAILS_MISSING_USERNAME, ERROR_CODES.USER_DETAILS_MISSING_USERNAME)
        if (!userDetails.firstName) throw new EMSError(ERROR_MSGS.USER_DETAILS_MISSING_FNAME, ERROR_CODES.USER_DETAILS_MISSING_FNAME)
        if (!userDetails.lastName) throw new EMSError(ERROR_MSGS.USER_DETAILS_MISSING_LNAME, ERROR_CODES.USER_DETAILS_MISSING_LNAME)
        if (!userDetails.email) throw new EMSError(ERROR_MSGS.USER_DETAILS_MISSING_EMAIL, ERROR_CODES.USER_DETAILS_MISSING_EMAIL)
        if (!userDetails.userType) throw new EMSError(ERROR_MSGS.USER_DETAILS_MISSING_TYPE, ERROR_CODES.USER_DETAILS_MISSING_TYPE)
    }

    #registerPresentationUsers() {
        this._registered_users.set("Admin", new Admin("Admin", "Aa123456"));
        this._registered_users.set('lecturer', new Lecturer("lecturer", DEFAULT_PASSWORD));
        this._registered_users.set('TA',  new TA("TA", DEFAULT_PASSWORD));
        this._registered_users.set('TA1', new TA("TA1", DEFAULT_PASSWORD));
        this._registered_users.set('TA2', new TA("TA2", DEFAULT_PASSWORD));
        this._registered_users.set('TA3', new TA("TA3", DEFAULT_PASSWORD));
    }

    /**
     * Predicate on given session's relevancy.
     * @param session session to check
     * @note If a session is irrelevant the user pointing to it in loggedUsers should be removed.
     */
    #isSessionStale(session) {
        return !this.#sessionManager.has(session);
    }
}

module.exports = UserController;
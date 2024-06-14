const { User, DEFAULT_PASSWORD} = require('./User');
const Admin = require('./Admin');
const Lecturer = require('./Lecturer');
const TA = require('./TA');
const { USER_TYPES} = require("../../Enums");
const {EMSError, USER_PROCESS_ERROR_CODES: ERROR_CODES} = require("../../EMSError");
const { USER_PROCESS_ERROR_MSGS: ERROR_MSGS } = require("../../ErrorMessages");

class UserController {
    #userRepo;
    #sessionManager

    constructor(userRepo, sessionManager){
        this.#sessionManager = sessionManager;
        this.#userRepo = userRepo;
    }

    /**
     * Registers a new user to the system
     * @param session Admin Session
     * @param userDetails All details needed to register the new User.
     * @return Business instance of the newly registered user
     * @note The newly registered user is created with a default password.
     */
    async register(session, userDetails) {
        await this.verifyType(session, USER_TYPES.ADMIN);
        this.#verifyUserDetails(userDetails);
        userDetails.password = DEFAULT_PASSWORD;
        const dalUser = await this.#userRepo.addUser(userDetails);
        switch (dalUser.userType) {
            case USER_TYPES.TA:
                return new TA(dalUser);
            case USER_TYPES.LECTURER:
                return new Lecturer(dalUser);
            default:
                return new Admin(dalUser);
        }
    }

    /**
     * Logs in to a registered user
     * @param session Session that wants to log in to the given user.
     * @param username Username of the user.
     * @param password Password of the user.
     * @return business instance of the user logged into upon successful login.
     */
    async signIn(session, username, password) {
        this.#sessionManager.verifySessionNotInUse(session);
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
        this.#sessionManager.login(session, user)
        return user;
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

    /* TODO: talk about how to fix this
    setUserAsLecturer(lecturerUsername) {
        this.verifyUserRegistered(lecturerUsername)
        let user = this._registered_users.get(lecturerUsername);
        this._registered_users.set(lecturerUsername, new Lecturer(user.username, user.password));
    }

    setUserAsTA(TAUsername) {
        this.verifyUserRegistered(TAUsername)
        let user = this._registered_users.get(TAUsername);
        this._registered_users.set(TAUsername, new TA(user.username, user.password));
    }

    getLoggedInName(pid){
        this._varifyLogged(pid);
        return this._logged_in_users.get(pid);
    }
     */

    /**
     * Returns all users in the system.
     * @param session session requesting, must be an Admin.
     */
    async getAllUsers(session){
        await this.verifyType(session, USER_TYPES.ADMIN);
        const dalUsers =  await this.#userRepo.getAllUsers();
        return dalUsers
            .map(dalUser => {
            switch (dalUser.userType) {
                case USER_TYPES.LECTURER:
                    return new Lecturer(dalUser);
                case USER_TYPES.TA:
                    return new TA(dalUser);
                default:
                    return new Admin(dalUser);
            }
        });
    }

    /**
     * Returns the staff of the course (all users but Admins)
     * @param session Lecturer requesting the information
     * @return {Promise<{TAs: *, Lecturers: *}>}
     */
    async getAllStaff(session){
        await this.verifyType(session, USER_TYPES.LECTURER);
        const dalUsers =  await this.#userRepo.getAllUsers();
        let businessUsers = dalUsers
            .map(dalUser => {
                switch (dalUser.userType) {
                    case USER_TYPES.LECTURER:
                        return new Lecturer(dalUser);
                    case USER_TYPES.TA:
                        return new TA(dalUser);
                    default:
                        return new Admin(dalUser);
                }
            });
        let businessTAs = businessUsers.filter(user => user.getUserType() === USER_TYPES.TA)
        let businessLecturers = businessUsers.filter(user => user.getUserType() === USER_TYPES.LECTURER)
        return {"TAs": businessTAs, "Lecturers": businessLecturers};
    }

    async deleteUser(session, username){
        await this.verifyType(session, USER_TYPES.ADMIN);
        const daluser =  await this.#userRepo.getUser(username);
        if (daluser.userType === USER_TYPES.ADMIN){
            throw new EMSError("can't delete system admin");
        }
        this.#userRepo.deleteUser(username);
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

    /**
     * Verifies the session is logged into a given type of user.
     * @param session session to check.
     * @param type value of USER_TYPE to verify the session as an instance of
     * @throws EMSError if session is not logged into an Admin account.
     */
    async verifyType(session, type) {
        const user = this.#sessionManager.getUser(session);
        (await this.getUser(user.getUsername())).verifyType(type);
    }
}

module.exports = UserController;
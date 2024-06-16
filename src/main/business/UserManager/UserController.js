const { User, DEFAULT_PASSWORD} = require('./User');
const Admin = require('./Admin');
const Lecturer = require('./Lecturer');
const TA = require('./TA');
const { USER_TYPES} = require("../../Enums");
const {EMSError, USER_PROCESS_ERROR_CODES: ERROR_CODES} = require("../../EMSError");
const { USER_PROCESS_ERROR_MSGS: ERROR_MSGS } = require("../../ErrorMessages");

class UserController {
    #userRepo;

    constructor(userRepo){
        this.#userRepo = userRepo;
    }


    #verifyType(type, desiredType){
        if(type !== desiredType) throw new EMSError(ERROR_MSGS.INCORRECT_TYPE(type,desiredType), ERROR_CODES.INCORRECT_TYPE);
    }

    /**
     * Registers a new user to the system
     * @param userDetails All details needed to register the new User.
     * @return Business instance of the newly registered user
     * @note The newly registered user is created with a default password.
     */
    async register(userDetails) {
        this.#verifyUserDetails(userDetails);
        this.#verifyType(userDetails.callingUser.type, USER_TYPES.ADMIN)
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
     * @param username Username of the user.
     * @param password Password of the user.
     * @return business instance of the user logged into upon successful login.
     */
    async signIn(username, password) {
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

    /**
     * Returns all users in the system.
     */
    async getAllUsers(getAllUsersData){
        this.#verifyType(getAllUsersData.callingUser.type, USER_TYPES.ADMIN);
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
     * @return {Promise<{TAs: *, Lecturers: *}>}
     */
    async getAllStaff(data){
        this.#verifyType(data.callingUser.type, USER_TYPES.LECTURER);
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

    async updateUser(data){
        this.#verifyType(data.callingUser.type, USER_TYPES.ADMIN);
        if (!data.username) {
            throw new EMSError(ERROR_MSGS.USER_DETAILS_MISSING_USERNAME, ERROR_CODES.USER_DETAILS_MISSING_USERNAME);
        }
        const user = await this.getUser(data.username);
        const updateOperations = [];
        if (data.userType) {
            if (!Object.values(USER_TYPES).some(v => v === data.userType)){
                throw new EMSError(ERROR_MSGS.INVALID_TYPE(data.userType), ERROR_CODES.INVALID_TYPE);
            }
            if (user.getUserType() === USER_TYPES.ADMIN){
                throw new EMSError(ERROR_MSGS.CANNOT_CHANGE_ADMIN, ERROR_CODES.CANNOT_CHANGE_ADMIN);
            }
            updateOperations.push(user.setUserType(data.userType));
        }
        if (data.firstName) {
            updateOperations.push(user.setFirstName(data.firstName));
        }
        if (data.lastName) {
            updateOperations.push(user.setLastName(data.lastName));
        }
        if (data.email) {
            updateOperations.push(user.setEmail(data.email));
        }
        await Promise.all(updateOperations);
    }

    async updateStaff(data) {
        this.#verifyType(data.callingUser.type, USER_TYPES.LECTURER);
        if (!data.username) {
            throw new EMSError(ERROR_MSGS.USER_DETAILS_MISSING_USERNAME, ERROR_CODES.USER_DETAILS_MISSING_USERNAME);
        }
        const user = await this.getUser(data.username);
        if (user.getUserType() === USER_TYPES.ADMIN){
            throw new EMSError(ERROR_MSGS.CANNOT_CHANGE_ADMIN, ERROR_CODES.CANNOT_CHANGE_ADMIN);
        }
        const updateOperations = [];
        if (data.userType) {
            if (data.username === data.callingUser.username) {
                throw new EMSError(ERROR_MSGS.CANNOT_EDIT_OWN_TYPE, ERROR_CODES.CANNOT_EDIT_OWN_TYPE);
            }
            if (!Object.values(USER_TYPES).some(v => v === data.userType)){
                throw new EMSError(ERROR_MSGS.INVALID_TYPE(data.userType), ERROR_CODES.INVALID_TYPE);
            }
            updateOperations.push(user.setUserType(data.userType));
        }
        if (data.firstName) {
            updateOperations.push(user.setFirstName(data.firstName));
        }
        if (data.lastName) {
            updateOperations.push(user.setLastName(data.lastName));
        }
        if (data.email) {
            updateOperations.push(user.setEmail(data.email));
        }
        await Promise.all(updateOperations);
    }

    async deleteUser(data){
        this.#verifyType(data.callingUser.type, USER_TYPES.ADMIN);
        const user =  await this.getUser(data.username);
        if (user.getUserType() === USER_TYPES.ADMIN){
            throw new EMSError(ERROR_MSGS.CANNOT_DELETE_ADMIN, ERROR_CODES.CANNOT_DELETE_ADMIN);
        }
        await this.#userRepo.deleteUser(data.username);
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
}

module.exports = UserController;
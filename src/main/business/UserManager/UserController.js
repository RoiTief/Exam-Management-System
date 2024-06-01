const User = require('./User');
const Admin = require('./Admin');
const Lecturer = require('./Lecturer');
const TA = require('./TA');
const types = require('../../Enums').USER_TYPES
const DEFAULT_PASSWORD = "123"

class UserController {

    constructor(){
        this._registered_users = new Map();
        this._registered_users.set("Admin", new Admin("Admin", "Aa123456"));
        this._logged_in_users = new Map();
    }
    
    _isRegistered(username){
        return this._registered_users.has(username);
    }
    
    _isLoggedIn(pid){
        return this._logged_in_users.has(pid);
    }

    _varifyNotLoggedIn(pid){
        if (this._isLoggedIn(pid))
            throw new Error("you are already logged in");
    }

    _varifyLogged(pid){
        if(!this._isLoggedIn(pid))
            throw new Error("the user is not logged in");
    }

    getType(pid){
        this._varifyLogged(pid)
        let username = this._logged_in_users.get(pid)
        let user = this.getUser(username)
        return user.getUserType()
    }
    
    register(pid, username, type){
        this.verifySystemAdmin(pid);
        if (this._isRegistered(username)){
            throw new Error("this username is taken");
        }
        let user
        switch (type) {
            case types.TA:
                user = new TA(username, DEFAULT_PASSWORD)
                break
            case types.LECTURER:
                user = new Lecturer(username, DEFAULT_PASSWORD)
                break
            default:
                user = new Admin()
        }
        this._registered_users.set(username, user);
        return user;
    }

    signIn(pid, username, password) {
        this.verifyUserRegistered(username)
        let user = this.getUser(username)
        if(user.password !== password){
            throw new Error("incorrect password")
        }
        this._logged_in_users.set(pid, username)
        return user;
    }

    logout(pid) {
        this._varifyLogged(pid)
        this._logged_in_users.delete(pid);
    }
    
    getUser(username){
        return this._registered_users.get(username);
    }

    verifySystemAdmin(pid) {
        this._varifyLogged(pid)
        let username = this._logged_in_users.get(pid)
        this.getUser(username).verifyType(types.ADMIN);
    }

    verifyUserRegistered(username) {
        if (!this._isRegistered(username)){
            throw new Error("there is no user with this username " + username);
        }
    }

    verifyLecturer(pid) {
        this._varifyLogged(pid)
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
}

module.exports = UserController;
const User = require('./User');
const SystemAdmin = require('./SystemAdmin');
const CourseAdmin = require('./CourseAdmin');
const TA = require('./TA');
const Grader = require('./Grader');

class UserController {

    constructor(){
        this._registered_users = new Map();
        this._registered_users.set("Admin", new SystemAdmin("Admin", "Aa123456"));
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
    
    register(pid, username, password){
        this._varifyNotLoggedIn(pid);
        if (this._isRegistered(username)){
            throw new Error("this username is taken");
        }
        let user = new User(username, password)
        this._registered_users.set(username, user);
        return user;
    }

    signIn(pid, username, password) {
        this._varifyNotLoggedIn(pid)
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
        this.getUser(username).verifyType("SystemAdmin");
    }

    verifyUserRegistered(username) {
        if (!this._isRegistered(username)){
            throw new Error("there is no user with this username " + username);
        }
    }

    verifyCourseAdmin(pid) {
        this._varifyLogged(pid)
        let username = this._logged_in_users.get(pid)
        let user = this.getUser(username)
        user.verifyType("CourseAdmin");
        return user.course;
    }

    setUserAsCourseAdmin(courseAdminUsername, course) {
        this.verifyUserRegistered(courseAdminUsername)
        let user = this._registered_users.get(courseAdminUsername);
        this._registered_users.set(courseAdminUsername, new CourseAdmin(user, course));
        course.setUserAsCourseAdmin(courseAdminUsername);
    }

    setUserAsTA(TAUsername, course) {
        this.verifyUserRegistered(TAUsername)
        let user = this._registered_users.get(TAUsername);
        this._registered_users.set(TAUsername, new TA(user, course));
        course.setUserAsTA(TAUsername);
    }
    
    setUserAsGrader(graderUsername, course) {
        this.verifyUserRegistered(graderUsername)
        let user = this._registered_users.get(graderUsername);
        this._registered_users.set(graderUsername, new Grader(user, course));
        course.setUserAsGrader(graderUsername);
    }


    getLoggedInName(pid){
        this._varifyLogged(pid);
        return this._logged_in_users.get(pid);
    }

    getAllUsers(pid){
        this.verifySystemAdmin(pid)
        return this._registered_users.values()
    }
}

module.exports = UserController;
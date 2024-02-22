var SystemAdmin = require('./SystemAdmin')
var User = require('./User')

class UserController {

    constructor(){
        this._users = new Map();
        this._users.set("Admin", new SystemAdmin("Admin", "Aa123456"));
    }
    
    _isRegistered(username){
        return this._users.has(username);
    }
    
    register(username, password){
        if (this._isRegistered(username)){
            throw new Error("this username is taken");
        }
        let user = new User(username, password)
        this._users.set(username, user);
        // this._saveUsers()
        return user;
    }

    signIn(username, password) {
        this.verifyUser(username)
        let user = this.getUser(username)
        if(!user.password === password){
            throw new Error("incorrect password")
        }
        return user;
    }

    _saveUsers(){
        //save to session storage
        let usersArray = Array.from(this._users)
        sessionStorage.setItem('users', JSON.stringify(usersArray))

    }
    
    getUser(username){
        return this._users.get(username);
    }

    verifySystemAdmin(username) {
        this.verifyUser(username)
        this.getUser(username).verifyType("SystemAdmin");
    }

    verifyUser(username) {
        if (!this._isRegistered(username)){
            throw new Error("there is no user with this username " + username);
        }
    }

    verifyCourseAdmin(username) {
        this.verifyUser(username)
        let user = this.getUser(username)
        user.verifyType("CourseAdmin");
        return user.course;
    }

    setUserAsCourseAdmin(courseAdminUsername, course) {
        this.verifyUser(courseAdminUsername)
        let user = this._users.get(courseAdminUsername);
        this._users.set(courseAdminUsername, new CourseAdmin(user, course));
        course.setUserAsCourseAdmin(courseAdminUsername);
        // this._saveUsers();
    }

    setUserAsTA(TAUsername, course) {
        this.verifyUser(TAUsername)
        let user = this._users.get(TAUsername);
        this._users.set(TAUsername, new TA(user, course));
        // this._saveUsers();
    }
}

module.exports = UserController;
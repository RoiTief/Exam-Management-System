

class UserController {

    
    constructor(){
        let users = JSON.parse(sessionStorage.getItem('users'));
        this._users = new Map(users);
        if (!this._users.has("Admin")){
            this._users.set("Admin", new SystemAdmin("Admin", "Aa123456"));
        }
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
        this._saveUsers()
        return user;
    }

    signIn(username, password) {
        if (!this._isRegistered(username)){
            throw new Error("there is no user with this username");
        }
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
        if (!this._isRegistered(username)){
            throw new Error("there is no user with this username");
        }
        this.getUser(username).verifyType("SystemAdmin");
    }


    setUserAsCourseAdmin(courseAdminUsername, courseID) {
        if (!this._isRegistered(courseAdminUsername)){
            throw new Error("there is no user with this username");
        }
        let user = this._users.get(courseAdminUsername);
        this._users.set(courseAdminUsername, new CourseAdmin(user, courseID));
        this._saveUsers();
    }
}



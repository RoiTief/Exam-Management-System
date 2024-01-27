

class UserController {

    
    constructor(){
        let users = JSON.parse(sessionStorage.getItem('users'))
        this._users = new Map(users);
    }
    
    isRegistered(username){
        return this._users.has(username);
    }
    
    register(username, password){
        if (this.isRegistered(username)){
            console.log("false")
            return false;
        }
        this._users.set(username, new User(username, password));
        console.log("true")
        this._saveUsers()
        return true;
    }

    _saveUsers(){
        //save to session storage
        let usersArray = Array.from(this._users)
        sessionStorage.setItem('users', JSON.stringify(usersArray))

    }
    
    getUser(username){
        return this._users.get(username);
    }
    
}



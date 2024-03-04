
class User {

    constructor(username, password) {
        this.username = username;
        this.password = password;
        this.course = null
    }
    
    getUserType(){
        return "User"
    }
}


module.exports = User;


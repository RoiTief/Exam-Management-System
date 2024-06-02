
class User {

    constructor(username, password) {
        this.username = username;
        this.password = password;
        this.firstSignIn = true;
    }
    
    getUserType(){
        return null
    }

    verifyType(type){
        return null
    }

    changePasswordAfterFirstSignIn(password){
        this.password = password
        this.firstSignIn = false
    }
}


module.exports = User;


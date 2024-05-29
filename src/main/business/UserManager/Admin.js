var User = require('./User')
const types = require('../../Enums').USER_TYPES

class Admin extends User{

    constructor(username, password) {
        super(username, password);
        this.type = types.ADMIN
        this.firstSignIn = false;
    }

    getUserType(){
        return types.ADMIN
    }

    verifyType(type){
        if(type !== this.type){
            throw Error("the user is a Admin and doesnt have the sufficient permissions");
        }
    }

}

module.exports = Admin;

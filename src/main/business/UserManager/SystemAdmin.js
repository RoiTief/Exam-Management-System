var User = require('./User')
const types = require('../../Enums').USER_TYPES

class SystemAdmin extends User{

    constructor(username, password) {
        super(username, password);
        this.type = types.ADMIN
    }

    getUserType(){
        return "System Admin"
    }

    verifyType(type){
        if(type !== "SystemAdmin"){
            throw Error("the user is a SystemAdmin and doesnt have the sufficient permissions");
        }
    }

}

module.exports = SystemAdmin;

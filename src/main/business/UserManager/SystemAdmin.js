var User = require('./User')

class SystemAdmin extends User{

    constructor(username, password) {
        super(username, password);
    }

    verifyType(type){
        if(type !== "SystemAdmin"){
            throw Error("the user is a SystemAdmin and doesnt have the sufficient permissions");
        }
    }

}

module.exports = SystemAdmin;

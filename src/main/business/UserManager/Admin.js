const { User } = require('./User');
const types = require('../../Enums').USER_TYPES

class Admin extends User{

    constructor(dalAdmin) {
        super(dalAdmin);
    }

    verifyType(type){
        if(type !== types.ADMIN){
            throw Error("the user is a Admin and doesnt have the sufficient permissions");
        }
    }

}

module.exports = Admin;

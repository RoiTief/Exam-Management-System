const { User } = require('./User')
const types = require('../../Enums').USER_TYPES

class TA extends User{

    constructor(dalTA) {
        super(dalTA);
    }

    verifyType(type){
        if(type !== type.TA){
            throw Error("the user is a TA and doesnt have the sufficient permissions");
        }
    }

}

module.exports = TA;

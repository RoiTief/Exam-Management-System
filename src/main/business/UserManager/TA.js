var User = require('./User')
const types = require('../../Enums').USER_TYPES

class TA extends User{

    constructor(username, password) {
        super(username, password);
        this.type = types.TA
    }

    getUserType(){
        return types.TA
    }

    verifyType(type){
        if(type !== this.type){
            throw Error("the user is a TA and doesnt have the sufficient permissions");
        }
    }

}

module.exports = TA;

var User = require('./User')
const types = require('../../Enums').USER_TYPES

class TA extends User{

    constructor(user, course) {
        super(user.username, user.password);
        this.course = course
        this.type = types.TA
    }

    getUserType(){
        return "TA"
    }

    verifyType(type){
        if(type !== "TA"){
            throw Error("the user is a TA and doesnt have the sufficient permissions");
        }
    }

}

module.exports = TA;

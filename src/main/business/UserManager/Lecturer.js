var User = require('./User')
const types = require('../../Enums').USER_TYPES

class Lecturer extends User{

    constructor(username, password) {
        super(username, password);
        this.type = types.LECTURER
    }
    
    getUserType(){
        return types.LECTURER
    }

    verifyType(type){
        if(type !== this.type){
            throw Error("the user is a Lecturer and doesnt have the sufficient permissions");
        }
    }

}

module.exports = Lecturer;

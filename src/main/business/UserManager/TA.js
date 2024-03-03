var User = require('./User')

class TA extends User{

    constructor(user, course) {
        super(user.username, user.password);
        this.course = course
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

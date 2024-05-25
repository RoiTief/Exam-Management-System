var User = require('./User')
const types = require('../../Enums').USER_TYPES

class CourseAdmin extends User{

    constructor(user, course) {
        super(user.username, user.password);
        this.course = course
        this.type = types.LECTURER
    }
    
    getUserType(){
        return "Course Admin"
    }

    verifyType(type){
        if(type !== "CourseAdmin"){
            throw Error("the user is a CourseAdmin and doesnt have the sufficient permissions");
        }
    }

}

module.exports = CourseAdmin;

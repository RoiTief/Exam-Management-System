var User = require('./User')

class CourseAdmin extends User{

    constructor(user, course) {
        super(user.username, user.password);
        this.course = course
    }

    verifyType(type){
        if(type !== "CourseAdmin"){
            throw Error("the user is a CourseAdmin and doesnt have the sufficient permissions");
        }
    }

}

module.exports = CourseAdmin;

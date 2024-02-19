class CourseAdmin extends User{

    constructor(user, courseId) {
        super(user);
        this.courseId = courseId
    }

    verifyType(type){
        if(type !== "CourseAdmin"){
            throw Error("the user is a CourseAdmin and doesnt have the sufficient permissions");
        }
    }

}
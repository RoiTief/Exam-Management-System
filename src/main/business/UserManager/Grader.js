class Grader extends User{

    constructor(user, course) {
        super(user.username, user.password);
        this.course = course
    }

    verifyType(type){
        if(type !== "Grader"){
            throw Error("the user is a Grader and doesnt have the sufficient permissions");
        }
    }

}
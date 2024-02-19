class Grader extends User{

    constructor() {
        super();
    }

    verifyType(type){
        if(type !== "Grader"){
            throw Error("the user is a Grader and doesnt have the sufficient permissions");
        }
    }

}
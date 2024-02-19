class TA extends User{

    constructor() {
        super();
    }

    verifyType(type){
        if(type !== "TA"){
            throw Error("the user is a TA and doesnt have the sufficient permissions");
        }
    }

}
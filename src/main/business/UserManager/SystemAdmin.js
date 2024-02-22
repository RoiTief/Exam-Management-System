class SystemAdmin extends User{

    constructor() {
        super();
    }

    verifyType(type){
        if(type !== "SystemAdmin"){
            throw Error("the user is a SystemAdmin and doesnt have the sufficient permissions");
        }
    }

}
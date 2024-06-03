const { User }= require('./User');
const types = require('../../Enums').USER_TYPES

class Lecturer extends User{

    constructor(dalLecturer) {
        super(dalLecturer);
    }

    verifyType(type){
        if(type !== types.LECTURER){
            throw Error("the user is a Lecturer and doesnt have the sufficient permissions");
        }
    }

}

module.exports = Lecturer;

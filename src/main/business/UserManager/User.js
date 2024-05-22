
class User {

    constructor(username, password) {
        this.username = username;
        this.password = password;
        this.course = null
    }
    
    getUserType(){
        return "User"
    }

    setCourseID(courseID){
        this.course = courseID
    }

    getCourseID(){
        return this.course
    }
}


module.exports = User;


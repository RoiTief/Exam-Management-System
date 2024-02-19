
class User {

    constructor(username, password) {
        this.username = username;
        this.password = password;
        this.courseId = null
    }

    constructor(user) {
        this.username = user.username;
        this.password = user.password;
        this.courseId = user.courseId;
    }
    
}


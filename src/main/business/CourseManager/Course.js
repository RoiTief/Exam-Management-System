class Course{

    constructor(courseID, courseName) {
        this.properties = {
            "courseId": courseID,
            "courseName": courseName
        };
        this.personal = {
            "CourseAdmins" : [],
            "TAs" : [],
            "Graders" : []
        }
        this.Metaquestions = [];
        this.pastExams = [];
    }

    setUserAsCourseAdmin(username){
        this.personal.CourseAdmins.add(username)
    }

    setUserAsTA(username){
        this.personal.TAs.add(username)
    }

    setUserAsGrader(username){
        this.personal.Graders.add(username)
    }
}
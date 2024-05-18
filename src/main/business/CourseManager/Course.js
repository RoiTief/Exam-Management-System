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
        this.personal.CourseAdmins.push(username)
    }

    setUserAsTA(username){
        this.personal.TAs.push(username)
    }

    setUserAsGrader(username){
        this.personal.Graders.push(username)
    }

    addSimpleMetaQuestion(stem, correctAnswers, distractors, appendix = null){
        this.Metaquestions.push(new MetaQuestion(stem, correctAnswers, distractors, appendix))
    }
}

module.exports = Course;

var Course = require('./Course')

class CourseController{

    constructor(){
        this._courses = new Map();
    }

    createCourse(courseID, courseName) {
        if(this._courses.has(courseID)){
            throw Error("there already exist a course with this ID")
        }
        let course = new Course(courseID, courseName);
        this._courses.set(courseID, course);
        // this._saveCourses()
        return course;
    }

    _saveCourses(){
        //save to session storage
        let courseArray = Array.from(this._courses)
        sessionStorage.setItem('courses', JSON.stringify(courseArray))
    }

    getCourse(courseID){
        if(!this._courses.has(courseID)){
            throw Error("No course found")
        }
        return this._courses.get(courseID);
    }
}

module.exports = CourseController;


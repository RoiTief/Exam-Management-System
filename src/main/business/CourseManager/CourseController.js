class CourseController{

    constructor(){
        let courses = JSON.parse(sessionStorage.getItem('courses'));
        this._courses = new Map(courses);
    }

    createCourse(courseID, courseName) {
        if(this._courses.has(courseID)){
            throw Error("there already exist a course with this ID")
        }
        let course = new Course(courseID, courseName);
        this._courses.set(courseID, course);
        this._saveCourses()
        return course;
    }

    _saveCourses(){
        //save to session storage
        let courseArray = Array.from(this._courses)
        sessionStorage.setItem('courses', JSON.stringify(courseArray))
    }
}
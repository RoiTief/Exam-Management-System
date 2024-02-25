const ApplicationFacade = require("./business/applicationFacade");
const application = new ApplicationFacade();
const error = require('./error')


/**
 * register a user
 * @param req.username - the new user username - needs to be unique
 * @param req.password - the new user password
 * @returns {User} - returns the created user
 * @returns Error - if the username is taken
 */
function signUp(req, res, next) {
    try{
        user = application.register(req.body.username, req.body.password);
        req.log.info(req.body.username, 'new user registered');
        res.send(200, user)
        next()
    }
    catch(err){
        req.log.warn(err.message, 'unable to register user');
        next(err);
    }
}

/**
 * signs in user
 * @param req.username - the user username - need to be registered
 * @param req.password - the user password
 * @returns {User} - returned the signed-in user
 * @returns {Error} - if there is no registered user with this username
 *                 - if the password is incorrect
 */
function signIn(req, res, next) {
    try{
        user = application.signIn(req.body.username, req.body.password);
        req.log.info(req.body.username, 'user signed in');
        res.send(200, user)
        next()
    }
    catch(err){
        req.log.warn(err.message, 'user unable to signIn');
        next(err);
    }
}

/**
 * creates new course
 * create a task for the new courseAdmin to accept being a courseAdmin
 * @param username - the user who tries to create the new course - needs to be a systemAdmin
 * @param courseID - the new courseID - need to be unique
 * @param courseName - the new course name
 * @param courseAdminUsername - the new course admin
 * @return {Course} the new course created
 * @throws {Error} - if there is no user with name @username
 *                 - if the user named username is not a systemAdmin
 *                 - if there is no user named courseAdminUsername
 *                 - if there is already a course with this ID
 */
function addCourse(req, res, next) {
    try{
        course = application.addCourse(req.params.name, req.body.courseId, req.body.courseName,
            req.body.courseAdminUsername);
        req.log.info(course.courseName, "course is created, and a request to admin this course was sent");
        res.send(200, course)
        next()
    }
    catch(err){
        req.log.warn(err.message, 'unable to create course');
        next(err);
    }
}




module.exports = {
    signUp: signUp,
    signIn: signIn, 
    addCourse: addCourse
};

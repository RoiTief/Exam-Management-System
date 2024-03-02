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
        user = application.register(process.pid, req.body.username, req.body.password);
        req.log.info(req.body.username, 'new user registered');
        res.send(200, {code:200,user})
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
        user = application.signIn(process.pid, req.body.username, req.body.password);
        req.log.info(req.body.username, 'user signed in');
        res.send(200, {code:200,user})
        next()
    }
    catch(err){
        req.log.warn(err.message, 'user unable to signIn');
        next(err);
    }
}

/**
 * user wants to log out
 * @throws {Error} - if the user is not signed in
 */
function logout(req, res, next) {
    try{
        application.logout(process.pid);
        req.log.info("user logged out");
        res.send(200);
        next()
    }
    catch(err){
        req.log.warn(err.message, 'unable to log out');
        next(err);
    }
}

/**
 * creates new course
 * create a task for the new courseAdmin to accept being a courseAdmin
 * @param courseId - the new courseID - need to be unique
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
        course = application.addCourse(process.pid, req.body.courseId, req.body.courseName,
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

/**
 * view a course
 * @return {Course} the course
 * @throws {Error} - if there is no logged in user in @pid
 *                 - if the user logged in user in @pid is not a courseAdmin
 */
function viewMyCourse(req, res, next){
    try{
        let course = application.viewMyCourse(process.pid);
        req.log.info("course admin viewd his course");
        res.send(200, course)
        next()
    }
    catch(err){
        req.log.warn(err.message, 'unable to view course');
        next(err);
    }
}

/**
 * view my tasks
 * @return {[Task]}
 * @throws {Error} - if there is no user logged in pid
 */
function viewMyTasks(req, res, next){
    try{
        let tasks = application.viewMyTasks(process.pid);
        req.log.info("user viewd his tasks");
        res.send(200, tasks)
        next()
    }
    catch(err){
        req.log.warn(err.message, 'unable to view user tasks');
        next(err);
    }
}

/**
 * tag task as finished with a response
 * @param taskId - the taskid
 * @param response - the response to the task
 * @return {Course} the new course created
* @throws {Error} - if there is no task with this id
*                 - if task with this ID is not assigned to the username
*                 - if this task is already finished
 */
function finishATask(req, res, next) {
    try{
        application.finishATask(process.pid, req.body.taskId, req.body.response);
        req.log.info(req.body.taskId, "task is marked as finished");
        res.send(200)
        next()
    }
    catch(err){
        req.log.warn(err.message, 'unable to marked a task as finished');
        next(err);
    }
}

/**
 * create a task for the new TA to accept being a TA of this course
 * @param TAUsername - the new TA username
 * @throws {Error} - if there is no user with name @username
 *                 - if the user named username is not a courseAdminUsername (is not assigned to a course)
 *                 - if there is no user named TAUsername
 */
function addTA(req, res, next){
    try{
        application.addTA(process.pid, req.body.TAUsername);
        req.log.info(req.body.TAUsername, "a request was sent to user to become a TA");
        res.send(200)
        next()
    }
    catch(err){
        req.log.warn(err.message, 'unable to request a user to become a TA');
        next(err);
    }
}

/**
 * create a task for the new grader to accept being a grader of this course
 * @param graderUsername
 * @throws {Error} - if there is no user with name @username
 *                 - if the user named username is not a courseAdminUsername or is not assigned to a course
 *                 - if there is no user named graderUsername
 */
function addGrader(req, res, next){
    try{
        application.addGrader(process.pid, req.body.graderUsername);
        req.log.info(req.body.TAUsername, "a request was sent to user to become a TA");
        res.send(200)
        next()
    }
    catch(err){
        req.log.warn(err.message, 'unable to request a user to become a TA');
        next(err);
    }
}




module.exports = {
    signUp: signUp,
    signIn: signIn, 
    logout: logout,
    addCourse: addCourse,
    viewMyCourse: viewMyCourse,
    viewMyTasks: viewMyTasks,
    finishATask: finishATask,
    addTA: addTA,
    addGrader: addGrader
};

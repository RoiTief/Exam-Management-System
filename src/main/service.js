const ApplicationFacade = require("./business/applicationFacade");
const application = new ApplicationFacade();
const error = require('./error')
const jwt = require('jsonwebtoken');
require('dotenv').config();


/**
 * get the username of the logged in user
 * @returns {string} - returns the username
 * @returns Error - if the prosses is not logged in to a user
 */
function viewUsername(req, res, next) {
    try{
        let username = application.getUsername(process.pid);
        req.log.info("username request");
        res.send(200, {code:200,username})
        next()
    }
    catch(err){
        req.log.warn(err.message, 'unable to retrieve username');
        next(err);
    }
}

/**
 * get the username type- "User", "TA", "Course Admin", "Grader", "System Admin"
 * @returns {string} - returns the type
 * @returns Error - if the prosses is not logged in to a user
 */
function viewUserType(req, res, next) {
    try{
        let userType = application.getUserType(process.pid);
        req.log.info("user type request");
        res.send(200, {code:200,userType})
        next()
    }
    catch(err){
        req.log.warn(err.message, 'unable to retrieve user type');
        next(err);
    }
}




/**
 * register a user
 * @param req.username - the new user username - needs to be unique
 * @param req.password - the new user password
 * @returns {User} - returns the created user
 * @returns Error - if the username is taken
 */
function signUp(req, res, next) {
    try{
        user = application.register(process.pid, req.body, "password1!");
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
        let token = jwt.sign({username: req.body.username}, process.env.SECRET_KEY, {
            expiresIn: "1h" // token expires in 15 minutes
        });
        req.log.info(req.body.username, 'user signed in');
        res.send(200, {code:200,user,token})
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
        res.send(200, {code:200});
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
        res.send(200, {code:200,course})
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
        res.send(200, {code:200, course})
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
        res.send(200, {code:200,tasks})
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
        res.send(200, {code:200})
        next()
    }
    catch(err){
        req.log.warn(err.message, 'unable to marked a task as finished');
        next(err);
    }
}

/**
 * create a task for the new TA to accept being a TA of this course
 * @param username - the new TA username
 * @throws {Error} - if there is no user with name @username
 *                 - if the user named username is not a courseAdminUsername (is not assigned to a course)
 *                 - if there is no user named TAUsername
 */
function addTA(req, res, next){
    try{
        application.addTA(process.pid, req.body.username);
        req.log.info(req.body.username, "a request was sent to user to become a TA");
        res.send(200, {code:200})
        next()
    }
    catch(err){
        req.log.warn(err.message, 'unable to request a user to become a TA');
        next(err);
    }
}

/**
 * create a task for the new grader to accept being a grader of this course
 * @param username
 * @throws {Error} - if there is no user with name @username
 *                 - if the user named username is not a courseAdminUsername or is not assigned to a course
 *                 - if there is no user named graderUsername
 */
function addGrader(req, res, next){
    try{
        application.addGrader(process.pid, req.body.username);
        req.log.info(req.body.username, "a request was sent to user to become a TA");
        res.send(200, {code:200})
        next()
    }
    catch(err){
        req.log.warn(err.message, 'unable to request a user to become a grader');
        next(err);
    }
}


/**
 * get all users for admin
 * @throws {Error} - if fail to get all users
 */
function viewAllUsers(req, res, next){
    try{
        const users = application.viewAllUsers(process.pid);
        req.log.info("a request was sent to get all users");
        res.send(200, {code:200, users})
        next()
    }
    catch(err){
        req.log.warn(err.message, 'unable to request to get all users');
        next(err);
    }
}

/**
 * deleting a user from the system
 * @param username
 * @throws {Error} - if fail to delete user
 */
function deleteUser(req, res, next){
    try{
        application.deleteUser(process.pid, req.body);
        req.log.info("a request was sent to delete a user");
        res.send(200, {code:200})
        next()
    }
    catch(err){
        req.log.warn(err.message, 'unable to request to delete a user');
        next(err);
    }
}

/**
 * return a list of meta question of the user's course
 * @throws {Error} - if fail to fetch
 */
function getAllMetaQuestions(req, res, next){
    try{
        let metaQuestions = application.getAllMetaQuestions(process.pid);
        req.log.info("a request was sent fetch all the meta questions");
        res.send(200, {code:200, metaQuestions})
        next()
    }
    catch(err){
        req.log.warn(err.message, 'unable to request to delete a user');
        next(err);
    }
}






module.exports = {
    viewUsername: viewUsername,
    viewUserType: viewUserType,
    signUp: signUp,
    signIn: signIn, 
    logout: logout,
    addCourse: addCourse,
    viewMyCourse: viewMyCourse,
    viewMyTasks: viewMyTasks,
    finishATask: finishATask,
    addTA: addTA,
    addGrader: addGrader,
    viewAllUsers: viewAllUsers,
    deleteUser: deleteUser,
    getAllMetaQuestions: getAllMetaQuestions
};

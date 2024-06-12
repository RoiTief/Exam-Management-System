const ApplicationFacade = require("./business/applicationFacade");
const application = new ApplicationFacade();
const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * register a user
 * @param req.username - the new user username - needs to be unique
 * @param req.password - the new user password
 * @returns {User} - returns the created user
 * @returns Error - if the username is taken
 */
function signUp(req, res, next) {
    application.register(process.pid, req.body.userDetails).then(
        businessUser => {
            req.log.info(req.body.username, 'new user registered');
            res.send(200, {code: 200, user: businessUser}); // probably return a JS object and not the user
            next();
        },
        err => {
            req.log.warn(err.message, 'unable to register user');
            next(err);
        }
    )
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
    application.signIn(process.pid, req.body.username, req.body.password).then(
        businessUser => {
            // send needed information derived from business
            const user = {
                username: businessUser.getUsername(),
                firstSignIn: businessUser.isFirstSignIn(),
                type: businessUser.getUserType()
            };
            const token = jwt.sign({username: req.body.username}, process.env.SECRET_KEY, {
                expiresIn: "1h" // token expires in 15 minutes
            });
            req.log.info(req.body.username, 'user signed in');
            res.send(200, {code: 200, user, token})
            next()
        },
        err => {
            req.log.warn(err.message, 'user unable to signIn');
            next(err);
        });
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
 * change user pas/sword after first sign in
 * @param req.username - the user's username
 * @param req.newPassword - the user new password
 * @returns {User} - returned the signed-in user
 * @returns {Error} - if there is no registered user with this username
 *                 - if the password is incorrect
 */
function changePassword(req, res, next) {
    application.changePassword(process.pid, req.body.newPassword).then(
        businessUser => {
            let token = jwt.sign({username: req.body.username}, process.env.SECRET_KEY, {
                expiresIn: "1h" // token expires in 15 minutes
            });
            req.log.info(req.body.username, 'user signed in');
            res.send(200, {
                code: 200, user: {
                    username: businessUser.getUsername(),
                    firstSignIn: businessUser.isFirstSignIn(),
                    type: businessUser.getUserType()
                },
                token
            })
            next();
        },
        err => {
            req.log.warn(err.message, 'user unable to signIn');
            next(err);
        });
}

/**
 * view a course
 * @return {{TAs: any[], Lecturers: any[]}} the course staff
 * @throws {Error} - if there is no logged in user in @pid
 *                 - if the user logged in user in @pid is not a lecturer
 */
function getAllStaff(req, res, next) {
    application.getAllStaff(process.pid).then(
        staff => {
            req.log.info("course lecturer viewed his staff")
            res.send(200, {code: 200, staff});
            next();
        },
        err => {
            req.log.warn(err.message, 'unable to view staff');
            next(err);
        }
    );
}

/**
 * view my tasks
 * @return {[Task]}
 * @throws {Error} - if there is no user logged in pid
 */
function viewMyTasks(req, res, next){
    try{
        let tasks = application.viewMyTasks(process.pid);
        req.log.info("user viewed his tasks");
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
 *                 - if the user named username is not a lecturerUsername (is not assigned to a course)
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
 *                 - if the user named username is not a lecturerUsername or is not assigned to a course
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
    application.viewAllUsers(process.pid).then(
        users => {
            req.log.info("a request was sent to get all users");
            res.send(200, {code:200, users})
            next()
        },
        err => {
            req.log.warn(err.message, 'unable to request to get all users');
            next(err);
        }
    );
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

/**
 * return a list of meta question of the user's course
 * @throws {Error} - if fail to fetch
 */
function getAllAppendices(req, res, next){
    try{
        let appendices = application.getAllAppendices(process.pid);
        req.log.info("a request was sent fetch all the appendices");
        res.send(200, {code:200, appendices})
        next()
    }
    catch(err){
        req.log.warn(err.message, 'unable to request to delete a user');
        next(err);
    }
}

/**
 * add a meta question to the db
 * @param - req.body = {
 *     //       keywords: str[],
 *     //       stem: str,
 *     //       keys: [{
 *     //         answer: str,
 *     //         explanation: str
 *     //         }],
 *     //       distractors: [{
 *     //         distractor: str,
 *     //         explanation: str
 *     //       }],
 *     //      appendix: {
 *     //          title: str,
 *     //          tag: str,
 *     //          content: str
 *     //       }
 *     //     }
 *     //
 *     appendix could be null
 * @throws {Error} - if fail to create
 */
function addMetaQuestion(req, res, next){
    try{
        let metaQuestion = application.addMetaQuestion(process.pid, req.body)
        req.log.info("request to create metaQuestion");
        res.send(200, {code:200, metaQuestion})
        next()
    }
    catch(err){
        req.log.warn(err.message, 'failed to create meta questions');
        next(err);
    }
}


/**
 * creates an Exam
 * @param - req.body = [{
 *     //       stem: str,
 *     //       answer: str,
 *     //       distractors: [str],
 *     //      appendix: {
 *     //          title: str,
 *     //          tag: str,
 *     //          content: str
 *     //       }
 *     //     }]
 *     //
 *     appendix could be null
 * @throws {Error} - if fail to create
 */
function createExam(req, res, next){
    try{
        req.log.info("request to create Exam");
        req.body = {...req.body, pid:process.pid}
        const exam = application.createExam(req.body)
        res.send(200, {code:200,exam})
        next()
    }
    catch(err){
        req.log.warn(err.message, 'failed to create meta questions');
        next(err);
    }
}

function getAllExams(req, res, next){
    try{
        req.log.info("request to get all exams");
        req.body = {...req.body, pid:process.pid}
        const exams = application.getAllExams(req.body)
        res.send(200, {code:200,exams})
        next()
    }
    catch(err){
        req.log.warn(err.message, 'failed to get all exams');
        next(err);
    }
}

function editUser(req, res, next) {
    try{
        user = application.editUser(process.pid, req.body[0], req.body[1]);
        req.log.info(req.body.username, 'edit user request');
        res.send(200, {code:200,user})
        next()
    }
    catch(err){
        req.log.warn(err.message, 'unable to edit user');
        next(err);
    }
}

module.exports = {
    signUp: signUp,
    signIn: signIn, 
    logout: logout,
    changePassword: changePassword,
    getAllStaff: getAllStaff,
    viewMyTasks: viewMyTasks,
    finishATask: finishATask,
    addTA: addTA,
    addGrader: addGrader,
    viewAllUsers: viewAllUsers,
    deleteUser: deleteUser,
    getAllMetaQuestions: getAllMetaQuestions,
    getAllAppendices: getAllAppendices,
    addMetaQuestion: addMetaQuestion,
    createExam,
    getAllExams,
    editUser: editUser
};

const ApplicationFacade = require("./business/applicationFacade");
const application = new ApplicationFacade();
const jwt = require('jsonwebtoken');
require('dotenv').config();


function generateJWT(data) {
    return jwt.sign(data, process.env.SECRET_KEY, {
        expiresIn: 60 * 15 // token expires in 15 minutes
    });
}

/**
 * register a user
 * @param req.username - the new user username - needs to be unique
 * @param req.password - the new user password
 * @returns {User} - returns the created user
 * @returns Error - if the username is taken
 */
function signUp(req, res, next) {
    application.register(req.body).then(
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
    application.signIn(req.body).then(
        businessUser => {
            // send needed information derived from business
            const user = {
                username: businessUser.getUsername(),
                firstName: businessUser.getFirstName(),
                lastName: businessUser.getLastName(),
                email: businessUser.getEmail(),
                firstSignIn: businessUser.isFirstSignIn(),
                type: businessUser.getUserType()
            };
            const token = generateJWT({username: req.body.username, type:user.type});
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
        application.logout(req.body);
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
    application.changePassword(req.body).then(
        businessUser => {
            let token = generateJWT({username: req.body.username, type: businessUser.getUserType()});
            req.log.info(req.body.username, 'user signed in');
            res.send(200, {
                code: 200, user: {
                    username: businessUser.getUsername(),
                    firstName: businessUser.getFirstName(),
                    lastName: businessUser.getLastName(),
                    email: businessUser.getEmail(),
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
 * reset user password
 * @param req.username - the user's username
 * @returns {Error} - if there is no registered user with this username
 */
function resetPassword(req, res, next) {
    application.resetPassword(req.body).then(
        result => {
            req.log.info(req.body.username, 'reset user password');
            res.send(200, {code: 200})
            next();
        },
        err => {
            req.log.warn(err.message, 'unable to reset password');
            next(err);
        });
}

/**
 * view a course
 * @return {{TAs: any[], Lecturers: any[]}} the course staff
 * @throws {Error} - if there is no user is not a lecturer
 */
function getAllStaff(req, res, next) {
    application.getAllStaff(req.body).then(
        businessStaff => {
            const TAs = businessStaff["TAs"].map(u => ({
                username: u.getUsername(),
                firstName: u.getFirstName(),
                lastName: u.getLastName(),
                email: u.getEmail(),
                type: u.getUserType(),
            }));
            const lecturers = businessStaff["Lecturers"].map(u => ({
                username: u.getUsername(),
                firstName: u.getFirstName(),
                lastName: u.getLastName(),
                email: u.getEmail(),
                type: u.getUserType(),
            }));
            const staff = {"TAs": TAs, "Lecturers": lecturers};
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
 */
function viewMyTasks(req, res, next){
    try{
        application.viewMyTasks(req.body).then((tasks) => {
            req.log.info("user viewed his tasks");
            res.send(200, {code:200,tasks})
            next()
        });
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
        application.finishATask(req.body).then(()=>{
            req.log.info(req.body.taskId, "task is marked as finished")
            res.send(200, {code:200})
            next()
        },(err)=>{
            req.log.warn(err.message, 'unable to marked a task as finished');
            next(err);
        }
    )
}

/**
 * create a new TA from a lecturer
 * @param username - the new TA username
 * @throws {Error} - if there is no user with name @username
 *                 - if the user named username is not a lecturerUsername (is not assigned to a course)
 *                 - if there is no user named TAUsername
 */
function addTA(req, res, next) {
    application.addTA(req.body).then(
        result => {
            req.log.info(req.body.username, "a request was sent to user to become a TA");
            res.send(200, {code: 200});
            next();
        },
        err => {
            req.log.warn(err.message, 'unable to request a user to become a TA');
            next(err);
        }
    );
}

/**
 * create a new lecturer from a ta
 * @param username
 * @throws {Error} - if there is no user with name @username
 *                 - if the user named username is not a lecturerUsername or is not assigned to a course
 *                 - if there is no user named graderUsername
 */
function addLecturer(req, res, next) {
    application.addLecturer(req.body).then(
        result => {
            req.log.info(req.body.username, "a request was sent to user to become a TA");
            res.send(200, {code: 200});
            next();
        },
        err => {
            req.log.warn(err.message, 'unable to request a user to become a grader');
            next(err);
        }
    );
}

/**
 * get all users for admin
 * @throws {Error} - if fail to get all users
 */
function viewAllUsers(req, res, next){
    application.viewAllUsers(req.body).then(
        businessUsers => {
            const users = businessUsers
                .map(u => ({
                    username: u.getUsername(),
                    firstName: u.getFirstName(),
                    lastName: u.getLastName(),
                    email: u.getEmail(),
                    type: u.getUserType(),
                }));
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
        application.deleteUser(req.body);
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
function getAllMetaQuestions(req, res, next) {
    application.getAllMetaQuestions(req.body).then(
        metaQuestions => {
            req.log.info("a request was sent fetch all the meta questions");
            res.send(200, {code: 200, metaQuestions})
            next()
        }, err => {
            req.log.warn(err.message, 'unable to request fetch all the meta questions');
            next(err);
        });
}

/**
 * return a list of meta question relevant to add to the new exam:
 * - each question has at least 1 key and 4 distractors that are not used yet in the exam
 * - the keys and distractors returned are not used yet in the exam
 * @throws {Error} - if fail to fetch
 */
function getMetaQuestionsForExam(req, res, next){
    application.getMetaQuestionsForExam(req.body).then(
        metaQuestions => {
            req.log.info("a request was sent fetch all the meta questions");
            res.send(200, {code: 200, metaQuestions})
            next()
        }, err => {
            req.log.warn(err.message, 'unable to request fetch all the meta questions');
            next(err);
        });
}

/**
 * return a list of meta question of the user's course
 * @throws {Error} - if fail to fetch
 */
function getAllAppendices(req, res, next) {
    application.getAllAppendices(req.body).then(
        appendices => {
            req.log.info("a request was sent fetch all the appendices");
            res.send(200, {code: 200, appendices,})
            next()
        }, err => {
            req.log.warn(err.message, 'unable to request fetch all the appendices');
            next(err);
        });
}

function getMetaQuestionForAppendix(req, res, next) {
    application.getMetaQuestionForAppendix(req.body).then(
        metaQuestions => {
            req.log.info("a request was sent fetch all the meta question for a specific appendix ");
            res.send(200, {code: 200, metaQuestions});
            next();
        },
        err => {
            req.log.warn(err.message, 'unable to request fetch all the meta question for a specific appendix');
            next(err);
        });
}
/**
 *  request: {
           keywords: str[],
           stem: str,
           keys: [{
             answer: str,
             explanation: str
             }],
           distractors: [{
             distractor: str,
             explanation: str
           }],
          appendix: {
              title: str,
              tag: str,
              content: str
           }
         }
     @throws {Error} - if fail to create
 */
function addMetaQuestion(req, res, next) {
    application.addMetaQuestion(req.body).then(
        metaQuestion => {
            req.log.info("request to create metaQuestion");
            res.send(200, {code: 200, metaQuestion});
            next();
        },
        err => {
            req.log.warn(err.message, 'failed to create meta questions');
            next(err);
        });
}

/**
 *  request: {
 appendix: {
 title: str,
 tag: str,
 content: str
 }
 }
 @throws {Error} - if fail to create
 */
function addAppendix(req, res, next) {
    application.addAppendix(req.body).then(
        appendix => {
            req.log.info("request to create appendix");
            res.send(200, {code: 200, appendix});
            next();
        },
        err => {
            req.log.warn(err.message, 'failed to create appendix');
            next(err);
        });
}

/**
 *  request: {
 appendix: {
 title: str,
 tag: str,
 content: str
 }
 }
 @throws {Error} - if fail to create
 */
function editAppendix(req, res, next) {
    application.editAppendix(req.body).then(
        appendix => {
            req.log.info("request to create appendix");
            res.send(200, {code: 200, appendix});
            next();
        },
        err => {
            req.log.warn(err.message, 'failed to create appendix');
            next(err);
        });
}

/**
    request: {
           selectedMetaQuestion: MetaQuestion,
           selectedKey: {answer: str, explanation: str },
           selectedDistractors: [{answer: str, explanation: str }],
         }
    response: {
           id: num
           stem: str,
           key: {answer: str, explanation: str },
           distractors: [{answer: str, explanation: str }],
          appendix: {
              title: str,
              tag: str,
              content: str
           }
         }
 * @throws {Error} - if fail to create
 */
function addManualMetaQuestionToExam(req, res, next) {
        application.addManualMetaQuestionToExam(req.body).then(examQuestion => {
            req.log.info("request to add manual question to exam");
            res.send(200, {code: 200, examQuestion})
            next()
        }, err =>{
            req.log.warn(err.message, 'failed to add manual question to exam');
            next(err);
        })
}

/**
 * add a meta question to the db based on solly stem and appendix
 * the system should randomize the answer and 4 distractors and create this question
 *  request: {
           selectedMetaQuestion: MetaQuestion,
           selectedKey: null,
           selectedDistractors: [] - empty array,
         }
    response: {
           id: num
           stem: str,
           key: {answer: str, explanation: str },
           distractors: [{answer: str, explanation: str }],
          appendix: {
              title: str,
              tag: str,
              content: str
           }
         }
 * @throws {Error} - if fail to create
 */
function addAutomaticQuestionToExam(req, res, next) {
    
        application.addAutomaticQuestionToExam(req.body).then(examQuestion =>{
            req.log.info("request to add automatic question to exam");
            res.send(200, {code: 200, examQuestion})
            next()
        }, err => {
            req.log.warn(err.message, 'failed to add automatic question to exam');
            next(err);
    
        })
}


/**
 * removes a question from the exam
 request: {
           id: num
           stem: str,
           key: {answer: str, explanation: str },
           distractors: [{answer: str, explanation: str }],
          appendix: {
              title: str,
              tag: str,
              content: str
           }
         }
 * @throws {Error} - if fail to create
 */
function removeQuestionFromExam(req, res, next) {
    try {
        application.removeQuestionFromExam(req.body)
        req.log.info("request to remove a question from exam");
        res.send(200, {code: 200})
        next()
    } catch (err) {
        req.log.warn(err.message, 'failed to remove a question from exam');
        next(err);
    }
}

/**
 * edit a meta question
 * @param - req.body = {
 *            id: num
 *            keywords: str[],
 *            stem: str,
 *            keys: [{
 *              answer: str,
 *              explanation: str
 *              }],
 *            distractors: [{
 *              distractor: str,
 *              explanation: str
 *            }],
 *           appendix: {
 *               title: str,
 *               tag: str,
 *               content: str
 *            }
 *          }
 *     
 *     appendix could be null
 * @throws {Error} - if fail to edit
 */
function editMetaQuestion(req, res, next) {
    application.editMetaQuestion(req.body).then(
        metaQuestion => {
            req.log.info("request to edit metaQuestion");
            res.send(200, {code: 200, metaQuestion})
            next()
        },
        err => {
            req.log.warn(err.message, 'failed to create meta questions');
            next(err);
        }
    );
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
        req.log.info("request to get all exams");
        application.getAllExams(req.body).then(exams =>{
            res.send(200, {code:200,exams})
            next()
        }, err =>{
            req.log.warn(err.message, 'failed to get all exams');
            next(err);
        })
}

function getVersionedExam(req, res, next){
    // todo - implement
    res.send(200, {code:200})
    next()
}

function editUser(req, res, next) {
    application.editUser(req.body).then(
        businessUser => {
            req.log.info(req.body.userDetails.username, 'edit user request');
            res.send(200, {code:200, user: {
                username: businessUser.getUsername(),
                firstName: businessUser.getFirstName(),
                lastName: businessUser.getLastName(),
                email: businessUser.getEmail(),
                firstSignIn: businessUser.isFirstSignIn(),
                type: businessUser.getUserType()}});
            next();
        },
        err => {
            req.log.warn(err.message, 'unable to edit user');
            next(err);
        }
    );
}

function generateTask(req, res, next) {
    application.generateTask(req.body).then(
        work => {
            req.log.info(req.body.callingUser.username, 'generate task request');
            res.send(200, {code: 200, work});
            next();
        },
        err => {
            req.log.warn(err.message, 'failed generating task');
            next(err);
        }
    );
}

function completeGeneratedTask(req, res, next) {
    application.completeGeneratedTask(req.body).then(
        _ => {
            req.log.info(req.body.callingUser.username, 'completed generated task');
            res.send(200, {code: 200});
            next();
        },
        err => {
            req.log.warn(err.message, 'failed completing generated task');
            next(err);
        }
    );
}

module.exports = {
    signUp: signUp,
    signIn: signIn, 
    logout: logout,
    changePassword: changePassword,
    resetPassword: resetPassword,
    getAllStaff: getAllStaff,
    viewMyTasks: viewMyTasks,
    finishATask: finishATask,
    addTA: addTA,
    addLecturer: addLecturer,
    viewAllUsers: viewAllUsers,
    deleteUser: deleteUser,
    getAllMetaQuestions: getAllMetaQuestions,
    getMetaQuestionsForExam,
    getAllAppendices: getAllAppendices,
    getMetaQuestionForAppendix: getMetaQuestionForAppendix,
    addMetaQuestion: addMetaQuestion,
    addManualMetaQuestionToExam: addManualMetaQuestionToExam,
    addAutomaticQuestionToExam: addAutomaticQuestionToExam,
    removeQuestionFromExam: removeQuestionFromExam,
    editMetaQuestion: editMetaQuestion,
    createExam,
    getAllExams,
    getVersionedExam,
    editUser: editUser,
    generateJWT,
    generateTask: generateTask,
    completeGeneratedTask: completeGeneratedTask,
    addAppendix,
    editAppendix
};

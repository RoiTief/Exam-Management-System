const UserController  = require('./UserManager/UserController.js' );
const TaskController = require('./TaskManager/TaskController.js');
const MetaQuestionController = require('./MetaQuestions/MetaQuestionController.js');
const userTypes = require('../Enums').USER_TYPES


class ApplicationFacade{
    constructor() {
        this.userController = new UserController();
        this.taskController = new TaskController();
        this.metaQuestionController = new MetaQuestionController();

        //todo - remove for testing:
        this.signIn(24632, "Admin", "Aa123456")
        this.register(24632, "courseAdmin", userTypes.LECTURER)
        this.register(24632, "TA", userTypes.TA)
        this.register(24632, "TA1",  userTypes.TA)
        this.register(24632, "TA2",  userTypes.TA)
        this.register(24632, "TA3",  userTypes.TA)
        this.logout(24632)
        this.signIn(24632, "courseAdmin", "123")
        this.addTA(24632, "TA")
        this.addTA(24632, "TA1")
        this.addTA(24632, "TA2")
        this.addTA(24632, "TA3")
        this.logout(24632)
    }

    getUsername(pid){
        return this.userController.getLoggedInName(pid)
    }

    getUserType(pid){
        return this.userController.getType(pid)
    }

    /**
     * register a user
     * @param pid - the process trying to sign up from
     * @param username - the new user username - needs to be unique
     * @param type - the new user type
     * @returns {User} - returns the created user
     * @throws Error - if the process is already logged in
     *               - if the username is taken
     */
    register(pid, username, type){
        return this.userController.register(pid, username, type);
    }

    /**
     * signs in user
     * @param pid - the process trying to sign in
     * @param username - the user username - need to be registered
     * @param password - the user password
     * @returns {User} - returned the signed-in user
     * @throws {Error} - if the user is already signed in
     *                 - if there is no registered user with this username
     *                 - if the password is incorrect
     */
    signIn(pid, username, password) {
        return this.userController.signIn(pid, username, password)
    }

    /**
     * user wants to log out
     * @param pid - the process log out
     * @throws {Error} - if the user is not signed in
     */
    logout(pid) {
        return this.userController.logout(pid)
    }

    /**
     * get all staff
     * @param pid - the process who tries to view the staff - needs to be a logged in as lecturer
     * @return {Staff} the staff, ordered by lecturers and TAs
     * @throws {Error} - if there is no logged in user in @pid
     *                 - if the user logged in user in @pid is not a lecturer
     */
    getAllStaff(pid){
        return this.userController.getAllStaff(pid)
    }

    /**
     * set @courseAdminUsername to be the course
     * @param courseAdminUsername - the new course admin
     * @throws {Error} - if there is no user named courseAdminUsername
     */
    setUserAsCourseAdmin(courseAdminUsername){
        this.userController.setUserAsCourseAdmin(courseAdminUsername);
    }

    /**
     * create a task for the new TA to accept being a TA of this course
     * @param pid - the process who tries to add the new TA - needs to be a courseAdmin
     * @param TAUsername - the new TA username
     * @throws {Error} - if there is no user with name @username
     *                 - if the user named username is not a courseAdminUsername (is not assigned to a course)
     *                 - if there is no user named TAUsername
     */
    addTA(pid, TAUsername){
        this.userController.verifyLecturer(pid);
        this.userController.verifyUserRegistered(TAUsername)
        this.taskController.newTARequestTask(TAUsername);
    }

    /**
     * set @TAUsername to be a TA in course
     * @param TAUsername
     * @throws {Error} - if there is no user named courseAdminUsername
     */
    setUserAsTA(TAUsername){
        this.userController.setUserAsTA(TAUsername);
    }

    /**
     * creates a test for the course {@username} is Admin of
     * export it as a pdf and as a word file
     * adds the test to pastExams
     * @param username - the user who tries to set the exam parameters - needs to be a courseAdmin
     * @param parameters {Map<string, [number, number]>} a map of parameters that specify for each subject -
     *                                                  how many questions per subject and how many points the subject
     *                                                  is worth (notice that each question's value is the subject worth
     *                                                  devided by the number of questions
     * @throws {Error} - if there is no user with name @username
     *                 - if the user named username is not a courseAdminUsername or is not assigned to a course
     *                 - if the sum total of the subject worth is not 100
     */
    setExamParameters(username, parameters){
        //todo
    }

    /**
     * creates a test for the course {@username} is Admin of
     * export it as a pdf and as a word file
     * adds the test to pastExams
     * @param username - the user who tries to create the new exam - needs to be a courseAdmin
     * @param reason - why you create the new exam (for example "Term A 2022" "example test for students"
     * @return {Exam}
     * @throws {Error} - if there is no user with name @username
     *                 - if the user named username is not a courseAdminUsername or is not assigned to a course
     *                 - if the course subject spread is not specified
     *                 - if there is not enough questions for a subject
     */
    createExam(username, reason){
        //todo
    }

    /**
     * view course statistics (per subject)
     * @param username - the user who tries to view the course statistics - needs to be a courseAdmin
     * @return {Map<string,number>} per subject the precent of correct answers
     * @throws {Error} - if there is no user with name @username
     *                 - if the user named username is not a courseAdminUsername or is not assigned to a course
     *                 - if the course subject spread is not specified
     */
    viewStatistics(username){
        //todo
    }

    /**
     * get all usernames in the system
     * @param pid - who is requestion the usernames - can be course admin or system admin
     * @return {List<string>} list of usernames
     */
    viewAllUsers(pid){
        return this.userController.getAllUsers(pid)
    }

    /**
     * view course statistics (per question)
     * @param username - the user who tries to view the course statistics - needs to be a courseAdmin
     * @param subject
     * @return {Map<Question,number>} per question the precent of correct answers
     * @throws {Error} - if there is no user with name @username
     *                 - if the user named username is not a courseAdminUsername or is not assigned to a course
     */
    viewStatisticsPerSubject(username, subject){
        //todo
    }

    /**
     * view all the tasks of the course and their progress
     * @param username - the user who tries to view the course tasks - needs to be a systemAdmin
     * @return {[Task]}
     * @throws {Error} - if there is no user with name @username
     *                 - if the user named username is not a courseAdminUsername or is not assigned to a course
     */
    viewTasksForCourse(username){
        //todo
    }

    /**
     * view my tasks
     * @param pid - the user who tries to view his tasks
     * @return {[Task]}
     * @throws {Error} - if there is no user logged in pid
     */
    viewMyTasks(pid){
        let username = this.userController.getLoggedInName(pid);
        return this.taskController.getTasksOf(username);
    }

    /**
     * view all unassigned tasks
     * @param username - the user who tries to view his tasks
     * @return {[Task]}
     * @throws {Error} - if there is no user with name @username
     */
    viewUnassignedTasks(username){
        //todo
    }

    /**
     * assigned a new task to user named @{username}
     * @param username - the user who tries to assign himself a new task
     * @param taskId - the task
     * @throws {Error} - if there is no user with name @username
     *                 - if there is no task with this id
     *                 - if this task is already assigned to a user
     */
    assignNewTask(username, taskId){
        //todo
    }

    /**
     * tag task as finished
     * @param pid - the user who tries to progress a task
     * @param taskId - the taskID
     * @param response - the user answer to the task
     * @throws {Error} - if there is no task with this id
     *                 - if task with this ID is not assigned to the username
     *                 - if this task is already finished
     */
    finishATask(pid, taskId, response){
        let username = this.userController.getLoggedInName(pid)
        this.taskController.finishTask(username, taskId, response, this);
    }

    /**
     * a grader adds a student answers to an exam
     * the exam\subject\questions statistics are modified
     * @param username - the username of the grader
     * @param examId - the exam id
     * @param answers {[number]} - the answer list (each answer is a number between 1-4)
     * @throws {Error} - if there is no user with name @username
     *                 - if the user is not a grader of a course
     *                 - if there is no exam with this id to the course
     *                 - if one of the answers is not valid
     */
    addAnswer(username, examId, answers){
        //todo
    }

    /**
     * Add a simple meta-question
     * @param pid - The process ID of the user performing the action
     * @param stem - The stem of the meta-question
     * @param correctAnswers - Array of correct answers for the meta-question
     * @param distractors - Array of distractors for the meta-question
     * @throws {Error} - If the user is not signed in or does not have the necessary permissions
     */
    addSimpleMetaQuestion(pid, stem, correctAnswers, distractors) {
        const user = this.userController.getLoggedInName(pid);
        this.metaQuestionController.addSimpleMetaQuestion(stem, correctAnswers, distractors)
    }

    /**
     * Delete a user from the system
     * @param pid - The process ID of the user performing the action
     * @param username - The user we want to delete
     * @throws {Error} - If the user is not signed in or does not have the necessary permissions
     */
    deleteUser(pid, username) {
        this.userController.deleteUser(pid, username)
    }



}

module.exports = ApplicationFacade;
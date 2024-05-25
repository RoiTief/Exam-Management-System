const UserController  = require('./UserManager/UserController.js' );
const TaskController = require('./TaskManager/TaskController.js');
const CourseController = require('./CourseManager/CourseController.js');


class ApplicationFacade{
    constructor() {
        this.userController = new UserController();
        this.taskController = new TaskController();
        this.courseController = new CourseController();

        //todo - remove for testing:
        this.signIn(24632, "Admin", "Aa123456")
        this.register(24632, "courseAdmin", "123")
        this.register(24632, "TA", "123")
        this.register(24632, "TA1", "123")
        this.register(24632, "TA2", "123")
        this.register(24632, "TA3", "123")
        this.register(24632, "grader", "123")
        this.addCourse(24632, 111, "course name", "courseAdmin")
        this.logout(24632)
        this.signIn(24632, "courseAdmin", "123")
        this.finishATask(24632, 1, "yes")
        console.log(this.getUserType(24632))
        this.addGrader(24632, "grader")
        this.addTA(24632, "TA")
        this.addTA(24632, "TA1")
        this.addTA(24632, "TA2")
        this.addTA(24632, "TA3")
        this.logout(24632)
        this.signIn(24632, "TA", "123")
        this.finishATask(24632, 3, "yes")
        this.logout(24632)
        this.signIn(24632, "TA1", "123")
        this.finishATask(24632, 4, "yes")
        this.logout(24632)
        this.signIn(24632, "TA2", "123")
        this.finishATask(24632, 5, "yes")
        this.logout(24632)
        this.signIn(24632, "TA3", "123")
        this.finishATask(24632, 6, "yes")
        this.logout(24632)
        this.signIn(24632, "grader", "123")
        this.finishATask(24632, 2, "yes")    
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
     * @param password - the new user password
     * @returns {User} - returns the created user
     * @throws Error - if the process is already logged in
     *               - if the username is taken
     */
    register(pid, username, password){
        return this.userController.register(pid, username, password);
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
     * creates new course
     * create a task for the new courseAdmin to accept being a courseAdmin
     * @param pid - the process who tries to create the new course - needs to be a logged in systemAdmin
     * @param courseID - the new courseID - need to be unique
     * @param courseName - the new course name
     * @param courseAdminUsername - the new course admin
     * @return {Course} the new course created
     * @throws {Error} - if there is no logged in user in @pid
     *                 - if the user logged in user in @pid is not a systemAdmin
     *                 - if there is no user named courseAdminUsername
     *                 - if there is already a course with this ID
     */
    addCourse(pid, courseID, courseName, courseAdminUsername){
        this.userController.verifySystemAdmin(pid);
        this.userController.verifyUserRegistered(courseAdminUsername)
        let course = this.courseController.createCourse(courseID, courseName);
        this.taskController.courseAdminRequestTask(courseAdminUsername, course);
        return course;
    }

    /**
     * view a course
     * @param pid - the process who tries to view the course - needs to be a logged in courseAdmin
     * @return {Course} the course
     * @throws {Error} - if there is no logged in user in @pid
     *                 - if the user logged in user in @pid is not a courseAdmin
     */
    viewMyCourse(pid){
        return this.userController.verifyCourseAdmin(pid);
    }

    /**
     * set @courseAdminUsername to be the course
     * @param courseAdminUsername - the new course admin
     * @param course
     * @throws {Error} - if there is no user named courseAdminUsername
     */
    setUserAsCourseAdmin(courseAdminUsername, course){
        this.userController.setUserAsCourseAdmin(courseAdminUsername, course);
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
        let course = this.userController.verifyCourseAdmin(pid);
        this.userController.verifyUserRegistered(TAUsername)
        this.taskController.newTARequestTask(TAUsername, course);
    }

    /**
     * set @TAUsername to be a TA in course
     * @param TAUsername
     * @param course
     * @throws {Error} - if there is no user named courseAdminUsername
     */
    setUserAsTA(TAUsername, course){
        this.userController.setUserAsTA(TAUsername, course);
    }

    /**
     * create a task for the new grader to accept being a grader of this course
     * @param pid - the user who tries to add the new grader - needs to be a courseAdmin
     * @param graderUsername
     * @throws {Error} - if there is no user with name @username
     *                 - if the user named username is not a courseAdminUsername or is not assigned to a course
     *                 - if there is no user named graderUsername
     */
    addGrader(pid, graderUsername){
        let course = this.userController.verifyCourseAdmin(pid);
        this.userController.verifyUserRegistered(graderUsername)
        this.taskController.newGraderRequestTask(graderUsername, course);
    }

    /**
     * set @graderUsername to be a Grader in course
     * @param graderUsername
     * @param course
     * @throws {Error} - if there is no user named courseAdminUsername
     */
    setUserAsGrader(graderUsername, course){
        this.userController.setUserAsGrader(graderUsername, course);
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
     * @return {List<User>} list of usernames
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
        const courseID = user.getCourseID()
        this.courseController.getCourse(courseID).addSimpleMetaQuestion(stem, correctAnswers, distractors)
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

    /**
     * return a list of meta question of the user's course
     * @param pid - The process ID of the user performing the action
     * @throws {Error} - If the user is not signed in or does not have the necessary permissions
     * @return {MetaQuestion[]} all the meta question of the user's course
     */
    getAllMetaQuestions(pid) {
        //TODO - implement
        return [
            {
                stem: 'what did Idan listen to when he was a kid',
                correctAnswers: [{text:'baby motzart', explanation: 'explanation1'},
                    {text:'baby bethoven', explanation: 'explanation2'}],
                distractors: [{text:'Machrozet Chaffla', explanation: 'explanation1'},
                    {text:'zohar Argov', explanation: 'explanation2'}, {text:'Begins "tzachtzachim" speach', explanation: 'explanation3'}],
                keywords: ['key1', 'key2', 'key3']
            },
            {
                stem: "what is Mor's last name",
                correctAnswers: [{text:'Abo', explanation: 'explanation1'},
                    {text:'Abu', explanation: 'explanation2'}],
                distractors: [{text:'abow', explanation: 'explanation1'},
                    {text:'abou', explanation: 'explanation2'}, {text:'aboo', explanation: 'explanation3'}],
                keywords: ['key1', 'key2', 'key5'],
                appendix: {title: "Mor's ID", tag: "tag", content: "imagine there is my id here"}
            },
            {
                stem: "What is Roi's nickname",
                correctAnswers: [{text:'The Tief', explanation: 'explanation1'},
                    {text:"Gali's soon to be husband", explanation: 'explanation2'}],
                distractors: [{text:'that blonde guy', explanation: 'explanation1'},
                    {text:'that tall guy', explanation: 'explanation2'}, {text:'the one with the black nail polish', explanation: 'explanation3'}],
                keywords: ['key1', 'key2', 'key5'],
                appendix: {title: "Roi picture", tag: "tag", content: "some amberesing picture of roi"}
            },
            {
                stem: 'How old is Mor',
                correctAnswers: [{text:'25', explanation: 'explanation1'},
                    {text:'22 with "vetek"', explanation: 'explanation2'}],
                distractors: [{text:'19 (but thank you)', explanation: 'explanation1'},
                    {text:'30', explanation: 'explanation2'}, {text:'35', explanation: 'explanation3'}],
                keywords: ['key1', 'key2', 'key5'],
                appendix: {title: "Mor's ID", tag: "tag", content: "imagine there is my id here"}
            },
            {
                stem: 'where does Ofek leave',
                correctAnswers: [{text:'in Gan Yavne', explanation: 'explanation1'},
                    {text:'next to the orange square', explanation: 'explanation2'},
                    {text:"next to mor's brother", explanation: 'explanation1'}],
                distractors: [{text:'at the beach - surffing', explanation: 'explanation1'},
                    {text:'riding bike in the fields', explanation: 'explanation2'}, {text:"in may's house", explanation: 'explanation3'}],
                keywords: ['key1', 'key2', 'key3']
            }
        ]

    }


}

module.exports = ApplicationFacade;
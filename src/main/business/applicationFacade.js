const UserController  = require('./UserManager/UserController.js' );
const TaskController = require('./TaskManager/TaskController.js');
const MetaQuestionController = require('./MetaQuestions/MetaQuestionController.js');
const ExamController = require('./ExamManager/ExamController.js');
const userTypes = require('../Enums').USER_TYPES
const { userRepo } = require("../DAL/Dal");
const { validateParameters } = require('../validateParameters.js');
const {USER_TYPES, PRIMITIVE_TYPES} = require("../Enums");

class ApplicationFacade{
    constructor() {
        this.userController = new UserController(userRepo);
        this.taskController = new TaskController(this.userController);
        this.metaQuestionController = new MetaQuestionController(this.taskController, this.userController);
        this.examController = new ExamController(this.taskController, this.userController)

        //todo - remove for testing:
        this.addMetaQuestion({
            stem: '$e^{i\\pi} + 1 = $',
            keys: [{text:'0', explanation: 'Using Euler\'s identity'}],
            distractors: [{text:'$\\frac{what}{\\frac{The}{FUCK}}$', explanation: 'This is a fraction?'},
                {text:'\\begin{turn}{180}This answer is upside-down\\end{turn}', explanation: 'Rotated answer'}, {text:'$\\mathbb{N}\\mathbb{I}\\mathbb{C}\\mathbb{E}$', explanation: 'This is nice, but not close to the answer.'}],
            appendix: {
                title: "Euler's identity: ",
                tag: "tag1",
                content: "\\setlength{\\fboxsep}{10pt} % Set the padding (default is 3pt)\n"
                    + "\\fbox{\\huge $e^{i\\theta} = \\cos{\\theta} + i\\sin{\\theta}$}"
            },
            keywords: ['key1', 'key2', 'key3'],
            callingUser: {user: 'Lecturer', type: USER_TYPES.LECTURER}
        })

        this.addMetaQuestion(
                {
                    stem: 'what did Idan listen to when he was a kid',
                    keys: [{text:'baby motzart', explanation: 'explanation1'},
                        {text:'baby bethoven', explanation: 'explanation2'}],
                    distractors: [{text:'Machrozet Chaffla', explanation: 'explanation1'},
                        {text:'zohar Argov', explanation: 'explanation2'}, {text:'Begins "tzachtzachim" speach', explanation: 'explanation3'}],
                    keywords: ['key1', 'key2', 'key3'],
                    callingUser: {user: 'Lecturer', type: USER_TYPES.LECTURER}
                }
        )
        this.addMetaQuestion(
                {
                    stem: "what is Mor's last name",
                    keys: [{text:'Abo', explanation: 'explanation1'},
                        {text:'Abu', explanation: 'explanation2'}],
                    distractors: [{text:'abow', explanation: 'explanation1'},
                        {text:'abou', explanation: 'explanation2'}, {text:'aboo', explanation: 'explanation3'}],
                    keywords: ['key1', 'key2', 'key5'],
                    appendix: {title: "Mor's ID", tag: "tag2", content: "imagine there is my id here"},
                    callingUser: {user: 'Lecturer', type: USER_TYPES.LECTURER}
                }
        )
        this.addMetaQuestion(
                {
                    stem: "What is Roi's nickname",
                    keys: [{text:'The Tief', explanation: 'explanation1'},
                        {text:"Gali's soon to be husband", explanation: 'explanation2'}],
                    distractors: [{text:'that blonde guy', explanation: 'explanation1'},
                        {text:'that tall guy', explanation: 'explanation2'}, {text:'the one with the black nail polish', explanation: 'explanation3'}],
                    keywords: ['key1', 'key2', 'key5'],
                    appendix: {title: "Roi picture", tag: "tag3", content: "some amberesing picture of roi"},
                    callingUser: {user: 'Lecturer', type: USER_TYPES.LECTURER}
                }
        )
        this.addMetaQuestion(
                {
                    stem: 'How old is Mor',
                    keys: [{text:'25', explanation: 'explanation1'},
                        {text:'22 with "vetek"', explanation: 'explanation2'}],
                    distractors: [{text:'19 (but thank you)', explanation: 'explanation1'},
                        {text:'30', explanation: 'explanation2'}, {text:'35', explanation: 'explanation3'}],
                    keywords: ['key1', 'key2', 'key5'],
                    appendix: {title: "Mor's ID", tag: "tag2", content: "imagine there is my id here"},
                    callingUser: {user: 'Lecturer', type: USER_TYPES.LECTURER}
                }
        )
        this.addMetaQuestion(
                {
                    stem: 'where does Ofek leave',
                    keys: [{text:'in Gan Yavne', explanation: 'explanation1'},
                        {text:'next to the orange square', explanation: 'explanation2'},
                        {text:"next to mor's brother", explanation: 'explanation1'}],
                    distractors: [{text:'at the beach - surffing', explanation: 'explanation1'},
                        {text:'riding bike in the fields', explanation: 'explanation2'}, {text:"in may's house", explanation: 'explanation3'}],
                    keywords: ['key1', 'key2', 'key3'],
                    callingUser: {user: 'Lecturer', type: USER_TYPES.LECTURER}
                }
        )
    }

    /**
     * register a user
     * @param userdetails - details needed to register the user with
     * @returns {Promise<User>} - returns the created user
     * @throws Error - if the process is already logged in
     *               - if the username/email is taken
     */
    async register(userdetails){
        return (await this.userController.register(userdetails));
    }

    /**
     * signs in user
     * @param username - the user username - need to be registered
     * @param password - the user password
     * @returns {Promise<User>} - returned the signed-in user
     * @throws {Error} - if the user is already signed in
     *                 - if there is no registered user with this username
     *                 - if the password is incorrect
     */
    async signIn(data) {
        return (await this.userController.signIn(data));
   }

    /**
     * user wants to log out
     * @throws {Error} - if the user is not signed in
     */
    //TODO:REMOVE
    logout(logoutData) {
        //Log out should be done in client side, by removing the cookies.
    }

    /**
     * change password
     * @param newPassword - updated password for the logged user
     */
    async changePassword(changePasswordData) {
        validateParameters(changePasswordData,
            {
                newPassword: PRIMITIVE_TYPES.STRING,
            })
        const user = await this.userController.getUser(changePasswordData.callingUser.username);
        await user.changePassword(changePasswordData.newPassword);
        return user;
    }

    /**
     * reset a user password
     * @param resetPasswordData - updated password for the logged user
     */
    async resetPassword(resetPasswordData) {
        return (await this.userController.resetPassword(resetPasswordData));
    }

    /**
     * get all staff
     * @return {Promise<{TAs: any[], Lecturers: any[]}>} the staff, ordered by lecturers and TAs
     * @throws {Error} - if the user logged in user is not a lecturer
     */
    async getAllStaff(data){
        return (await this.userController.getAllStaff(data));
    }

    // TODO: remove
    /**
     * set @lecturerUsername to be the course
     * @param lecturerUsername - the new lecturer
     * @throws {Error} - if there is no user named lecturerUsername
     */
    setUserAsLecturer(lecturerUsername){
        this.userController.setUserAsLecturer(lecturerUsername);
    }

    /**
     * create a task for the new TA to accept being a TA of this course
     * @param data.username - the new TA username
     * @throws {Error} - if there is no user with name @username
     *                 - if the user named username is not a lecturerUsername (is not assigned to a course)
     *                 - if there is no user named TAUsername
     */
    async addTA(data){
        await this.userController.updateStaff({
            callingUser: data.callingUser,
            username: data.username,
            userType: USER_TYPES.TA,
        })
    }

    async addLecturer(data){
        await this.userController.updateStaff({
            callingUser: data.callingUser,
            username: data.username,
            userType: USER_TYPES.LECTURER,
        })
    }

    /**
     * set @TAUsername to be a TA in course
     * @param TAUsername
     * @throws {Error} - if there is no user named lecturerUsername
     */
    setUserAsTA(TAUsername){
        this.userController.setUserAsTA(TAUsername);
    }

    /**
     * creates an Exam for the course {@username} is Admin of
     * export it as a pdf and as a word file
     * adds the test to pastExams
     * @param username - the user who tries to set the exam parameters - needs to be a lecturer
     * @param parameters {Map<string, [number, number]>} a map of parameters that specify for each subject -
     *                                                  how many questions per subject and how many points the subject
     *                                                  is worth (notice that each question's value is the subject worth
     *                                                  devided by the number of questions
     * @throws {Error} - if there is no user with name @username
     *                 - if the user named username is not a lecturerUsername or is not assigned to a course
     *                 - if the sum total of the subject worth is not 100
     */
    setExamParameters(username, parameters){
        //todo
    }

    /**
     * creates an Exam for the course {@username} is Admin of
     * export it as a pdf and as a word file
     * adds the test to pastExams
     * @return {Exam}
     * @throws {Error} - if there is no user with name @username
     *                 - if the user named username is not a lecturerUsername or is not assigned to a course
     *                 - if the course subject spread is not specified
     *                 - if there is not enough questions for a subject
     */
    createExam(createExamProperties){
        return this.examController.createExam(createExamProperties)
    }


    getAllExams(getAllExamsProperties){
        return this.examController.getAllExams(getAllExamsProperties)
    }

    /**
     * view course statistics (per subject)
     * @param username - the user who tries to view the course statistics - needs to be a lecturer
     * @return {Map<string,number>} per subject the precent of correct answers
     * @throws {Error} - if there is no user with name @username
     *                 - if the user named username is not a lecturerUsername or is not assigned to a course
     *                 - if the course subject spread is not specified
     */
    viewStatistics(username){
        //todo
    }

    /**
     * get all usernames in the system
     * @return list of usernames
     */
    async viewAllUsers(data){
        return await this.userController.getAllUsers(data)
    }

    /**
     * view course statistics (per question)
     * @param username - the user who tries to view the course statistics - needs to be a lecturer
     * @param subject
     * @return {Map<Question,number>} per question the precent of correct answers
     * @throws {Error} - if there is no user with name @username
     *                 - if the user named username is not a lecturerUsername or is not assigned to a course
     */
    viewStatisticsPerSubject(username, subject){
        //todo
    }

    /**
     * view all the tasks of the course and their progress
     * @param username - the user who tries to view the course tasks - needs to be a systemAdmin
     * @return {[Task]}
     * @throws {Error} - if there is no user with name @username
     *                 - if the user named username is not a lecturerUsername or is not assigned to a course
     */
    viewTasksForCourse(username){
        //todo
    }

    /**
     * view my tasks
     * @param data - the user who tries to view his tasks
     * @return {[Task]}
     * @throws {Error} - if there is no user logged in data
     */
    async viewMyTasks(data){
        validateParameters(data,{})
        const user = await this.userController.getUser(data.callingUser.username);
        return this.taskController.getTasksOf(user.getUsername());
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
     * @param taskId - the taskID
     * @param response - the user answer to the task
     * @throws {Error} - if there is no task with this id
     *                 - if task with this ID is not assigned to the username
     *                 - if this task is already finished
     */
    async finishATask(data){
        await this.taskController.finishTask(data, this);
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
     * add meta-question, look for values in MetaQuestion.js
     *7
     */
    addMetaQuestion(createMetaQuestionProperties) {
        return this.metaQuestionController.createMetaQuestion(createMetaQuestionProperties)
    }

    editMetaQuestion(editedMetaQuestionProperties) {
        this.metaQuestionController.editMetaQuestion(editedMetaQuestionProperties)
    }

    /**
     * Delete a user from the system
     * @param data.username - The user we want to delete
     * @throws {Error} - If the user is not signed in or does not have the necessary permissions
     */
    deleteUser(data) {
        this.userController.deleteUser(data)
    }

    /**
     * return a list of meta question of the user's course
     * @throws {Error} - If the user is not signed in or does not have the necessary permissions
     * @return {MetaQuestion[]} all the meta question of the user's course
     */
    getAllMetaQuestions(data) {
        return this.metaQuestionController.getAllMetaQuestions()
    }

    /**
     * return a list of appendices of the user's course
     * @throws {Error} - If the user is not signed in or does not have the necessary permissions
     * @return {Appendix[]} all the meta question of the user's course
     */

    getAllAppendices(data) {
        // return [
        //     { title: 'Appendix A', tag: 'General', content: 'Content of Appendix A' },
        //     { title: 'Appendix B', tag: 'Specific', content: 'Content of Appendix B' },
        //     // Add more appendices as needed
        // ];

        return this.metaQuestionController.getAllAppendices(data)
    }

    getMetaQuestionForAppendix(appendix) {
        return this.metaQuestionController.getMetaQuestionForAppendix(appendix)
    }

    async editUser(data){
        if (data.callingUser.username === data.userDetails.username) {
            const userDetails = data.userDetails;
            return this.userController.updateMyInfo(userDetails);
        }
        return this.userController.updateUser(data);
    }

}

module.exports = ApplicationFacade;
const UserController  = require('./UserManager/UserController.js' );
const TaskController = require('./TaskManager/TaskController.js');
const MetaQuestionController = require('./MetaQuestions/MetaQuestionController.js');
const ExamController = require('./ExamManager/ExamController.js');
const userTypes = require('../Enums').USER_TYPES

class ApplicationFacade{
    constructor() {
        this.userController = new UserController();
        this.taskController = new TaskController(this.userController);
        this.metaQuestionController = new MetaQuestionController(this.taskController, this.userController);
        this.examController = new ExamController(this.taskController, this.userController)

        //todo - remove for testing:
        this.signIn(24632, "Admin", "Aa123456")
        this.register(24632, "lecturer", userTypes.LECTURER)
        this.register(24632, "TA", userTypes.TA)
        this.register(24632, "TA1",  userTypes.TA)
        this.register(24632, "TA2",  userTypes.TA)
        this.register(24632, "TA3",  userTypes.TA)
        this.logout(24632)
        this.signIn(24632, "lecturer", "123")
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
     * change password
     * @param pid - the process trying to sign in
     * @param username - the user username - need to be registered
     * @param newPassword - the user new password
     * @returns {User} - returned the signed-in user
     * @throws {Error} - if the user is already signed in
     *                 - if there is no registered user with this username
     */
    changePassword(pid, username, newPassword) {
        return this.userController.changePasswordAfterFirstSignIn(pid, username, newPassword)
    }

    /**
     * get all staff
     * @param pid - the process who tries to view the staff - needs to be a logged in as lecturer
     * @return {{TAs: any[], Lecturers: any[]}} the staff, ordered by lecturers and TAs
     * @throws {Error} - if there is no logged in user in @pid
     *                 - if the user logged in user in @pid is not a lecturer
     */
    getAllStaff(pid){
        return this.userController.getAllStaff(pid)
    }

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
     * @param pid - the process who tries to add the new TA - needs to be a lecturer
     * @param TAUsername - the new TA username
     * @throws {Error} - if there is no user with name @username
     *                 - if the user named username is not a lecturerUsername (is not assigned to a course)
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
     * @param pid - who is requestion the usernames - can be lecturer or system admin
     * @return {List<User>} list of usernames
     */
    viewAllUsers(pid){
        return this.userController.getAllUsers(pid)
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
     * add meta-question, look for values in MetaQuestion.js
     *7
     */
    addMetaQuestion(createMetaQuestionProperties) {
        return this.metaQuestionController.createMetaQuestion(createMetaQuestionProperties)
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
     *  return [
            {
                stem: 'what did Idan listen to when he was a kid',
                keys: [{text:'baby motzart', explanation: 'explanation1'},
                    {text:'baby bethoven', explanation: 'explanation2'}],
                distractors: [{text:'Machrozet Chaffla', explanation: 'explanation1'},
                    {text:'zohar Argov', explanation: 'explanation2'}, {text:'Begins "tzachtzachim" speach', explanation: 'explanation3'}],
                keywords: ['key1', 'key2', 'key3']
            },
            {
                stem: "what is Mor's last name",
                keys: [{text:'Abo', explanation: 'explanation1'},
                    {text:'Abu', explanation: 'explanation2'}],
                distractors: [{text:'abow', explanation: 'explanation1'},
                    {text:'abou', explanation: 'explanation2'}, {text:'aboo', explanation: 'explanation3'}],
                keywords: ['key1', 'key2', 'key5'],
                appendix: {title: "Mor's ID", tag: "tag", content: "imagine there is my id here"}
            },
            {
                stem: "What is Roi's nickname",
                keys: [{text:'The Tief', explanation: 'explanation1'},
                    {text:"Gali's soon to be husband", explanation: 'explanation2'}],
                distractors: [{text:'that blonde guy', explanation: 'explanation1'},
                    {text:'that tall guy', explanation: 'explanation2'}, {text:'the one with the black nail polish', explanation: 'explanation3'}],
                keywords: ['key1', 'key2', 'key5'],
                appendix: {title: "Roi picture", tag: "tag", content: "some amberesing picture of roi"}
            },
            {
                stem: 'How old is Mor',
                keys: [{text:'25', explanation: 'explanation1'},
                    {text:'22 with "vetek"', explanation: 'explanation2'}],
                distractors: [{text:'19 (but thank you)', explanation: 'explanation1'},
                    {text:'30', explanation: 'explanation2'}, {text:'35', explanation: 'explanation3'}],
                keywords: ['key1', 'key2', 'key5'],
                appendix: {title: "Mor's ID", tag: "tag", content: "imagine there is my id here"}
            },
            {
                stem: 'where does Ofek leave',
                keys: [{text:'in Gan Yavne', explanation: 'explanation1'},
                    {text:'next to the orange square', explanation: 'explanation2'},
                    {text:"next to mor's brother", explanation: 'explanation1'}],
                distractors: [{text:'at the beach - surffing', explanation: 'explanation1'},
                    {text:'riding bike in the fields', explanation: 'explanation2'}, {text:"in may's house", explanation: 'explanation3'}],
                keywords: ['key1', 'key2', 'key3']
            },
            {
                stem: '\tThe poet John Keats once wrote (in his poem "Ode on a Grecian Urn"),\n' +
                    'Beauty is truth, truth beauty,---that is all\n' +
                    'Ye know on earth, and all ye need to know.\n' +
                    '\n' +
                    'By contrast, Plato (in The Republic) warns of poetry\'s power to make a falsehood seem true, by beautifying it.\n' +
                    '\n' +
                    'What, then, is the relationship between beauty, as achieved by the artist, and truth?',
                "correctAnswers": [
                    {
                        "text": "Harmony between Beauty and Truth",
                        "explanation": "Beauty in art can reveal deeper truths by presenting them in a harmonious and aesthetically pleasing way, allowing people to perceive and understand these truths more profoundly."
                    },
                    {
                        "text": "Subjective Perception",
                        "explanation": "Both beauty and truth are subjective experiences; the artist's role is to present their personal interpretation, which may resonate with or challenge the audience's own perceptions."
                    },
                    {
                        "text": "Beauty as a Vehicle for Truth",
                        "explanation": "Artistic beauty can serve as a compelling vehicle for conveying truths, making complex or abstract ideas more accessible and emotionally impactful to the audience."
                    },
                    {
                        "text": "Dialectical Relationship",
                        "explanation": "The relationship between beauty and truth is dialectical; art can both reveal and obscure truth, prompting viewers to engage critically with what is presented and discover underlying truths."
                    },
                    {
                        "text": "Complementary Roles",
                        "explanation": "Beauty and truth serve complementary roles in art, where beauty attracts attention and stimulates emotion, while truth provides substance and intellectual depth, enriching the overall experience."
                    }
                ],
                "distractors": [
                    {
                        "text": "Beauty is Always Deceptive",
                        "explanation": "This is incorrect because beauty in art can sometimes reveal rather than obscure truth, depending on the intent and skill of the artist."
                    },
                    {
                        "text": "Truth Has No Place in Art",
                        "explanation": "Art often seeks to express truths about the human condition, society, or the natural world, making this statement too extreme and dismissive."
                    },
                    {
                        "text": "Beauty Equals Truth",
                        "explanation": "While Keats's line suggests a close relationship, equating beauty directly with truth oversimplifies the nuanced and often complex interplay between the two."
                    },
                    {
                        "text": "Art Cannot Convey Truth",
                        "explanation": "Art has historically been a powerful medium for conveying truths, from social and political commentary to personal and philosophical insights."
                    },
                    {
                        "text": "Beauty is Independent of Truth",
                        "explanation": "Although beauty can exist without an explicit truth, in many works of art, beauty and truth are intertwined, making this statement too categorical."
                    },
                    {
                        "text": "Truth Diminishes Beauty",
                        "explanation": "Truth does not necessarily diminish beauty; in many cases, revealing truth can enhance the beauty of a work of art by adding layers of meaning and depth."
                    },
                    {
                        "text": "Art is Only About Aesthetics",
                        "explanation": "Art encompasses more than just aesthetics; it often involves conveying messages, emotions, and truths, making this statement overly reductive."
                    },
                    {
                        "text": "Truth in Art is Irrelevant",
                        "explanation": "The relevance of truth in art varies by context and intent, but it is often a crucial element, providing substance and resonance beyond mere visual appeal."
                    },
                    {
                        "text": "Beauty is Incompatible with Truth",
                        "explanation": "Beauty and truth are not inherently incompatible; they can coexist and complement each other, enriching the artistic experience."
                    },
                    {
                        "text": "Art Should Avoid Truth",
                        "explanation": "Art often aims to explore and reveal truths, whether personal, social, or universal, making the avoidance of truth contrary to many artistic endeavors."
                    }
                ],
                "keywords": [
                    "beauty",
                    "truth",
                    "art",
                    "artist",
                    "perception",
                    "aesthetics",
                    "interpretation",
                    "harmony",
                    "subjectivity",
                    "revelation",
                    "dialectic",
                    "complement",
                    "expression",
                    "emotion",
                    "substance"
                ]
            }
        ]
     */
    getAllMetaQuestions(pid) {    
        return this.metaQuestionController.getAllMetaQuestions()
    }

    /**
     * return a list of appendixes of the user's course
     * @param pid - The process ID of the user performing the action
     * @throws {Error} - If the user is not signed in or does not have the necessary permissions
     * @return {Appendix[]} all the meta question of the user's course
     */
    getAllAppendixes(pid) {
        //TODO - implement
        return [
            { title: 'Appendix A', tag: 'General', content: 'Content of Appendix A' },
            { title: 'Appendix B', tag: 'Specific', content: 'Content of Appendix B' },
            // Add more appendices as needed
        ];
    }
    

}

module.exports = ApplicationFacade;
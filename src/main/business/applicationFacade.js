const UserController  = require('./UserManager/UserController.js' );
const TaskController = require('./TaskManager/TaskController.js');
const MetaQuestionController = require('./MetaQuestions/MetaQuestionController.js');
const ExamController = require('./ExamManager/ExamController.js');
const userTypes = require('../Enums').USER_TYPES
const { userRepo, metaQuestionsRepo, taskRepo, examRepo} = require("../DAL/Dal");
const { validateParameters } = require('../validateParameters.js');
const {USER_TYPES, PRIMITIVE_TYPES, ANSWER_TYPES, GENERATED_TASK_TYPES, CREATED_TASK_TYPES} = require("../Enums");
const {EMSError, TASK_PROCESS_ERROR_CODES} = require("../EMSError");
const {TASK_PROCESS_ERROR_MSGS} = require("../ErrorMessages");
const MetaQuestion = require('./MetaQuestions/MetaQuestion.js');
const Exam = require('./ExamManager/Exam.js');
const Question = require('./ExamManager/Question.js');
const ExamAnswer = require('./ExamManager/ExamAnswer.js');
const Answer = require('./MetaQuestions/Answer.js');
const { EXAM_CONSTANTS } = require('../constants.js');
const metaQuestionController = require("./MetaQuestions/MetaQuestionController");

class ApplicationFacade{
    constructor() {
        this.userController = new UserController(userRepo);
        this.metaQuestionController = new MetaQuestionController(metaQuestionsRepo);
        this.taskController = new TaskController(taskRepo, this.userController, this.metaQuestionController);
        this.examController = new ExamController(this.metaQuestionController, examRepo);
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
     * @param { {
     * questions:[
     *  {
        *  id:number,
        *  stem: string,
        *  appendix: SAppendix,
        *  key: {id: number, answer: string, explanation: string },
        *  distractors:{id: number, answer: string, explanation: string }[],
     *  }],
     * numVersions: number,
     * examReason: string  }} createExamProperties
     *
     * @throws {Error} - if there is no user with name @username
     *                 - if the user named username is not a lecturerUsername or is not assigned to a course
     *                 - if the course subject spread is not specified
     *                 - if there is not enough questions for a subject
     */
    async createExam(createExamProperties){
        await this.examController.createExamWithQuestions(createExamProperties)
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
     * @throws {Error} - if there is no user logged in data
     */
    async viewMyTasks(data) {
        const businessTasks = await this.taskController.getTasksOf(data);
        const feTasks = businessTasks.map(bTask => this.#taskBusinessToFE(bTask));
        return feTasks;
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
     */
    async addMetaQuestion(data) {
        validateParameters(data, {
            keywords: [PRIMITIVE_TYPES.STRING],
            keys: [{text: PRIMITIVE_TYPES.STRING, isTextRTL: PRIMITIVE_TYPES.BOOLEAN, isExplanationRTL: PRIMITIVE_TYPES.BOOLEAN}],
            distractors: [{text: PRIMITIVE_TYPES.STRING, isTextRTL: PRIMITIVE_TYPES.BOOLEAN, isExplanationRTL: PRIMITIVE_TYPES.BOOLEAN}],
            stem: PRIMITIVE_TYPES.STRING,
        });
        // case where an appendix is being created alongside the MQ
        if (data.appendix) {
            const businessAppendix = await this.metaQuestionController.createAppendix( {
                ...data.appendix,
                callingUser: data.callingUser,
            });
            data.appendixTag = businessAppendix.getTag();
        }
        data.answers = data.keys.map(k => ({...k, content: k.text, isContentRTL: k.isTextRTL, tag: ANSWER_TYPES.KEY}))
            .concat(data.distractors.map(d => ({...d, content: d.text, isContentRTL: d.isTextRTL, tag: ANSWER_TYPES.DISTRACTOR})));
        const businessMQ = await this.metaQuestionController.createMetaQuestion(data);
        const businessAppendix = businessMQ.getAppendixTag() ? await this.metaQuestionController.getAppendix(businessMQ.getAppendixTag()) : null;
        return this.#mqBusinessToFE(businessMQ, businessAppendix);
    }

    async editMetaQuestion(data) {
        validateParameters(data, {
            id: PRIMITIVE_TYPES.NUMBER,
            keywords: [PRIMITIVE_TYPES.STRING],
            keys: [{text: PRIMITIVE_TYPES.STRING, isTextRTL: PRIMITIVE_TYPES.BOOLEAN, isExplanationRTL: PRIMITIVE_TYPES.BOOLEAN}],
            distractors: [{text: PRIMITIVE_TYPES.STRING, isTextRTL: PRIMITIVE_TYPES.BOOLEAN, isExplanationRTL: PRIMITIVE_TYPES.BOOLEAN}],
            stem: PRIMITIVE_TYPES.STRING,
        })
        data.answers = data.keys.map(k => ({...k, content: k.text, isContentRTL: k.isTextRTL, tag: ANSWER_TYPES.KEY}))
            .concat(data.distractors.map(d => ({...d, content: d.text, isContentRTL: d.isTextRTL, tag: ANSWER_TYPES.DISTRACTOR})));
        data.appendixTag = (data.appendixTag || null);
        const businessMQ = await this.metaQuestionController.editMetaQuestion(data);
        const businessAppendix = businessMQ.getAppendixTag() ? await this.metaQuestionController.getAppendix(businessMQ.getAppendixTag()) : null;
        return this.#mqBusinessToFE(businessMQ, businessAppendix);
    }

    async deleteMetaQuestion(data) {
        validateParameters(data, {id: PRIMITIVE_TYPES.NUMBER})
        await this.metaQuestionController.deleteMetaQuestion(data);
    }

    async addAppendix(data) {
        const businessAppendix = await this.metaQuestionController.createAppendix( {
            ...data.appendix,
            callingUser: data.callingUser,
        });
        return this.#appendixBusinessToFE(businessAppendix)
    }

    async editAppendix(data) {
        const businessAppendix = await this.metaQuestionController.editAppendix( {
            ...data.appendix,
            callingUser: data.callingUser,
        });
        return this.#appendixBusinessToFE(businessAppendix)
    }

    async deleteAppendix(data) {
        validateParameters(data, {tag: PRIMITIVE_TYPES.STRING})
        await this.metaQuestionController.deleteAppendix(data);
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
     * @return all the meta question of the user's course
     */
    async getAllMetaQuestions(data) {
        const businessMQs = await this.metaQuestionController.getAllMetaQuestions();
        return await Promise.all(businessMQs.map(async bMQ =>
            this.#mqBusinessToFE(bMQ, bMQ.getAppendixTag() ? await this.metaQuestionController.getAppendix(bMQ.getAppendixTag()) : null)));
    }


    /**
     * return all preview exams (version 0)
     * @param {{callingUser:CallingUser}} getAllExamsProperties
     * @returns {Promise<SExam[]>}
     */
    async getAllExams(getAllExamsProperties){
        const bExams = await this.examController.getAllExams(getAllExamsProperties)
        return await Promise.all(bExams.map(bExam => this.#examBusinessToFE(bExam)))
    }

    /**
     *
     * @param {{callingUser:CallingUser, examId:number , version:number}} data
     * @returns {Promise<SExam>}
     */
    async getVersionedExam(data){
        const exam = await this.examController.getVersionedExam(data)
        return await this.#examBusinessToFE(exam)
    }

    /**
     * return a list of meta question relevant to add to the new exam:
     * - each question has at least 1 key and 4 distractors that are not used yet in the exam
     * - the keys and distractors returned are not used yet in the exam
     * @throws {Error} - If the user is not signed in or does not have the necessary permissions
     * @return {MetaQuestion[]} all the relevant question in a meta question structure
     */
    async getMetaQuestionsForExam(data) {
        // todo- implement
        // as of now we will return all the meta question without filtering
        return this.getAllMetaQuestions()
    }


    /**
     * return a list of appendices of the user's course
     * @throws {Error} - If the user is not signed in or does not have the necessary permissions
     * @return all the meta question of the user's course
     */

    async getAllAppendices(data) {
        const businessAppendices = await this.metaQuestionController.getAllAppendices();
        return businessAppendices.map(bAppendix => this.#appendixBusinessToFE(bAppendix));
    }

    async getMetaQuestionForAppendix(data) {
        validateParameters(data, {tag: PRIMITIVE_TYPES.STRING});
        data.appendixTag = data.tag;
        const businessMQs = await this.metaQuestionController.getMetaQuestionsForAppendix(data);
        return await Promise.all( businessMQs.map(async bMQ=>
            this.#mqBusinessToFE(bMQ, bMQ.getAppendixTag() ? await this.metaQuestionController.getAppendix(bMQ.getAppendixTag()) : null)));
    }

    async editUser(data){
        if (data.callingUser.username === data.userDetails.username) {
            const userDetails = data.userDetails;
            return this.userController.updateMyInfo(userDetails);
        }
        return this.userController.updateUser(data);
    }


    addManualMetaQuestionToExam(data) {
        //todo - implement save the question (it has all the fields)
        // as of now it just returns the question without saving it to an "current exam" object and so all the
        // functionality of fetching relevant questions/keys/distractors is not correct
        return {
            id: data.question.selectedMetaQuestion.id,
            stem: data.question.selectedMetaQuestion.stem,
            appendix: data.question.selectedMetaQuestion.appendix,
            key: data.question.selectedKey,
            distractors: data.question.selectedDistractors
        };
    }

    addAutomaticQuestionToExam(data) {
        //todo - implement generate a key and 4 distractors to the stem+appendix in the data
        // as of now it returns fake answers and distractors without
        // saving it to an "current exam" object and so all the functionality of fetching relevant
        // questions/keys/distractors is not correct
        return {
            id: data.question.selectedMetaQuestion.id,
            stem: data.question.selectedMetaQuestion.stem,
            appendix: data.question.selectedMetaQuestion.appendix,
            key: { text: "fake answer", explanation: "fake explanation"},
            distractors: [
                { text: "fake answer 1", explanation: "fake explanation"},
                { text: "fake answer 2", explanation: "fake explanation"},
                { text: "fake answer 3", explanation: "fake explanation"},
                { text: "fake answer 4", explanation: "fake explanation"}
            ]
        };
    }

    removeQuestionFromExam(data) {
        //todo - implement remove question
        // dont forget to update all the relevant questions/keys/distractors
        return;
    }

    async generateTask(data) {
        validateParameters(data, {taskType: PRIMITIVE_TYPES.STRING});
        switch (data.taskType) {
            case GENERATED_TASK_TYPES.TAG_ANSWER:
                return await this.#generateTagAnswerTask(data)
            default:
                throw new EMSError(TASK_PROCESS_ERROR_MSGS.INVALID_TASK_TYPE(data.taskType), TASK_PROCESS_ERROR_CODES.INVALID_TASK_TYPE);
        }
    }

    async completeGeneratedTask(data) {
        return await this.taskController.completeGeneratedTask(data);
    }

    async completeCreatedTask(data) {
        return await this.taskController.completeCreatedTask(data);
    }

    #userBusinessToFE(bUser) {
        return {
            username: bUser.getUsername(),
            firstName: bUser.getFirstName(),
            lastName: bUser.getLastName(),
            email: bUser.getEmail(),
            type: bUser.getUserType(),
        }
    }

    #mqBusinessToFE(bMQ, bAppendix) {
        return {
            id: bMQ.getId(),
            stem: bMQ.getStem(),
            isStemRTL: bMQ.isStemRTL(),
            keys: bMQ.getKeys().map(bKey => this.#answerBusinessToFE(bKey)),
            distractors: bMQ.getDistractors().map(bDistractor => this.#answerBusinessToFE(bDistractor)),
            keywords: bMQ.getKeywords(),
            ...(bAppendix && {appendix: this.#appendixBusinessToFE(bAppendix)}),
        }
    }

    /**
     * @param {Answer} bAnswer
     */
    #answerBusinessToFE(bAnswer){
        return {
            id: bAnswer.getId(),
            tag: bAnswer.getTag(),
            text: bAnswer.getContent(),
            explanation: (bAnswer.getExplanation() || ''),
            isTextRTL: bAnswer.isContentRTL(),
            isExplanationRTL: bAnswer.isExplanationRTL(),
        }
    }

    #appendixBusinessToFE(bAppendix) {
        return {
            tag: bAppendix.getTag(),
            title: bAppendix.getTitle(),
            content: bAppendix.getContent(),
            keywords: bAppendix.getKeywords(),
        }
    }

    #taskBusinessToFE(bTask) {
        // base
        const task = {
            taskId: bTask.taskId,
            superType: bTask.superType,
            type: bTask.type,
            creatingUser: this.#userBusinessToFE(bTask.creatingUser),
            ...(bTask.appendix && {appendix: this.#appendixBusinessToFE(bTask.appendix)}),
            ...(bTask.metaQuestion && {metaQuestion: this.#mqBusinessToFE(bTask.metaQuestion)}),
            ...(bTask.answer && {answer: this.#answerBusinessToFE(bTask.answer)}),
        }

        // specifics
        switch (task.type) {
            case CREATED_TASK_TYPES.EXPLANATION_COMPARISON:
                task.suggestedExplanation = bTask.suggestedExplanation;
                break;
            case CREATED_TASK_TYPES.TAG_REVIEW:
                task.suggestedExplanation = bTask.suggestedExplanation;
                task.suggestedTag = bTask.suggestedTag;
                break;
        }

        return task;
    }

    /**
     * @param {ExamAnswer} bExamAnswer
     * @returns {SExamAnswer}
     */
    #examAnswerBusinessToFE(bExamAnswer) {
        return {
            ...this.#answerBusinessToFE(bExamAnswer),
            ordinal: bExamAnswer.getOrdinal(),
            version: bExamAnswer.getVersion(),
        }
    }

    /**
     * @param {Question} bQuestion
     * @returns {Promise<SQuestion>}
     */
    async #questionBusinessToFE(bQuestion){
        const appendixTag = bQuestion.getMetaQuestion().getAppendixTag()
        const bAppendix = appendixTag ? await this.metaQuestionController.getAppendix(appendixTag) : null;
        return{
            id: bQuestion.getId(),
            mqId: bQuestion.getMetaQuestion().getId(),
            stem: bQuestion.getStem(),
            ordinal: bQuestion.getOrdinal(),
            ...(appendixTag && {appendix: this.#appendixBusinessToFE(bAppendix)}),
            answers: bQuestion.getAnswers().map(a=>this.#examAnswerBusinessToFE(a))
        }
    }

    /**
     * @param { Exam } bExam
     * @returns {Promise<SExam>}
     */
    async #examBusinessToFE(bExam){
        const questions = await Promise.all(bExam.getQuestions().map(q=>this.#questionBusinessToFE(q)))
        return{
            examId: bExam.getId(),
            questions,
            examReason: bExam.getExamReason(),
            numVersions: bExam.getNumVersions(),
        }
    }



    /* returns
    {
        answer,
        stem,
        appendix?
    }
     */
    async #generateTagAnswerTask(data) {
        const taskBusinessData = await this.taskController.generateTask(data);
        return {
            answer: this.#answerBusinessToFE(taskBusinessData.answer),
            stem: taskBusinessData.metaQuestion.getStem(),
            ...(taskBusinessData.appendix && {appendix: this.#appendixBusinessToFE(taskBusinessData.appendix)}),
        }
    }
}

module.exports = ApplicationFacade;
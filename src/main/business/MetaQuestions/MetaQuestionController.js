const MetaQuestion = require('./MetaQuestion')
const Appendix = require('./Appendix')
const {TaskTypes, TaskPriority} = require('../TaskManager/Task')
const {ANSWER_TYPES, PRIMITIVE_TYPES} = require("../../Enums");
const {validateParameters} = require("../../validateParameters");

class MetaQuestionController{
    #taskController;
    #userController;
    #metaQuestionRepo

    constructor(metaQuestionRepo, taskController,userController) {
        this.#metaQuestionRepo = metaQuestionRepo;
        this.#taskController = taskController;
        this.#userController = userController;
    }

    async createAppendix(data) {
        validateParameters(data, {
            keywords: [PRIMITIVE_TYPES.STRING],
            tag: PRIMITIVE_TYPES.STRING,
            title: PRIMITIVE_TYPES.STRING,
            content: PRIMITIVE_TYPES.STRING,
        });

        const dalAppendix = await this.#metaQuestionRepo.addAppendix(data, data.keywords);
        return new Appendix(dalAppendix);
    }

    /**
     * Updates a given appendix with new data (keywords, title, content)
     * @param data
     * @return {Promise<Appendix>} The updated appendix
     */
    async editAppendix(data) {
        validateParameters(data, {
            keywords: [PRIMITIVE_TYPES.STRING],
            tag: PRIMITIVE_TYPES.STRING,
        });

        const dalAppendix = await this.#metaQuestionRepo.setKeywordsToAppendix(data.tag, data.keywords)
        const appendix = new Appendix(dalAppendix);
        if (data.title) {
            await appendix.setTitle(data.title);
        }
        if (data.content) {
            await appendix.setContent(data.content);
        }
        return appendix;
    }

    async createMetaQuestion(data) {
        validateParameters(data, {
            keywords: [PRIMITIVE_TYPES.STRING],
            answers: [{content: PRIMITIVE_TYPES.STRING, tag: PRIMITIVE_TYPES.STRING}],
            stem: PRIMITIVE_TYPES.STRING,
        });

        const dalMQ = await this.#metaQuestionRepo.addMetaQuestion(data, data.answers, data.keywords);

        let metaQuestion = new MetaQuestion(dalMQ);

        let ta_s = (await this.#userController.getAllStaff(data))["TAs"];
        const addTaskProperties = {...data,
             assignedUsers: ta_s, taskType: TaskTypes.ADD_KEY,
              taskPriority: TaskPriority.HIGH, description: `Please add a key For the following Question: ${metaQuestion.getStem()}`,
            metaQuestion: metaQuestion}
        this.#taskController.addTask(addTaskProperties)
        return metaQuestion
    }

    async editMetaQuestion(data) {
        validateParameters(data, {
            id: PRIMITIVE_TYPES.NUMBER,
            keywords: [PRIMITIVE_TYPES.STRING],
            answers: [{content: PRIMITIVE_TYPES.STRING, tag: PRIMITIVE_TYPES.STRING}],
            stem: PRIMITIVE_TYPES.STRING,
        });
        await this.#metaQuestionRepo.setKeywordsToQuestion(data.id, data.keywords);
        await this.#metaQuestionRepo.deleteAnswersOfMq(data.id)
        await this.#metaQuestionRepo.addAnswersToQuestion(data.id, data.answers);
        const metaQuestion = await this.getMetaQuestion(data.id);
        await metaQuestion.setStem(data.stem);

        let ta_s = (await this.#userController.getAllStaff(data))["TAs"];
        const addTaskProperties = {...data,
            assignedUsers: ta_s, taskType: TaskTypes.ADD_KEY,
            taskPriority: TaskPriority.HIGH, description: `Please please review the changes to the following Question: ${metaQuestion.getStem()}`,
            metaQuestion: metaQuestion}
        this.#taskController.addTask(addTaskProperties)

        return metaQuestion;
    }

    async getAllMetaQuestions(){
        const dalMQs = await this.#metaQuestionRepo.getAllMetaQuestions()
        return dalMQs.map(dalMQ => new MetaQuestion(dalMQ));
    }

    async getMetaQuestion(mqId) {
        const dalMQ = await this.#metaQuestionRepo.getMetaQuestion(mqId);
        return new MetaQuestion(dalMQ);
    }

    async getAllAppendices(){
        const dalAppendices = await this.#metaQuestionRepo.getAllAppendices()
        return dalAppendices.map(dalAppendix => new Appendix(dalAppendix));
    }

    async getAppendix(appendixTag) {
        const dalAppendix = await this.#metaQuestionRepo.getAppendix(appendixTag);
        return new Appendix(dalAppendix);
    }

    async getMetaQuestionsForAppendix(data){
        validateParameters(data, {appendixTag: PRIMITIVE_TYPES.STRING});
        const dalMQs = await this.#metaQuestionRepo.getMetaQuestionsForAppendix(data.appendixTag);
        return dalMQs.map(dalMQ => new MetaQuestion(dalMQ));
    }
}

module.exports = MetaQuestionController;


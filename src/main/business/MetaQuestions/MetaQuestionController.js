const MetaQuestion = require('./MetaQuestion')
const {TaskTypes, TaskPriority} = require('../TaskManager/Task')
const {getAllAppendices} = require("../../service");

class MetaQuestionController{
    #metaQuestions;
    #appendices;
    #taskController;
    #userController;
    #metaQuestionId;

    constructor(taskController,userController){
        this.#metaQuestions = new Map();
        this.#appendices = new Map();
        this.#taskController = taskController;
        this.#userController = userController;
        this.#metaQuestionId = 1
    }

    async createMetaQuestion(data) {
        // create a new metaQuestion
        data.id = this.#metaQuestionId;
        if (data.appendix) {
            if (this.#appendices.has(data.appendix.tag)) {
                data.appendix = this.#appendices.get(data.appendix.tag);
            } else {
                this.#appendices.set(data.appendix.tag, data.appendix);
            }
        }
        let metaQuestion = new MetaQuestion(data);
        this.#metaQuestions.set(this.#metaQuestionId, metaQuestion);
        let ta_s = (await this.#userController.getAllStaff(data))["TAs"];
        const addTaskProperties = {...data,
             assignedUsers: ta_s, taskType: TaskTypes.ADD_KEY,
              taskPriority: TaskPriority.HIGH, description: `Please add a key For the following Question: ${metaQuestion.stem}`,
            metaQuestion: metaQuestion}
        this.#taskController.addTask(addTaskProperties)
        this.#metaQuestionId = this.#metaQuestionId + 1
        return metaQuestion
    }

    async editMetaQuestion(data) {
        let metaQuestion = new MetaQuestion(data);
        this.#metaQuestions.set(data.id, metaQuestion);
        let ta_s = (await this.#userController.getAllStaff(data))["TAs"];
        const addTaskProperties = {...data,
            assignedUsers: ta_s, taskType: TaskTypes.ADD_KEY,
            taskPriority: TaskPriority.HIGH, description: `Please please review the changes to the following Question: ${metaQuestion.stem}`,
            metaQuestion: metaQuestion}
        this.#taskController.addTask(addTaskProperties)
    }

    #saveMetaQuestions(){
        //save to session storage
        let metaQuestionsArray = Array.from(this.#metaQuestions.values())
        sessionStorage.setItem('metaQuestions', JSON.stringify(metaQuestionsArray))
    }

    getAllMetaQuestions(){
        return Array.from(this.#metaQuestions.values())
    }

    getAllAppendices(data){
        return [...this.#appendices.values()];
    }

    getAppendix(appendixTag) {
        return this.#appendices.get(appendixTag);
    }

    getMetaQuestionForAppendix(appendix){
        return this.getAllMetaQuestions()
            .filter(metaQuestion => metaQuestion.getAppendix() && this.#deepEqualAppendix(metaQuestion.getAppendix(), appendix))
    }

    #deepEqualAppendix = (a, b) => (
        a.title === b.title && a.tag === b.tag && a.content === b.content
    );

}

module.exports = MetaQuestionController;


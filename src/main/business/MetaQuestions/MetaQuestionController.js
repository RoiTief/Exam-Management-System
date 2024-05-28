const MetaQuestion = require('./MetaQuestion')
const {TaskTypes, TaskPriority} = require('../TaskManager/Task')

class MetaQuestionController{
    #metaQuestions;
    #taskController;
    #userController;

    constructor(taskController,userController){
        this.#metaQuestions = [];
        this.#taskController = taskController;
        this.#userController = userController;
        this.metaQuestionIds = 0
    }

    createMetaQuestion(metaQuestionProperties) {
        // create a new metaQuestion
        let metaQuestion = new MetaQuestion(metaQuestionProperties);
        this.#metaQuestions.push(metaQuestion);
        const ta_s = this.#userController.getAllStaff(metaQuestionProperties.pid)["TAs"]

        const addTaskProperties = {...metaQuestionProperties,
             assignedUsers: ta_s, taskType: TaskTypes.ADD_KEY,
              taskPriority: TaskPriority.high, description: "Please add a key"}
        this.#taskController.addTask(addTaskProperties)
        this.metaQuestionIds = this.metaQuestionIds + 1
        return metaQuestion
    }

    #saveMetaQuestions(){
        //save to session storage
        let metaQuestionsArray = Array.from(this.#metaQuestions)
        sessionStorage.setItem('metaQuestions', JSON.stringify(metaQuestionsArray))
    }

    getAllMetaQuestions(){
        return this.#metaQuestions
    }
}

module.exports = MetaQuestionController;


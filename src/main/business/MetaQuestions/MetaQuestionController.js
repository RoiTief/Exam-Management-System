const MetaQuestion = require('./MetaQuestion')
const {TaskTypes, TaskPriority} = require('../TaskManager/Task')

class MetaQuestionController{
    #metaQuestions;
    #taskController;
    #userController;

    constructor(taskController,userController){
        this.#metaQuestions = new Map();
        this.#taskController = taskController;
        this.#userController = userController;
        this.metaQuestionIds = 0
    }

    createMetaQuestion(metaQuestionProperties) {
        // create a new metaQuestion
        let metaQuestion = new MetaQuestion(metaQuestionProperties);

        //set the id of the metaQuestion
        metaQuestion.id = this.metaQuestionIds;
        this.#metaQuestions.set(metaQuestion.id, metaQuestion);
        const ta_s = this.#userController.getAllStaff(metaQuestionProperties.pid)["TAs"]

        const addTaskProperties = {...metaQuestionProperties,
             assignedUsers: ta_s, taskType: TaskTypes.addKey,
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

    getCourse(metaQuestionId){
        if(!this.#metaQuestions.has(metaQuestionId)){
            throw Error("No meta questions found")
        }
        return this.#metaQuestions.get(metaQuestionId);
    }
}

module.exports = MetaQuestionController;


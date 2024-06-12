const MetaQuestion = require('./MetaQuestion')
const {TaskTypes, TaskPriority} = require('../TaskManager/Task')

class MetaQuestionController{
    #metaQuestions;
    #taskController;
    #userController;
    #metaQuestionId;

    constructor(taskController,userController){
        this.#metaQuestions = new Map();
        this.#taskController = taskController;
        this.#userController = userController;
        this.#metaQuestionId = 1
    }

    createMetaQuestion(data) {
        // create a new metaQuestion
        data = {...data, id: this.#metaQuestionId}
        let metaQuestion = new MetaQuestion(data);
        this.#metaQuestions.set(this.#metaQuestionId, metaQuestion);
        const ta_s = this.#userController.getAllStaff(data)["TAs"]

        const addTaskProperties = {...data,
             assignedUsers: ta_s, taskType: TaskTypes.ADD_KEY,
              taskPriority: TaskPriority.HIGH, description: `Please add a key For the following Question: ${metaQuestion.stem}`,
            metaQuestion: metaQuestion}
        this.#taskController.addTask(addTaskProperties)
        this.#metaQuestionId = this.#metaQuestionId + 1
        return metaQuestion
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
        return this.getAllMetaQuestions()
            .map(metaQuestion => metaQuestion.getAppendix())
            .filter(appendix => appendix) // remove null and undefined

         
    }
    
}

module.exports = MetaQuestionController;


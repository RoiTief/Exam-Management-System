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

    createMetaQuestion(pid, metaQuestionProperties) {
        // create a new metaQuestion
        metaQuestionProperties = {...metaQuestionProperties, id: this.#metaQuestionId}
        let metaQuestion = new MetaQuestion(metaQuestionProperties);
        this.#metaQuestions.set(this.#metaQuestionId, metaQuestion);
        const ta_s = this.#userController.getAllStaff(pid)["TAs"]

        const addTaskProperties = {...metaQuestionProperties,
             assignedUsers: ta_s, taskType: TaskTypes.ADD_KEY,
              taskPriority: TaskPriority.high, description: "Please add a key"}
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
        const a =  Array.from(this.#metaQuestions.values())
        
        return a
    }

    getAllAppendixes(pid){
        const metaQuestions = this.getAllMetaQuestions()
        let appendixes = metaQuestions.map(metaQuestion => metaQuestion.getAppendix(pid))
        appendixes = appendixes.filter(appendix => appendix) // remove null and undefined
        return appendixes
    }
    
}

module.exports = MetaQuestionController;


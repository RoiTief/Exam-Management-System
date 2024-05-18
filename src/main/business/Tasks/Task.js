
/*
Add key
Add distractors

Check key 
Check distractors

Add explanation (for each answer, correct or wrong)

each task can be assign to many people


A question should be take only from checked question (enough done the task)

only after the course manager says that the task is  complete it will be complete

if there is a wrong question, we can use it as distractors
*/

const TASK_TYPES = {
    ADD_KEY: "Add Key",
}

const PRIORITIES = {
    HIGH: "High",
    MEDIUM: "Medium",
    LOW: "Low"
}


class Task {
    constructor(taskProperties) {
        this._taskId = taskProperties.taskId;
        this._priority = taskProperties.priority;
        this._description = taskProperties.description;
        this._pendingUsers = taskProperties.pendingUsers;
        this._doneUsers = taskProperties.doneUsers;
        this._finished = taskProperties.finished;
        this._db = taskProperties.taskDb
    }

    async userDoneA(username) {
        this._pendingUsers = this._pendingUsers.filter(user => user !== username)
        this._doneUsers.push(username)
        await this._db.update(this)
    }
    async changeFinished(newValue) {
        this._finished = newValue
        await this._db.update(this)
    }
    async changePriority(priority){
        this._priority = priority
        await this._db.update(this)
    }
    async changeDescription(description){
        this._description = description
        await this._db.update(this)
    }
    
}



module.exports = { Task, TASK_TYPES, PRIORITIES };

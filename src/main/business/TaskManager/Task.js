
const TaskTypes = {
    LECTURER_REQUEST: "lecturerRequest",
    NEW_TA_REQUEST: "newTARequest",
    ADD_KEY: "addKey"
}

const TaskPriority = {
    LOW: "low",
    MEDIUM: "medium",
    HIGH: "high"
}

class Task {
    constructor(addTaskProperty) {
        this.taskId = addTaskProperty.taskId 
        this.forWhom = addTaskProperty.forWhom 
        this.taskPriority = addTaskProperty.taskPriority 
        this.type = addTaskProperty.type 
        this.properties = addTaskProperty.properties ?? {}
        this.description = addTaskProperty.description 
        this.assignedUsers = addTaskProperty.assignedUsers ?? []
        this.action = addTaskProperty.action 
        this.finished = addTaskProperty.finished ?? false
        this.options = addTaskProperty.options 
        this.response = addTaskProperty.response ,
        this.metaQuestion = addTaskProperty.metaQuestion
    }
}
module.exports = {Task, TaskTypes, TaskPriority};

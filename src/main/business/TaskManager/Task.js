
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
        this.taskId = addTaskProperty.taskId ??  null
        this.forWhom = addTaskProperty.forWhom ?? null
        this.taskPriority = addTaskProperty.taskPriority ?? null
        this.type = addTaskProperty.type ?? null
        this.properties = addTaskProperty.properties ?? {}
        this.description = addTaskProperty.description ?? null
        this.assignedUsers = addTaskProperty.assignedUsers ?? []
        this.action = addTaskProperty.action ?? null
        this.finished = addTaskProperty.false ?? null
        this.options = addTaskProperty.options ?? null
        this.response = addTaskProperty.response ?? null,
        this.metaQuestion = addTaskProperty.metaQuestion
    }
}
module.exports = {Task, TaskTypes, TaskPriority};

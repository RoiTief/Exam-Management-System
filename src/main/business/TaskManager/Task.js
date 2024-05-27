
const TaskTypes = {
    lecturerRequest: "lecturerRequest",
    newTARequest: "newTARequest",
    addKey: "addKey"
}

const TaskPriority = {
    low: "low",
    medium: "medium",
    high: "high"
}

class Task {
    constructor(addTaskProperty) {
        this.taskId = addTaskProperty.taskId ??  null
        this.forWhom = addTaskProperty.forWhom ?? null
        this.taskPriority = addTaskProperty.taskPriority ?? null
        this.type = addTaskProperty.type ?? null
        this.properties = addTaskProperty.properties ?? null
        this.description = addTaskProperty.description ?? null
        this.assignedUsers = addTaskProperty.assignedUsers ?? null
        this.action = addTaskProperty.action ?? null
        this.finished = addTaskProperty.false ?? null
        this.options = addTaskProperty.options ?? null
        this.response = addTaskProperty.null ?? null
    }

}

module.exports = {Task, TaskTypes, TaskPriority};

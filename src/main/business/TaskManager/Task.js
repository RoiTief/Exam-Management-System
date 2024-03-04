
const TaskTypes = {
    courseAdminRequest: "courseAdminRequest",
    newTARequest: "newTARequest"
}

class Task {
    constructor(taskId, forWhom, priority, type, properties, description, options, assignedUser, action) {
        this.taskId = taskId
        this.forWhom = forWhom;
        this.priority = priority;
        this.type = type
        this.properties = properties;
        this.description = description;
        this.assignedUser = assignedUser;
        this.action = action
        this.finished = false;
        this.options = options;
        this.response = null;
    }

}

module.exports = {Task, TaskTypes};


const TaskTypes = {
    courseAdminRequest: "courseAdminRequest"
}

class Task {
    constructor(forWhom, priority, type, properties, description, assignedUser, action) {
        this.forWhom = forWhom;
        this.priority = priority;
        this.type = type
        this.properties = properties;
        this.description = description;
        this.assignedUser = assignedUser;
        this.action = action
        this.finished = false;
    }

}




class TaskController {


    constructor(){
        this._tasks = new Map();
        this._id = 1
    }

    addTask(forWhom, priority, type, properties, description, assignedUser, action){
        this._tasks.set(forWhom, new Task(this._id, forWhom, priority, type, properties, description, assignedUser, action));
        // this._saveTasks()
        this._id += 1
        return true;
    }

    addTaskToSpecificUser(forWhom, priority, type, properties, description, assignedUser, action){
        this._tasks.set(assignedUser, new Task(this._id, forWhom, priority, type, properties, description, assignedUser, action));
        // this._saveTasks()
        this._id += 1
        return true;
    }

    _saveTasks(){
        //save to session storage
        let tasksArray = Array.from(this._tasks)
        sessionStorage.setItem('tasks', JSON.stringify(tasksArray))

    }

    getTask(taskId){
        return this._tasks.get(taskId);
    }

    courseAdminRequestTask(courseAdminUsername, course) {
        this.addTaskToSpecificUser(null, 0, TaskTypes.courseAdminRequest, course.properties,
            "if you accept this request you will be the course admin of course "+course.properties.courseName+", do notice that this will overrun you current course assignment",
            courseAdminUsername, (applicationFacade, response) => {
                                            if(response === "yes")
                                                applicationFacade.setUserAsCourseAdmin(courseAdminUsername, course)
                                                });
    }

    newTARequestTask(TAUsername, courseId) {
        this.addTaskToSpecificUser(null, 0, TaskTypes.newTARequest, [courseId],
            "if you accept this request you will be a TA in course number "+courseId,
            TAUsername, (applicationFacade, approved) => {
                if(approved === "yes")
                    applicationFacade.setUserAsTA(TAUsername, courseId)
            });
    }

    finishTask(username, taskId, response, applicationFacade) {
        let task = this.getTask(taskId)
        if(task === undefined)
            throw new Error("there is no task with this id");
        if(task.assignedUser !== username)
            throw new Error("the task is not assigned to you!")
        task.action(applicationFacade, response);
        task.finished = true;
    }


}

module.exports = TaskController;




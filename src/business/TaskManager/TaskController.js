

class TaskController {


    constructor(){
        let tasks = JSON.parse(sessionStorage.getItem('tasks'))
        this._tasks = new Map(tasks);
        this._id = 1
    }

    addTask(forWhom, priority, type, properties, description, assignedUser, action){
        this._tasks.set(this._id, new Task(forWhom, priority, type, properties, description, assignedUser, action));
        this._saveTasks()
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

    courseAdminRequestTask(courseAdminUsername, courseID, courseName) {
        this.addTask(null, 0, TaskTypes.courseAdminRequest, [courseID, courseName],
            "if you accept this request you will be the course admin of course %s, do notice that this will overrun you current course assignment",
            courseAdminUsername, (applicationFacade, approved) => {
                                            if(approved === "yes")
                                                applicationFacade.setUserAsCourseAdmin(courseAdminUsername, courseID)
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



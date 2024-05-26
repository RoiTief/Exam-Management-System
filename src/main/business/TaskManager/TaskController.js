var {Task} = require('./Task')
var {TaskTypes} = require('./Task')

class TaskController {


    constructor(){
        this._tasks = new Map();
        this._id = 1
    }

    addTask(forWhom, priority, type, properties, description, options, assignedUser, action){
        this._tasks.set(this._id, new Task(this._id, forWhom, priority, type, properties, description, options, assignedUser, action));
        this._id += 1
        return true;
    }

    addTaskToSpecificUser(forWhom, priority, type, properties, description, options, assignedUser, action){
        this._tasks.set(this._id, new Task(this._id, forWhom, priority, type, properties, description, options, assignedUser, action));
        this._id += 1
        return true;
    }

    getTask(taskId){
        return this._tasks.get(taskId);
    }

    getTasksOf(username){
        return Array.from(this._tasks.values()).filter(
            task => task.assignedUser === username
        );
    }

    courseAdminRequestTask(courseAdminUsername) {
        this.addTaskToSpecificUser(null, 0, TaskTypes.courseAdminRequest,
            "if you accept this request you will be the course admin, do notice that this will overrun you current course assignment",
            ["yes", "no"],
            courseAdminUsername, (applicationFacade, response) => {
                                            if(response === "yes")
                                                applicationFacade.setUserAsCourseAdmin(courseAdminUsername)
                                                });
    }

    newTARequestTask(TAUsername) {
        this.addTaskToSpecificUser(null, 0, TaskTypes.newTARequest,
            "if you accept this request you will be a TA",
            ["yes", "no"],
            TAUsername, (applicationFacade, approved) => {
                if(approved === "yes")
                    applicationFacade.setUserAsTA(TAUsername)
            });
    }

    newGraderRequestTask(graderUsername) {
        this.addTaskToSpecificUser(null, 0, TaskTypes.newGraderRequestTask,
            "if you accept this request you will be a grader",
            ["yes", "no"],
            graderUsername, (applicationFacade, approved) => {
                if(approved === "yes")
                    applicationFacade.setUserAsGrader(graderUsername)
            });
    }

    finishTask(username, taskId, response, applicationFacade) {
        let task = this.getTask(taskId)
        if(task === undefined)
            throw new Error("there is no task with this id");
        if(task.assignedUser !== username)
            throw new Error("the task is not assigned to you!")
        task.response = response;
        task.action(applicationFacade, response);
        task.finished = true;
    }


}

module.exports = TaskController;




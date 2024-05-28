var {Task} = require('./Task')
var {TaskTypes} = require('./Task')

class TaskController {


    constructor(){
        this._tasks = new Map();
        this._id = 1
    }

    addTask(addTaskProperties){
        const task = new Task(addTaskProperties)
        this._tasks.set(this._id, task);
        this._id += 1
        return task;
    }

    addTaskToSpecificUser(forWhom, priority, type, properties, description, options, assignedUsers, action){
        this._tasks.set(this._id, new Task(this._id, forWhom, priority, type, properties, description, options, assignedUsers, action));
        this._id += 1
        return true;
    }

    getTask(taskId){
        return this._tasks.get(taskId);
    }

    getTasksOf(username){
        return Array.from(this._tasks.values()).filter(
            task => task.assignedUsers.includes(username) 
        );
    }

    lecturerRequestTask(lecturerUsername) {
        this.addTaskToSpecificUser(null, 0, TaskTypes.LECTURER_REQUEST,
            "if you accept this request you will be the lecturer, do notice that this will overrun you current course assignment",
            ["yes", "no"],
            lecturerUsername, (applicationFacade, response) => {
                                            if(response === "yes")
                                                applicationFacade.setUserAsLecturer(lecturerUsername)
                                                });
    }

    newTARequestTask(TAUsername) {
        this.addTaskToSpecificUser(null, 0, TaskTypes.NEW_TA_REQUEST,
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
        if(task.assignedUsers.includes(username))
            throw new Error("the task is not assigned to you!")
        task.response = response;
        task.action(applicationFacade, response);
        task.finished = true;
    }


}

module.exports = TaskController;




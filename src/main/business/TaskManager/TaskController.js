const { validateParameters } = require('../../validateParameters');
var {Task} = require('./Task')
var {TaskTypes} = require('./Task')

class TaskController {


    constructor(){
        this._tasks = new Map();
        this._id = 1
    }

    addTask(addTaskProperties){
        addTaskProperties = {...addTaskProperties, taskId: this._id}
        const task = new Task(addTaskProperties)
        this._tasks.set(this._id, task);
        this._id += 1
        return task;
    }

    addTaskToSpecificUser(forWhom, priority, type, properties, description, options, assignedUsers, action){
        const taskProperties = {taskId : this._id,forWhom, priority, type, properties, description, options, assignedUsers, action}
        this._tasks.set(this._id, new Task(taskProperties));
        this._id += 1
        return true;
    }

    getTask(taskId){
        return this._tasks.get(taskId);
    }

    getTasksOf(data){
        validateParameters(data,{})
        
        return Array.from(this._tasks.values())
            .filter(task=>task.assignedUsers) // remove task without assigned users
            .filter(task => task.assignedUsers.map(user=>user.getUsername()).includes(data.callingUser.username)) // check if username is in the assignedUsers
    }

    lecturerRequestTask(lecturerUsername) {
        this.addTaskToSpecificUser(null, 0, TaskTypes.LECTURER_REQUEST, {},
            "if you accept this request you will be the lecturer, do notice that this will overrun you current course assignment",
            ["yes", "no"],
            [lecturerUsername], (applicationFacade, response) => {
                                            if(response === "yes")
                                                applicationFacade.setUserAsLecturer(lecturerUsername)
                                                });
    }

    newTARequestTask(TAUsername) {
        this.addTaskToSpecificUser(null, 0, TaskTypes.NEW_TA_REQUEST,{},
            "if you accept this request you will be a TA",
            ["yes", "no"],
            [TAUsername], (applicationFacade, approved) => {
                if(approved === "yes")
                    applicationFacade.setUserAsTA(TAUsername)
            });
    }

    newGraderRequestTask(graderUsername) {
        this.addTaskToSpecificUser(null, 0, TaskTypes.newGraderRequestTask,{},
            "if you accept this request you will be a grader",
            ["yes", "no"],
            [graderUsername], (applicationFacade, approved) => {
                if(approved === "yes")
                    applicationFacade.setUserAsGrader(graderUsername)
            });
    }

    finishTask(data, applicationFacade) {
        validateParameters(data,{
            taskId: "number",
            response: "string",
        })
        let task = this.getTask(data.taskId)
        if(task === undefined)
            throw new Error("there is no task with this id");
        if(task.assignedUsers.includes(data.callingUser.username))
            throw new Error("the task is not assigned to you!")
        task.response = data.response;
        if(task.action) 
            task.action(applicationFacade, data.response);
        task.finished = true;
    }


}

module.exports = TaskController;




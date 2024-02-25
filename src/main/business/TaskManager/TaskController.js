var {Task} = require('./Task')
var {TaskTypes} = require('./Task')

class TaskController {


    constructor(){
        this._tasks = new Map();
        this._id = 1
    }

    addTask(forWhom, priority, type, properties, description, assignedUser, action){
        this._tasks.set(this._id, new Task(this._id, forWhom, priority, type, properties, description, assignedUser, action));
        this._id += 1
        return true;
    }

    addTaskToSpecificUser(forWhom, priority, type, properties, description, assignedUser, action){
        this._tasks.set(this._id, new Task(this._id, forWhom, priority, type, properties, description, assignedUser, action));
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

    courseAdminRequestTask(courseAdminUsername, course) {
        this.addTaskToSpecificUser(null, 0, TaskTypes.courseAdminRequest, course.properties,
            "if you accept this request you will be the course admin of course "+course.properties.courseName+", do notice that this will overrun you current course assignment",
            courseAdminUsername, (applicationFacade, response) => {
                                            if(response === "yes")
                                                applicationFacade.setUserAsCourseAdmin(courseAdminUsername, course)
                                                });
    }

    newTARequestTask(TAUsername, course) {
        this.addTaskToSpecificUser(null, 0, TaskTypes.newTARequest, [course],
            "if you accept this request you will be a TA in course number "+course.courseId,
            TAUsername, (applicationFacade, approved) => {
                if(approved === "yes")
                    applicationFacade.setUserAsTA(TAUsername, course)
            });
    }

    newGraderRequestTask(graderUsername, course) {
        this.addTaskToSpecificUser(null, 0, TaskTypes.newTARequest, [course],
            "if you accept this request you will be a TA in course number "+course.courseId,
            graderUsername, (applicationFacade, approved) => {
                if(approved === "yes")
                    applicationFacade.setUserAsGrader(graderUsername, course)
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




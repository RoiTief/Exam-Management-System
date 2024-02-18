

class TaskController {


    constructor(){
        let tasks = JSON.parse(sessionStorage.getItem('tasks'))
        this._tasks = new Map(tasks);
        this._id = 1
    }

    addTask(forWhom, type, priority, properties, description, designatedUser, stage){
        this._tasks.set(this._id, new Task(forWhom, type, priority, properties, description, designatedUser, stage));
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

}



const AddKeyTask = require('./AddKeyTask');
const FixedSizeMap = require("fixedsize-map"); // cyclic map with limited place
const { TASK_TYPES } = require('./Task');

// In the end of any async function name will be 'A'
// Constants
const TASKS_CACHE_SIZE = 200

class TaskController {
    static TaskTypeToConstructorMap = { [TASK_TYPES.ADD_KEY]: AddKeyTask }

    constructor(taskDb) {
        this._tasksCache = new FixedSizeMap(TASKS_CACHE_SIZE);
        this._taskDb = taskDb
    }

    async addTaskA(taskProperties) {
        try {
            const taskId = await this._taskDb.saveTask(taskProperties)
            taskProperties = { ...taskProperties, taskId, taskDb: this._taskDb };
            const task = new TaskConstructorMap[taskProperties.type](taskProperties) // dynamically use the constructor of taskProperties.type
            this._tasksCache.add(taskId, task);
            console.log("Add task successfully")
        }
        catch (e) {
            console.error(`Could not add new task \n${e.name}: ${e.message}`);
        }
    }


    async getTaskByIdA(taskId) {
        if (this._tasksCache.contains(taskId))
            return this._tasksCache.get(taskId)

        return await this._taskDb.getTaskById(taskId)
    }

    async getUserTasksA(username, options) {
        return await this._taskDb.getUserTasks(username, options)
    }

    async userDoneTaskA(username, taskId) {
        const task = await this.getTaskByIdA(taskId)
        await task.userDoneA(username)
    }

}

module.exports = TaskController;
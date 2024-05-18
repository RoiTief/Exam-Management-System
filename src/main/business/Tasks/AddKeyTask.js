const { Task } = require("./Task");

class AddKeyTask extends Task{
    constructor(taskProperties){
        super(taskProperties)
        this._metaQuestion = taskProperties.metaQuestion
    }
}


module.exports = AddKeyTask;
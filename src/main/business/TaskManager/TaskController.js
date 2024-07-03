const { validateParameters } = require('../../validateParameters');
var {Task} = require('./Task')
var {TaskTypes} = require('./Task')
const {PRIMITIVE_TYPES, GENERATED_TASK_TYPES, ANSWER_TYPES, USER_TYPES, CREATED_TASK_TYPES} = require("../../Enums");
const {EMSError, TASK_PROCESS_ERROR_CODES, USER_PROCESS_ERROR_CODES} = require("../../EMSError");
const {TASK_PROCESS_ERROR_MSGS} = require("../../ErrorMessages");

class TaskController {
    #taskRepo
    #mqController

    constructor(taskRepository, metaQuestionsController){
        this.#taskRepo = taskRepository;
        this.#mqController = metaQuestionsController;
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

    async generateTask(data) {
        validateParameters(data, {taskType: PRIMITIVE_TYPES.STRING});
        switch (data.taskType) {
            case GENERATED_TASK_TYPES.TAG_ANSWER:
                return await this.#generateTagAnswerTask(data)
            default:
                throw new EMSError(TASK_PROCESS_ERROR_MSGS.INVALID_TASK_TYPE(data.taskType), TASK_PROCESS_ERROR_CODES.INVALID_TASK_TYPE);
        }
    }

    async createRoleTask(data) {
        validateParameters(data,
            {
                role: PRIMITIVE_TYPES.STRING,
                leaveOpen: PRIMITIVE_TYPES.BOOLEAN,
                taskData: {taskType: PRIMITIVE_TYPES.STRING}
            });
        data.creatingUser = data.callingUser.username;
        await this.#taskRepo.createRoleTask(data);
    }

    async completeGeneratedTask(data) {
        validateParameters(data, {taskType: PRIMITIVE_TYPES.STRING});
        switch (data.taskType) {
            case GENERATED_TASK_TYPES.TAG_ANSWER:
                return await this.#completeTagAnswerTask(data);
            default:
                throw new EMSError(TASK_PROCESS_ERROR_MSGS.INVALID_TASK_TYPE(data.taskType), TASK_PROCESS_ERROR_CODES.INVALID_TASK_TYPE);
        }
    }

    /* returns
    {
        answer,
        metaQuestion,
        appendix?
    }
     */
    async #generateTagAnswerTask(data) {
        const callingUser = data.callingUser;
        let chosenAnswer;

        // choose answer from untagged answers
        const untaggedDalAnswers = await this.#taskRepo.getUntaggedAnswersOf(callingUser.username);
        if (untaggedDalAnswers.length > 0) {
            const chosenDalAnswer = untaggedDalAnswers[Math.floor(Math.random() * untaggedDalAnswers.length)]; // random answer
            chosenAnswer = await this.#mqController.getAnswer(chosenDalAnswer.id);
        } else {
            //choose oldest tagged answer (maybe tasker learned something new? or least probable he remembers what he tagged)
            const userTags = await this.#taskRepo.getUserTags(callingUser.username);
            if (userTags.length === 0) { // no untagged AND no tagged answers <==> 0 answers in the system
                throw new EMSError(TASK_PROCESS_ERROR_MSGS.INSUFFICIENT_CONTENT_TO_GENERATE_TASK, TASK_PROCESS_ERROR_CODES.INSUFFICIENT_CONTENT_TO_GENERATE_TASK);
            }
            userTags.sort((a, b) => a.updatedAt - b.updatedAt); // earliest first
            chosenAnswer = await this.#mqController.getAnswer(userTags[0].AnswerId);
        }

        const metaQuestion = await this.#mqController.getMetaQuestion(chosenAnswer.getMetaQuestionId());
        const taskData = {
            answer: chosenAnswer,
            metaQuestion: metaQuestion,
        }
        if (metaQuestion.getAppendixTag()) {
            taskData.appendix = await this.#mqController.getAppendix(metaQuestion.getAppendixTag());
        }
        return taskData;
    }

    async #completeTagAnswerTask(data) {
        validateParameters(data, {answerId: PRIMITIVE_TYPES.NUMBER, userTag: PRIMITIVE_TYPES.STRING});
        const callingUser = data.callingUser;
        await this.#taskRepo.tagAnswer(callingUser.username, data.answerId, data.userTag);

        const answer = await this.#mqController.getAnswer(data.answerId);
        if (answer.getTag() === data.userTag && !data.explanation) return;
        switch (callingUser.type) {
            case USER_TYPES.LECTURER:
                await answer.setTag(data.userTag);
                if (data.explanation) await answer.setExplanation(data.explanation);
                break;
            case USER_TYPES.TA:
                if (answer.getTag() !== data.userTag) {
                    // TA tagged differently and has an explanation
                    this.createRoleTask(
                        {
                            role: USER_TYPES.LECTURER,
                            leaveOpen: false,
                            taskData: {
                                taskType: CREATED_TASK_TYPES.TAG_REVIEW,
                                answerId: data.answerId,
                                suggestedTag: data.userTag,
                                suggestedExplanation: data.explanation,
                            },
                            callingUser: callingUser
                        })
                } else if (data.explanation) {
                    // TA only thinks he has a better explanation
                    this.createRoleTask(
                        {
                            role: USER_TYPES.LECTURER,
                            leaveOpen: false,
                            taskData: {
                                taskType: CREATED_TASK_TYPES.EXPLANATION_COMPARISON,
                                answerId: data.answerId,
                                suggestedExplanation: data.explanation,
                            },
                            callingUser: callingUser
                        })
                }
                break;
        }
    }
}

module.exports = TaskController;




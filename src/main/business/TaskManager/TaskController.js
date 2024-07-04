const { validateParameters } = require('../../validateParameters');
var {Task} = require('./Task')
var {TaskTypes} = require('./Task')
const {PRIMITIVE_TYPES, GENERATED_TASK_TYPES, ANSWER_TYPES, USER_TYPES, CREATED_TASK_TYPES, CREATED_TASK_SUPER_TYPES} = require("../../Enums");
const {EMSError, TASK_PROCESS_ERROR_CODES, USER_PROCESS_ERROR_CODES} = require("../../EMSError");
const {TASK_PROCESS_ERROR_MSGS} = require("../../ErrorMessages");

class TaskController {
    #taskRepo
    #userController
    #mqController

    constructor(taskRepository, userController, metaQuestionsController) {
        this.#taskRepo = taskRepository;
        this.#userController = userController;
        this.#mqController = metaQuestionsController;
        this._tasks = new Map();
    }

    getTask(taskId){
        return this._tasks.get(taskId);
    }

    async getTasksOf(data){
        validateParameters(data,{})

        const callingUser = data.callingUser;

        const myDalRoleTasks = await this.#taskRepo.getTasksOfRole(callingUser.type);
        const myRoleTasks = await Promise.all(myDalRoleTasks.map(async dalTask => await this.#createdTaskFactory(dalTask)));
        myRoleTasks.forEach(roleTask => roleTask.superType = CREATED_TASK_SUPER_TYPES.ROLE_SPECIFIC);

        // at a future point where user-specific tasks exist as well, concatenate the user-tasks and role-tasks
        return myRoleTasks;
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

    async completeCreatedTask(data) {
        validateParameters(data, {taskId: PRIMITIVE_TYPES.NUMBER, type: PRIMITIVE_TYPES.STRING, superType: PRIMITIVE_TYPES.STRING});
        switch (data.superType) {
            case CREATED_TASK_SUPER_TYPES.ROLE_SPECIFIC:
                await this.#taskRepo.completeRoleTask(data.taskId);
                break;
            case CREATED_TASK_SUPER_TYPES.USER_SPECIFIC:
                break;
            default:
                throw new EMSError(TASK_PROCESS_ERROR_MSGS.INVALID_TASK_SUPER_TYPE(data.superType), TASK_PROCESS_ERROR_CODES.INVALID_TASK_SUPER_TYPE);
        }
        switch (data.type) {
            case CREATED_TASK_TYPES.TAG_REVIEW:
                await this.#completeTagAnswerTask(data);
                break;
            case CREATED_TASK_TYPES.EXPLANATION_COMPARISON:
                await this.#completeExplanationComparisonTask(data);
                break;
            default:
                throw new EMSError(TASK_PROCESS_ERROR_MSGS.INVALID_TASK_TYPE(data.type), TASK_PROCESS_ERROR_CODES.INVALID_TASK_TYPE);
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
                            taskType: CREATED_TASK_TYPES.TAG_REVIEW,
                            leaveOpen: false,
                            taskData: {
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
                            taskType: CREATED_TASK_TYPES.EXPLANATION_COMPARISON,
                            leaveOpen: false,
                            taskData: {
                                answerId: data.answerId,
                                suggestedExplanation: data.explanation,
                            },
                            callingUser: callingUser
                        })
                }
                break;
        }
    }

    async #completeExplanationComparisonTask(data) {
        validateParameters(data, {answerId: PRIMITIVE_TYPES.NUMBER, explanation: PRIMITIVE_TYPES.STRING});
        const answer = await this.#mqController.getAnswer(data.answerId);
        await answer.setExplanation(data.explanation);
    }

    /**
     * Converts a given created task to a filled object with all relevant business level data
     * @param dalTask
     */
    async #createdTaskFactory(dalTask) {
        const task = {
            taskId: dalTask.id,
            type: dalTask.taskType,
            creatingUser: await this.#userController.getUser(dalTask.creatingUser),
        }
        const taskData = dalTask.taskData;
        switch (task.type) {

            case CREATED_TASK_TYPES.EXPLANATION_COMPARISON:
                task.answer = await this.#mqController.getAnswer(taskData.answerId);
                task.metaQuestion = await this.#mqController.getMetaQuestion(task.answer.getMetaQuestionId());
                if (task.metaQuestion.getAppendixTag()) task.appendix = await this.#mqController.getAppendix(task.metaQuestion.getAppendixTag());
                task.suggestedExplanation = taskData.suggestedExplanation;
                break;

            case CREATED_TASK_TYPES.TAG_REVIEW:
                task.suggestedTag = taskData.suggestedTag;
                task.answer = await this.#mqController.getAnswer(taskData.answerId);
                task.metaQuestion = await this.#mqController.getMetaQuestion(task.answer.getMetaQuestionId());
                if (task.metaQuestion.getAppendixTag()) task.appendix = await this.#mqController.getAppendix(task.metaQuestion.getAppendixTag());
                task.suggestedExplanation = taskData.suggestedExplanation;
                break;
        }
        return task;

    }
}

module.exports = TaskController;




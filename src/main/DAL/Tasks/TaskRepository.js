const defineUserModel = require("../User/User");
const defineAnswerModel = require("../MetaQuestion/Answer");
const defineUserTagAnswerModel = require("./UserTagAnswer");
const defineRoleTaskModel = require("./RoleTask");
const {EMSError, USER_PROCESS_ERROR_CODES, MQ_PROCESS_ERROR_CODES, TASK_PROCESS_ERROR_CODES} = require("../../EMSError");
const {USER_PROCESS_ERROR_MSGS, MQ_PROCESS_ERROR_MSGS, TASK_PROCESS_ERROR_MSGS} = require("../../ErrorMessages");
const {Sequelize} = require("sequelize");

class TaskRepository {
    #User
    #Answer
    #UserTagAnswer
    #RoleTask

    constructor(sequelize) {
        this.#User = defineUserModel(sequelize);
        this.#Answer = defineAnswerModel(sequelize);
        this.#UserTagAnswer = defineUserTagAnswerModel(sequelize);
        this.#RoleTask = defineRoleTaskModel(sequelize, this.#User);

        this.#User.belongsToMany(this.#Answer, {as: 'taggedAnswers', through: this.#UserTagAnswer});
        this.#Answer.belongsToMany(this.#User, {as: 'users', through: this.#UserTagAnswer });

        this.#User.hasMany(this.#RoleTask, {as: 'createdRoleTasks', foreignKey: 'creatingUser'});
        this.#RoleTask.belongsTo(this.#User, {foreignKey: 'creatingUser', onDelete: 'CASCADE'});
    }

    /**
     * Tags a given answers with the given tag as the given user
     * @param username
     * @param answerId
     * @param tag
     */
    async tagAnswer(username, answerId, tag){
        const user = await this.#getUser(username);
        const answer = await this.#getAnswer(answerId);

        const userTag = await this.#UserTagAnswer.findOne({
            where: {
                UserUsername: username,
                AnswerId: answerId
            }
        });
        if (userTag) {
            userTag.tag = tag;
            userTag.updateDate = new Date();
            await userTag.save();
        } else {
            await user.addTaggedAnswer(answer, {through: {tag: tag, updateDate: new Date()}});
        }
    }

    async getTaggedAnswersOf(username) {
        const taggedAnswers = await this.#Answer.findAll({
            include: [{
                model: this.#User,
                as: 'users',
                where: { username: username },
                through: { attributes: ['tag'] }
            }]
        });
        return taggedAnswers.map(answer => ({
            answer: answer,
            userTag: answer.users[0].UserTagAnswer
        }));
    }

    async getUntaggedAnswersOf(username) {
        const userTags = await this.getUserTags(username);
        const untaggedAnswers = await this.#Answer.findAll({
            where: {
                id: {
                    [Sequelize.Op.notIn]: userTags.map(tag => tag.AnswerId)
                }
            }
        });
        return untaggedAnswers;
    }

    async getUserTags(username) {
        return await this.#UserTagAnswer.findAll({where : { UserUsername: username }})
    }

    async createRoleTask(data) {
        return await this.#RoleTask.create(data);
    }

    async getRoleTask(taskId) {
        const foundTask = await this.#RoleTask.findByPk(taskId);
        if (!foundTask) {
            throw new EMSError(TASK_PROCESS_ERROR_MSGS.INVALID_TASK_ID, TASK_PROCESS_ERROR_CODES.INVALID_TASK_ID);
        }
        return foundTask;
    }

    async deleteRoleTask(taskId) {
        await this.#RoleTask.destroy({where: {id: taskId}});
    }

    async getTasksOfRole(role) {
        return await this.#RoleTask.findAll({ where : { role: role } });
    }

    async completeRoleTask(taskId) {
        const task = await this.getRoleTask(taskId);
        if (!task.leaveOpen) await task.destroy();
    }

    async #getUser(username) {
        const foundUser = await this.#User.findByPk(username);
        if (foundUser === null) {
            throw new EMSError(USER_PROCESS_ERROR_MSGS.USERNAME_DOESNT_EXIST(username), USER_PROCESS_ERROR_CODES.USERNAME_DOESNT_EXIST);
        }
        return foundUser;
    }

    async #getAnswer(answerId) {
        const foundUser = await this.#Answer.findByPk(answerId);
        if (foundUser === null) {
            throw new EMSError(MQ_PROCESS_ERROR_MSGS.ANSWER_ID_DOESNT_EXIST(answerId), MQ_PROCESS_ERROR_CODES.ANSWER_ID_DOESNT_EXIST);
        }
        return foundUser;
    }
}

module.exports = TaskRepository;
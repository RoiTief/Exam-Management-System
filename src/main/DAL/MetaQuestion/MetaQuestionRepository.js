const defineMetaQuestionModel = require("./MetaQuestion")
const defineAnswerModel = require("./Answer")
const defineKeywordModel= require("./Keyword")
const defineAppendixModel = require("./Appendix");
const {EMSError, MQ_PROCESS_ERROR_CODES: ERROR_CODES} = require("../../EMSError");
const {MQ_PROCESS_ERROR_MSGS : ERROR_MSGS} = require("../../ErrorMessages");

class MetaQuestionRepository {
    #MetaQuestion
    #Answer
    #Keyword
    #Appendix

    constructor(sequelize) {
        this.#MetaQuestion = defineMetaQuestionModel(sequelize);
        this.#Answer = defineAnswerModel(sequelize);
        this.#Keyword = defineKeywordModel(sequelize);
        this.#Appendix = defineAppendixModel(sequelize);

        // Define associations
        // MQ - Answer
        this.#MetaQuestion.hasMany(this.#Answer, {as: 'answers', foreignKey: 'metaQuestionId', onDelete: 'CASCADE'});
        this.#Answer.belongsTo(this.#MetaQuestion, {foreignKey: 'metaQuestionId'});

        // MQ - Keyword
        this.#MetaQuestion.belongsToMany(this.#Keyword, {through: 'MetaQuestionKeyword', as: 'keywords'});
        this.#Keyword.belongsToMany(this.#MetaQuestion, {through: 'MetaQuestionKeyword', as: 'metaQuestions'});

        // MQ - Appendix
        this.#Appendix.hasMany(this.#MetaQuestion, {as: 'metaQuestions', foreignKey: 'appendixTag'});
        this.#MetaQuestion.belongsTo(this.#Appendix, {as: 'appendix', foreignKey: { name: 'appendixTag', allowNull: true }});

        // Appendix - Keyword
        this.#Appendix.belongsToMany(this.#Keyword, {through: 'AppendixKeyword', as: 'keywords'});
        this.#Keyword.belongsToMany(this.#Appendix, {through: 'AppendixKeyword', as: 'appendices'});
    }

    /**
     * Adds a new Appendix to the DB.
     * @param appendixData Data for the Appendix to be added: { tag: string, title: string, content: string, appendixTag: string | null }
     * @param keywords Array of keywords for the added Appendix: string[]
     * @returns The added Appendix.
     */
    async addAppendix(appendixData, keywords) {
        try {
             const appendix = await this.#Appendix.create(appendixData);
             return await this.setKeywordsToAppendix(appendix.tag, keywords);
        } catch (e) {
            if (e.name === 'SequelizeUniqueConstraintError') {
                // Check if the error is related to username or email uniqueness
                e.errors.forEach(err => {
                    if (err.path === 'tag') {
                        throw new EMSError(ERROR_MSGS.APPENDIX_TAG_ALREADY_EXIST(appendixData.tag), ERROR_CODES.APPENDIX_TAG_ALREADY_EXIST);
                    }
                });
            } else {
                // Handle other errors
                console.error('Error adding appendix:', e);
            }
        }
    }

    /**
     * Adds a new MetaQuestion to the DB.
     * @param questionData Data for the MetaQuestion to be added: { stem: string }
     * @param answers Array of answers for the added MetaQuestion: { content: string, tag: ANSWER_TYPES, explanation: string }[]
     * @param keywords Array of keywords for the added MetaQuestion: string[]
     * @returns The added question.
     */
    async addMetaQuestion(questionData, answers, keywords) {
        if (questionData.appendixTag) {
            await this.getAppendix(questionData.appendixTag); // makes sure the appendix we connect to exists
        }
        const question = await this.#MetaQuestion.create(questionData);
        await this.addAnswersToQuestion(question.id, answers);
        return await this.setKeywordsToQuestion(question.id, keywords);
    }

    /**
     * Adds given keywords to given meta-question.
     * @param qId ID of an existing meta-question.
     * @param answers Array of answers: {content: string, tag: ANSWER_TYPES, explanation: string }[]
     * @returns The updated question.
     */
    async addAnswersToQuestion(qId, answers) {
        answers.forEach(answer => {
            answer.metaQuestionId = qId;
        });
        await this.#Answer.bulkCreate(answers);

        return await this.getMetaQuestion(qId);
    }

    /**
     * Adds given keywords to given meta-question.
     * @param qId ID of an existing meta-question.
     * @param keywords Array of keywords: string[]
     * @returns The updated question.
     */
    async setKeywordsToQuestion(qId, keywords) {
        const metaQuestion = await this.getMetaQuestion(qId);
        const dbKeywords = await this.#getDbKeywords(keywords)
        await metaQuestion.setKeywords(dbKeywords);
        await metaQuestion.save();
        await metaQuestion.reload();
        return metaQuestion;
    }

    /**
     * Adds given keywords to given appendix.
     * @param tag tag of an existing appendix.
     * @param keywords Array of keywords: string[]
     * @returns The updated appendix.
     */
    async setKeywordsToAppendix(tag, keywords) {
        const appendix = await this.getAppendix(tag);
        const dbKeywords = await this.#getDbKeywords(keywords)
        await appendix.setKeywords(dbKeywords);
        await appendix.save();
        await appendix.reload();
        return appendix;
    }

    /**
     * @param tag Tag of the requested Appendix.
     * @return The requested Appendix.
     */
    async getAppendix(tag) {
        const appendix = await this.#Appendix.findByPk(tag, {
            include: [
                {
                    model: this.#MetaQuestion,
                    as: 'metaQuestions',
                },
                {
                    model: this.#Keyword,
                    as: 'keywords',
                },
            ]
        });
        if (appendix === null) {
            throw new EMSError(ERROR_MSGS.APPENDIX_TAG_DOESNT_EXIST(tag), ERROR_CODES.APPENDIX_TAG_DOESNT_EXIST);
        }
        return appendix;
    }

    async getAllAppendices() {
        return await this.#Appendix.findAll({
            include: [
                {
                    model: this.#MetaQuestion,
                    as: 'metaQuestions',
                },
                {
                    model: this.#Keyword,
                    as: 'keywords',
                },
            ]
        });
    }

    async getMetaQuestion(metaQuestionId) {
        const metaQuestion = await this.#MetaQuestion.findByPk(metaQuestionId, {
            include: [
                {
                    model: this.#Answer,
                    as: 'answers',
                },
                {
                    model: this.#Keyword,
                    as: 'keywords',
                },
            ]
        });
        if (metaQuestion === null) {
            throw new EMSError(ERROR_MSGS.MQ_ID_DOESNT_EXIST(metaQuestionId), ERROR_CODES.MQ_ID_DOESNT_EXIST);
        }
        return metaQuestion;
    }

    async getAllMetaQuestions() {
        return await this.#MetaQuestion.findAll({
            include: [
                {
                    model: this.#Answer,
                    as: 'answers',
                },
                {
                    model: this.#Keyword,
                    as: 'keywords',
                },
                {
                    model: this.#Appendix,
                    as: 'appendix'
                }
            ]
        });
    }

    async getMetaQuestionsForAppendix(appendixTag) {
        return await this.#MetaQuestion.findAll({
            where: {
                appendixTag: appendixTag
            },
            include: [
                {
                    model: this.#Answer,
                    as: 'answers',
                },
                {
                    model: this.#Keyword,
                    as: 'keywords',
                },
            ]
        });
    }

    async getAnswer(answerId) {
        const answer = await this.#Answer.findByPk(answerId);
        if (answer === null) {
            throw new EMSError(ERROR_MSGS.ANSWER_ID_DOESNT_EXIST(answerId), ERROR_CODES.ANSWER_ID_DOESNT_EXIST);
        }
        return answer;
    }

    /**
     * Removes given Appendix from the DB.
     * @param appendixTag Tag of the Appendix to remove.
     */
    async deleteAppendix(appendixTag) {
        await this.#Appendix.destroy({
            where: {
                tag: appendixTag,
            }
        });
    }

    /**
     * Removes given Meta-Question from the DB.
     * @param qId ID of the Meta-Question to remove.
     */
    async deleteMetaQuestion(qId) {
        await this.#MetaQuestion.destroy({
           where: {
               id: qId,
           }
        });
    }

    async deleteAnswer(aId) {
        await this.#Answer.destroy({
            where: {
                id: aId,
            },
        })
    }

    async deleteAnswers(aIds){
        await this.deleteAnswer(aIds);
    }

    async deleteAnswersOfMq(mqId) {
        await this.#Answer.destroy({
            where: {
                metaQuestionId: mqId,
            },
        })
    }

    /**
     * @param keywords Array of keywords: string[]
     * @returns Array of DB Keyword instances matching the given keywords.
     */
    async #getDbKeywords(keywords) {
        return await Promise.all(
            keywords.map(async word => {
                const [keyword, created] = await this.#Keyword.findOrCreate({
                    where: {word},
                });
                return keyword;
            }));
    }
}

module.exports = MetaQuestionRepository;
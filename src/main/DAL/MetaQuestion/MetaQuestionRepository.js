const defineMetaQuestionModel = require("./MetaQuestion")
const defineAnswerModel = require("./Answer")
const defineKeywordModel= require("./Keyword")

class MetaQuestionRepository {
    #MetaQuestion
    #Answer
    #Keyword

    constructor(sequelize) {
        this.#MetaQuestion = defineMetaQuestionModel(sequelize);
        this.#Answer = defineAnswerModel(sequelize);
        this.#Keyword = defineKeywordModel(sequelize);

        // Define associations
        // MQ - Answer
        this.#MetaQuestion.hasMany(this.#Answer, {as: 'answers', foreignKey: 'metaQuestionId', onDelete: 'CASCADE'});
        this.#Answer.belongsTo(this.#MetaQuestion, {foreignKey: 'metaQuestionId'});

        // MQ - Keyword
        this.#MetaQuestion.belongsToMany(this.#Keyword, {through: 'MetaQuestionKeyword', as: 'keywords'});
        this.#Keyword.belongsToMany(this.#MetaQuestion, {through: 'MetaQuestionKeyword', as: 'metaQuestions'});

        sequelize.sync({alter: true}); // cleans the DB
    }

    /**
     * Adds a new MetaQuestion to the DB.
     * @param questionData Data for the MetaQuestion to be added: { stem: string }
     * @param answers Array of answers for the added MetaQuestion: { content: string, tag: ANSWER_TYPES, explanation: string }[]
     * @param keywords Array of keywords for the added MetaQuestion: string[]
     * @returns The added question.
     */
    async addMetaQuestion(questionData, answers, keywords) {
        const question = await this.#MetaQuestion.create(questionData);
        await this.addAnswersToQuestion(question.id, answers);
        return await this.addKeywordsToQuestion(question.id, keywords);
    }

    /**
     * Adds given keywords to given meta-question.
     * @param qId ID of an existing meta-question.
     * @param answers Array of answers: {content: string, tag: ANSWER_TYPES, explanation: string }[]
     * @returns The updated question.
     */
    async addAnswersToQuestion(qId, answers) {
        await answers.forEach(answer => {
            answer.metaQuestionId = qId;
        });
        await this.#Answer.bulkCreate(answers);

        return await this.#MetaQuestion.findByPk(qId, {
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

    /**
     * Adds given keywords to given meta-question.
     * @param qId ID of an existing meta-question.
     * @param keywords Array of keywords: string[]
     * @returns The updated question.
     */
    async addKeywordsToQuestion(qId, keywords) {
        const question = await this.#MetaQuestion.findByPk(qId);
        const dbKeywords = await this.#getDbKeywords(keywords)
        await question.addKeywords(dbKeywords);

        return await this.#MetaQuestion.findByPk(question.id, {
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
const MetaQuestion = require('./MetaQuestion')
const Appendix = require('./Appendix')
const Answer = require('./Answer')
const {ANSWER_TYPES, PRIMITIVE_TYPES} = require("../../Enums");
const {validateParameters} = require("../../validateParameters");

class MetaQuestionController{
    #metaQuestionRepo

    constructor(metaQuestionRepo) {
        this.#metaQuestionRepo = metaQuestionRepo;
    }

    async createAppendix(data) {
        validateParameters(data, {
            keywords: [PRIMITIVE_TYPES.STRING],
            tag: PRIMITIVE_TYPES.STRING,
            title: PRIMITIVE_TYPES.STRING,
            content: PRIMITIVE_TYPES.STRING,
        });

        const dalAppendix = await this.#metaQuestionRepo.addAppendix(data, data.keywords);
        return new Appendix(dalAppendix);
    }

    /**
     * Updates a given appendix with new data (keywords, title, content)
     * @param data
     * @return {Promise<Appendix>} The updated appendix
     */
    async editAppendix(data) {
        validateParameters(data, {
            keywords: [PRIMITIVE_TYPES.STRING],
            tag: PRIMITIVE_TYPES.STRING,
        });

        const dalAppendix = await this.#metaQuestionRepo.setKeywordsToAppendix(data.tag, data.keywords)
        const appendix = new Appendix(dalAppendix);
        if (data.title) {
            await appendix.setTitle(data.title);
        }
        if (data.content) {
            await appendix.setContent(data.content);
        }
        return appendix;
    }

    async deleteAppendix(data) {
        validateParameters(data, {tag: PRIMITIVE_TYPES.STRING});
        await this.#metaQuestionRepo.deleteAppendix(data.tag);
    }

    async createMetaQuestion(data) {
        validateParameters(data, {
            keywords: [PRIMITIVE_TYPES.STRING],
            answers: [{content: PRIMITIVE_TYPES.STRING, tag: PRIMITIVE_TYPES.STRING, isContentRTL: PRIMITIVE_TYPES.BOOLEAN, isExplanationRTL: PRIMITIVE_TYPES.BOOLEAN}],
            stem: PRIMITIVE_TYPES.STRING,
            isStemRTL: PRIMITIVE_TYPES.BOOLEAN,
        });

        const dalMQ = await this.#metaQuestionRepo.addMetaQuestion(data, data.answers, data.keywords);

        return new MetaQuestion(dalMQ)
    }

    async editMetaQuestion(data) {
        validateParameters(data, {
            id: PRIMITIVE_TYPES.NUMBER,
            keywords: [PRIMITIVE_TYPES.STRING],
            answers: [{content: PRIMITIVE_TYPES.STRING, tag: PRIMITIVE_TYPES.STRING, isContentRTL: PRIMITIVE_TYPES.BOOLEAN, isExplanationRTL: PRIMITIVE_TYPES.BOOLEAN}],
            stem: PRIMITIVE_TYPES.STRING,
            isStemRTL: PRIMITIVE_TYPES.BOOLEAN,
        });
        const answersToAdd = data.answers.filter(a => !a.id); // answers without ID are new answer
        const answersToUpdate = data.answers.filter(a => a.id); // answers with ID are answers that may have been updated

        await this.#metaQuestionRepo.setKeywordsToQuestion(data.id, data.keywords);

        let metaQuestion = await this.getMetaQuestion(data.id);
        if (data.stem !== metaQuestion.getStem() || data.appendixTag !== metaQuestion.getAppendixTag()) {
            // since the stem/appendix was changed the answers' tagging by other users are no longer relevant
            // easiest way to clean those tags is to delete those answers
            await this.#metaQuestionRepo.deleteAnswersOfMq(data.id);
            answersToAdd.push(...answersToUpdate.splice(0));

            if (data.stem !== metaQuestion.getStem()) await metaQuestion.setStem(data.stem);
            if (data.appendixTag !== metaQuestion.getAppendixTag()) await metaQuestion.setAppendix(data.appendixTag);
        }
        if (data.isStemRTL !== metaQuestion.isStemRTL()) await metaQuestion.setStemOrientation(data.isStemRTL);

        await Promise.all(answersToUpdate.map(async answerData => {
            let answer = await this.getAnswer(answerData.id);
            if (answerData.content !== answer.getContent()) {
                // content of answer has changed means tagging by other users are no longer relevant...
                await this.#metaQuestionRepo.deleteAnswer(answerData.id);
                answersToAdd.push(answerData);
                return;
            }
            if (answerData.explanation !== answer.getExplanation()) await answer.setExplanation(answerData.explanation);
            if (answerData.tag !== answer.getTag()) await answer.setTag(answerData.tag);
            if (answerData.isContentRTL !== answer.isContentRTL()) await answer.setContentOrientation(answerData.isContentRTL);
            if (answerData.isExplanationRTL !== answer.isExplanationRTL()) await answer.setExplanationOrientation(answerData.isExplanationRTL);
        }))
        await this.#metaQuestionRepo.addAnswersToQuestion(data.id, answersToAdd);

        return await this.getMetaQuestion(data.id);
    }

    async deleteMetaQuestion(data) {
        validateParameters(data, {id: PRIMITIVE_TYPES.NUMBER});
        await this.#metaQuestionRepo.deleteMetaQuestion(data.id);
    }

    async getAllMetaQuestions(){
        const dalMQs = await this.#metaQuestionRepo.getAllMetaQuestions()
        return dalMQs.map(dalMQ => new MetaQuestion(dalMQ));
    }

    async getMetaQuestion(mqId) {
        const dalMQ = await this.#metaQuestionRepo.getMetaQuestion(mqId);
        return new MetaQuestion(dalMQ);
    }

    async getAllAppendices(){
        const dalAppendices = await this.#metaQuestionRepo.getAllAppendices()
        return dalAppendices.map(dalAppendix => new Appendix(dalAppendix));
    }

    async getAppendix(appendixTag) {
        const dalAppendix = await this.#metaQuestionRepo.getAppendix(appendixTag);
        return new Appendix(dalAppendix);
    }

    async getMetaQuestionsForAppendix(data){
        validateParameters(data, {appendixTag: PRIMITIVE_TYPES.STRING});
        const dalMQs = await this.#metaQuestionRepo.getMetaQuestionsForAppendix(data.appendixTag);
        return dalMQs.map(dalMQ => new MetaQuestion(dalMQ));
    }

    async getAnswer(answerId) {
        const dalAnswer = await this.#metaQuestionRepo.getAnswer(answerId);
        return new Answer(dalAnswer);
    }
}

module.exports = MetaQuestionController;


const { ANSWER_TYPES } = require("../../Enums");
const MetaQuestion = require("../MetaQuestions/MetaQuestion");
const ExamAnswer = require("./ExamAnswer");
class Question {
    #dalQuestion
    /**@type {MetaQuestion} */
    #metaQuestion
    /**@type {ExamAnswer[]} */
    #ExamAnswers
    constructor(dalQuestion) {
        this.#dalQuestion = dalQuestion;
        dalQuestion.metaQuestion.answers = dalQuestion.answers ? dalQuestion.answers : []
        this.#metaQuestion = new MetaQuestion(dalQuestion.metaQuestion)
        this.#ExamAnswers = dalQuestion.answers.map(dExamAnswer => new ExamAnswer(dExamAnswer))
    }
    getId() {
        return this.#dalQuestion.id;
    }

    getAnswers() {
        return this.#ExamAnswers;
    }

    getKey() {
        return this.#ExamAnswers
            .filter(a => a.getTag() === ANSWER_TYPES.KEY)[0]
    }
    
    getDistractors() {
        return this.#ExamAnswers
            .filter(a => a.getTag() === ANSWER_TYPES.DISTRACTOR)
    }
    
    getMetaQuestion() {
        return this.#metaQuestion;
    }
    getStem(){
        return this.#metaQuestion.getStem();
    }
    getOrdinal(){
        return this.#dalQuestion.dataValues.ordinal
    }
}

module.exports = Question
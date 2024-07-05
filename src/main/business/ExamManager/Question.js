const Answer = require("../MetaQuestions/Answer");
const MetaQuestion = require("../MetaQuestions/MetaQuestion");
const ExamAnswer = require("./ExamAnswer");

class Question {
    #dalQuestion
    #metaQuestion
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
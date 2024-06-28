const Answer = require("../MetaQuestions/Answer");
const MetaQuestion = require("../MetaQuestions/MetaQuestion");
const ExamAnswer = require("./ExamAnswer");

class Question {
    #dalQuestion
    #metaQuestion
    #ExamAnswers
    constructor(dalQuestion) {
        this.#dalQuestion = dalQuestion;
        this.#metaQuestion = new MetaQuestion(dalQuestion.metaQuestion)
        this.#ExamAnswers = dalQuestion.answers.map(dExamAnswer => new ExamAnswer(dExamAnswer))
    }
    async getExamId() {
        return this.#dalQuestion.id;
    }

    async getQuestions(){
        return this.#dalQuestion.questions
    }
}

module.exports = Question
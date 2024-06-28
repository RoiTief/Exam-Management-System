const Question = require("./Question");

class Exam {
    #dalExam
    #questions
    constructor(dalExam) {
        this.#dalExam = dalExam;
        this.#questions = dalExam.questions.map(dalQ => new Question(dalQ))
    }
    async getExamId() {
        return this.#dalExam.id;
    }

    async getQuestions(){
        return this.#dalExam.questions
    }
}

module.exports = Exam
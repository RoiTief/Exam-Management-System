const Question = require("./Question");

class Exam {
    #dalExam
    #questions
    constructor(dalExam) {
        this.#dalExam = dalExam;
        this.#questions = dalExam.questions?.map(dalQ => new Question(dalQ))
    }
    getId() {
        return this.#dalExam.id;
    }

    getQuestions() {
        return this.#questions
    }
    getTitle() {
        return this.#dalExam.title;
    }
}

module.exports = Exam
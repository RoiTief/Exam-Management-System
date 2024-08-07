const Answer = require("../MetaQuestions/Answer");

/**
 * A class to represent answer in a specific exam
 */
class ExamAnswer extends Answer{
    #dalExamAnswer
    constructor(dalExamAnswer){
        super(dalExamAnswer)
        this.#dalExamAnswer = dalExamAnswer
    }
    getOrdinal(){
        return this.#dalExamAnswer.QuestionAnswer.ordinal
    }
    /**@returns {number} */
    getVersion(){
        return this.#dalExamAnswer.QuestionAnswer.version
    }
}

module.exports = ExamAnswer
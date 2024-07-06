const Question = require("./Question");

class Exam {
    #dalExam
    /**@type {Question[]?} */
    #questions
    constructor(dalExam) {
        this.#dalExam = dalExam;
        this.#questions = dalExam.questions ? dalExam.questions.map(dalQ => new Question(dalQ)) : []        
    }
    
    /**
     * 
     * @returns {number}
     */
    getId() {
        return this.#dalExam.id;
    }

    getQuestions() {
        return this.#questions
    }


    /**
     * 
     * @returns {string}
     */
    getExamReason(){
        return this.#dalExam.examReason;
    }

    /**@returns {number} number of versions in the exam */
    getNumVersions() {
        return this.#dalExam.numVersions
    }
}

module.exports = Exam
const Exam = require("./Exam");

class ExamController{
    #exams;
    #examId;
    constructor(){
        this.#exams = new Map()
        this.#examId = 1
    }

    createExam(createExamProperties){
        const exam = new Exam(createExamProperties)
        this.#exams.set(this.#examId, exam)
        this.#examId++
        return exam
    }

    // get exams as array
    getExams(){
        return [...this.#exams.values()]
    }

}

module.exports = ExamController;
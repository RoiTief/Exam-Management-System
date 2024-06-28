const Exam = require("./Exam");
const {validateParameters} = require("../../../main/validateParameters");
const { EMSError } = require("../../EMSError");
const { GENERAL_ERROR_MSGS } = require("../../ErrorMessages");

class ExamController{
    #taskController;
    #userController; 
    #examRepo;
    constructor(taskController, userController, examRepo){
        this.#taskController = taskController;
        this.#userController = userController;
        this.#examRepo = examRepo;
    }

    async createExam(data){
        validateParameters(data,{});
        const dExam = await this.#examRepo.createExam(data)
        return new Exam(dExam)
    }

    // get exams as array
    getAllExams(getAllExamsProperties){
        throw EMSError(GENERAL_ERROR_MSGS.NOT_IMPLEMENTED);
    }

}

module.exports = ExamController;
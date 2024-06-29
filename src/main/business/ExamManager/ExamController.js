const Exam = require("./Exam");
const {validateParameters} = require("../../../main/validateParameters");
const { EMSError } = require("../../EMSError");
const { GENERAL_ERROR_MSGS } = require("../../ErrorMessages");
const { PRIMITIVE_TYPES } = require("../../Enums");

class ExamController{
    #examRepo;
    #metaQuestionController;
    constructor(metaQuestionController, examRepo){
        this.#metaQuestionController = metaQuestionController;
        this.#examRepo = examRepo;
    }

    async createExam(data){
        validateParameters(data,{title: PRIMITIVE_TYPES.STRING});
        const dExam = await this.#examRepo.createExam(data)
        return new Exam(dExam)
    }

    // get exams as array
    async getAllExams(getAllExamsProperties){
        throw EMSError(GENERAL_ERROR_MSGS.NOT_IMPLEMENTED);
    }
}

module.exports = ExamController;
const Exam = require("./Exam");
const { validateParameters } = require("../../../main/validateParameters");
const { EMSError } = require("../../EMSError");
const { GENERAL_ERROR_MSGS } = require("../../ErrorMessages");
const { PRIMITIVE_TYPES } = require("../../Enums");
const Question = require("./Question");

class ExamController {
    #examRepo;
    #metaQuestionController;
    constructor(metaQuestionController, examRepo) {
        this.#metaQuestionController = metaQuestionController;
        this.#examRepo = examRepo;
    }

    async createExam(data) {
        validateParameters(data, { title: PRIMITIVE_TYPES.STRING });
        const dExam = await this.#examRepo.createExam(data)
        return new Exam(dExam)
    }

    /**
     * 
     * @param  examId 
     * @param  mQid : the metaQuestion id of the question
     * @param  questionData : {ordinal : the ordinal of the question in the exam}
     * @param  answerData : an array of object, contains the answerId its ordinal and permutation in the question. type [{id, ordinal, permutation}]
     * @returns The new question
     */
    async addQuestionToExam(data) {
        validateParameters(data, {
            examId: PRIMITIVE_TYPES.NUMBER,
            mQId: PRIMITIVE_TYPES.NUMBER,
            questionData: { ordinal: PRIMITIVE_TYPES.NUMBER },
            answersData: [{ id: PRIMITIVE_TYPES.NUMBER, ordinal: PRIMITIVE_TYPES.NUMBER, permutation: PRIMITIVE_TYPES.NUMBER }]
        })

        const dalQuestion =  await this.#examRepo.addQuestionToExam(data.examId, data.mQId, data.questionData, data.answersData)
        return new Question(dalQuestion) 
    }


    // get exams as array
    async getAllExams(data) {
        validateParameters(data, {})
        return await this.#examRepo.getAllExams()
    }
}

module.exports = ExamController;
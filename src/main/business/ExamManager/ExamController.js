const Exam = require("./Exam");
const { validateParameters, validateParametersWithoutCallingUser } = require("../../../main/validateParameters");
const { EMSError } = require("../../EMSError");
const { GENERAL_ERROR_MSGS } = require("../../ErrorMessages");
const { PRIMITIVE_TYPES } = require("../../Enums");
const Question = require("./Question");
const { validate } = require("uuid");
const { EXAM_CONSTANTS } = require("../../constants");

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
     * @param  mqId : the metaQuestion id of the question
     * @param  questionData : {ordinal : the ordinal of the question in the exam}
     * @param  answerData : an array of object, contains the answerId its ordinal and permutation in the question. type [{id, ordinal, permutation}]
     * @returns The new question
     */
    async addQuestionToExam(data) {
        validateParameters(data, {
            examId: PRIMITIVE_TYPES.NUMBER,
            mqId: PRIMITIVE_TYPES.NUMBER,
            questionData: { ordinal: PRIMITIVE_TYPES.NUMBER },
            answersData: [{ id: PRIMITIVE_TYPES.NUMBER, ordinal: PRIMITIVE_TYPES.NUMBER, permutation: PRIMITIVE_TYPES.NUMBER }]
        })

        const dalQuestion = await this.#examRepo.addQuestionToExam(data.examId, data.mqId, data.questionData, data.answersData)
        return new Question(dalQuestion)
    }


    /**
     * 
     * @param examId
     * @param mqId : {id : the metaQuestion id of the question}
     * @returns The new questions
     */
    async addAutomaticQuestionToExam(data) {
        validateParameters(data, {
            examId: PRIMITIVE_TYPES.NUMBER,
            mqId: PRIMITIVE_TYPES.NUMBER,
        })

        let quantity = EXAM_CONSTANTS.DEFAULT_QUESTIONS_QUANTITY_OCCURRENCES

        if (data.quantity) {
            validateParametersWithoutCallingUser(data, { quantity: PRIMITIVE_TYPES.NUMBER })
            quantity = data.quantity
        }

        const exam = await this.#examRepo.getExamById(data.examId)

        // ordinal = last exam question ordinal + 1
        let ordinal = exam.getQuestions().length > 0 ? Math.max(...exam.getQuestions().map((q) => q.getOrdinal())) + 1 : 1
        const metaQuestion = await this.#metaQuestionController.getMetaQuestion(data.mqId)
        let remainingKeys = metaQuestion.getKeys()
        let remainingDistractors = metaQuestion.getDistractors()

        const questionPromises = []
        for (let i = 0; i < quantity; i++) {
            // abort if not enough answers.
            if (remainingKeys.length === 0 || remainingDistractors.length < EXAM_CONSTANTS.MAX_DISTRACTOR_NUMBER) break

            // choose random key and remove it from remainingKeys
            const key = remainingKeys.splice(Math.floor(Math.random() * remainingKeys.length), 1)[0];

            //choose EXAM_CONSTANTS.MAX_DISTRACTOR_NUMBER random distractors and remove them from remainingDistractors
            const distractors = []
            for (let i = 0; i < EXAM_CONSTANTS.MAX_DISTRACTOR_NUMBER; i++) {
                const distractor = remainingDistractors.splice(Math.floor(Math.random() * remainingDistractors.length), 1)[0];
                distractors.push(distractor)
            }
            const answersData = [
                // permutation 0 is for preview, therefore key ordinal is always 1.
                { id: key.getId(), ordinal: 1, permutation: 0 },
                ...distractors.map((distractor, index) => ({ id: distractor.getId(), ordinal: index + 2, permutation: 0 }))
            ]
            // add question to exam
            questionPromises.push(
                this.addQuestionToExam({
                    ...data,
                    examId: data.examId,
                    mqId: data.mqId,
                    questionData: { ordinal },
                    answersData,
                }))
            ordinal += 1
        }

        return await Promise.all(questionPromises)
    }

    // get exams as array
    async getAllExams(data) {
        validateParameters(data, {})
        const dalExams = await this.#examRepo.getAllExams()
        return dalExams.map((exam) => new Exam(exam))
    }

    async getExam(data) {
        validateParameters(data, { id: PRIMITIVE_TYPES.NUMBER })
        const exam = await this.#examRepo.getExamById(data.id)
        return new Exam(exam)
    }
}

module.exports = ExamController;
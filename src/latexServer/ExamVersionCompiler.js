const fs = require("fs");
const {ANSWER_TYPES} = require("../main/Enums");

/**
 * Encapsulates the process of creating PDF for a single exam.
 * Should be discarded after use.
 */
class ExamVersionCompiler {
    #appendicesMap
    #texPath
    #latexConfs

    constructor(texPath, latexConfs) {
        this.#appendicesMap = {};
        this.#texPath = texPath;
        this.#latexConfs = latexConfs;
    }

    /**
     * Writes the LaTeX code for the exam at this.#texPath
     * @param exam An array of questions to build an exam out of
     * @param callback void function that'll be called once procedure is done
     */
    compile(exam, callback) {
        if (!Array.isArray(exam)) {
            return callback(new Error("Not an array"), null);
        }
        exam.sort((a, b) => a.ordinal - b.ordinal);
        exam.forEach(question => {
            question.answers.sort((a, b) => a.ordinal - b.ordinal)
            question.distractors = []
            question.answers.forEach((answer, index) => {
                if (answer.tag === ANSWER_TYPES.KEY) {
                    question.key = answer;
                    question.keyIndex = index;
                }
                else if (answer.tag === ANSWER_TYPES.DISTRACTOR) {
                    question.distractors.push(answer);
                }
            })
        });

        // write the preamble + open document
        fs.writeFileSync(this.#texPath,
            `${this.#latexConfs.PREAMBLE}\n` +
            `${this.#latexConfs.OPENING}\n`);

        this.#questions(exam);
        this.#appendices();
        this.#answerSheet(exam);
        this.#solvedAnswerSheet(exam);
        this.#solvedQuestions(exam)

        fs.writeFileSync(this.#texPath, this.#latexConfs.CLOSING, {flag : 'a'});
        callback();
    }

    /**
     * Adds Questions section
     */
    #questions(exam) {
        fs.writeFileSync(this.#texPath, '\\section{Questions} \n', {flag: 'a'});
        fs.writeFileSync(this.#texPath, this.#latexConfs.QUESTION_COMMANDS, {flag: 'a'});

        if (exam.length === 0) {
            this.#newpage();
            return;
        }

        let appendicesNumbering = 1;
        fs.writeFileSync(this.#texPath, '\\begin{enumerate}\n', {flag: 'a'}); // questions
        exam.forEach((question)  => {
            fs.writeFileSync(this.#texPath, '\\item ', {flag: 'a'});
            // Relate to appendix
            if (question.appendix) {
                if (!this.#appendicesMap[question.appendix.tag]) {
                    this.#appendicesMap[question.appendix.tag] = question.appendix;
                    this.#appendicesMap[question.appendix.tag]['number'] = appendicesNumbering++;
                }
                const appendixNumber = this.#appendicesMap[question.appendix.tag].number;
                fs.writeFileSync(this.#texPath,
                    `\\textbf{This question relates to appendix 2.${appendixNumber} in page {\\pageref{app:${question.appendix.tag}}}} \\\\\n`,
                    {flag: 'a'});
            }
            // stem
            fs.writeFileSync(this.#texPath, `${question.stem}\n`, {flag: 'a'});

            fs.writeFileSync(this.#texPath, '\\begin{enumerate}\n', {flag: 'a'}); // answers
            question.answers.forEach(answer => {
                fs.writeFileSync(this.#texPath, `\\item ${answer.text}\n`, {flag: 'a'});
            });
            fs.writeFileSync(this.#texPath, '\\end{enumerate}\n\n', {flag: 'a'}); // answers
        });
        fs.writeFileSync(this.#texPath, '\\end{enumerate}\n\n', {flag: 'a'}); // questions

        this.#newpage()
    }

    /**
     * Adds Appendices section
     */
    #appendices() {
        fs.writeFileSync(this.#texPath, '\\section{Appendices} \n\n', {flag: 'a'});

        Object.values(this.#appendicesMap)
            .sort((a, b) => a.number - b.number)
            .forEach(appendix => {
                fs.writeFileSync(this.#texPath,
                    `\\subsection{${appendix.title}}\n` +
                    `\\label{app:${appendix.tag}}\n` +
                    `${appendix.content} \n\n`,
                    {flag: 'a'});
            });

        this.#newpage();
    }

    /**
     * Creates empty answer sheet
     */
    #answerSheet(exam) {
        fs.writeFileSync(this.#texPath, '\\section*{Answer Sheet} \n', {flag: 'a'});
        fs.writeFileSync(this.#texPath, `${this.#latexConfs.ANSWER_SHEET_COMMANDS}\n`, {flag: 'a'});

        if (exam.length === 0) {
            this.#newpage();
            return;
        }

        fs.writeFileSync(this.#texPath, '\\begin{multicols}{3} \\begin{enumerate}\n', {flag: 'a'}); // answer sheet
        exam.forEach((question) => {
            fs.writeFileSync(this.#texPath, `\\item \\unsolved{${question.answers.length}}\n`, {flag: 'a'});
        })
        fs.writeFileSync(this.#texPath, '\\end{enumerate} \\end{multicols}\n\n', {flag: 'a'}); // answer sheet

        this.#newpage()
    }

    /**
     * Creates solved answer sheet
     */
    #solvedAnswerSheet(exam) {
        fs.writeFileSync(this.#texPath, '\\section*{Solved Answer Sheet} \n', {flag: 'a'});
        fs.writeFileSync(this.#texPath, `${this.#latexConfs.ANSWER_SHEET_COMMANDS}\n`, {flag: 'a'});

        if (exam.length === 0) {
            this.#newpage();
            return;
        }

        fs.writeFileSync(this.#texPath, '\\begin{multicols}{3} \\begin{enumerate}\n', {flag: 'a'}); // solved answer sheet
        exam.forEach((question) => {
            fs.writeFileSync(this.#texPath, `\\item \\solved{${question.answers.length}}{${question.keyIndex + 1}}\n`, {flag: 'a'});
        })
        fs.writeFileSync(this.#texPath, '\\end{enumerate} \\end{multicols}\n\n', {flag: 'a'}); // solved answer sheet

        this.#newpage()
    }

    /**
     * Writes the questions with the key boxed
     */
    #solvedQuestions(exam) {
        fs.writeFileSync(this.#texPath, '\\section*{Solved Questions} \n', {flag: 'a'});
        fs.writeFileSync(this.#texPath, `${this.#latexConfs.SOLVED_QUESTIONS_COMMANDS}\n`, {flag: 'a'});

        if (exam.length === 0) {
            this.#newpage();
            return;
        }

        fs.writeFileSync(this.#texPath, '\\begin{enumerate}\n', {flag: 'a'}); // questions
        exam.forEach((question)  => {
            fs.writeFileSync(this.#texPath, '\\item ', {flag: 'a'});
            // Relate to appendix
            if (question.appendix) {
                const appendixNumber = this.#appendicesMap[question.appendix.tag].number;
                fs.writeFileSync(this.#texPath,
                    `\\textbf{This question relates to appendix 2.${appendixNumber} in page {\\pageref{app:${question.appendix.tag}}}} \\\\\n`,
                    {flag: 'a'});
            }
            // stem
            fs.writeFileSync(this.#texPath, `${question.stem}\n`, {flag: 'a'});
            fs.writeFileSync(this.#texPath, '\\begin{enumerate}\n', {flag: 'a'}); // answers
            // key
            fs.writeFileSync(this.#texPath, `\\item \\begin{boxedtext}${question.key.text}\\end{boxedtext}\n`, {flag: 'a'});
            question.distractors.forEach(d => {
                fs.writeFileSync(this.#texPath, `\\item ${d.text}\n`, {flag: 'a'});
            });
            fs.writeFileSync(this.#texPath, '\\end{enumerate}\n\n', {flag: 'a'}); // answers
        });
        fs.writeFileSync(this.#texPath, '\\end{enumerate}\n\n', {flag: 'a'}); // questions

        this.#newpage()
    }

    #newpage() {
        fs.writeFileSync(this.#texPath, '\\newpage\n\n', {flag: 'a'});
    }
}

module.exports = ExamVersionCompiler;

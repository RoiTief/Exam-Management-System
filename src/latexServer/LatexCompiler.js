const path = require("path");
const fs = require("fs");
const {exec} = require("child_process");
const { DEFAULT_LATEX_CONFIG  }= require('./config')
const test = require("node:test");

const PDF_DIR = 'pdfs';

const EXTENSIONS = {
    TEX: '.tex',
    LOG: '.log',
    AUX: '.aux',
    PDF: '.pdf',
}

Array.prototype.scramble = function() {
    let currentIndex = this.length;

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {

        // Pick a remaining element...
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [this[currentIndex], this[randomIndex]] = [
            this[randomIndex], this[currentIndex]];
    }
    return this;
}

class LatexCompiler {
    #preamble
    #opening
    #closing
    #pdfDirPath

    constructor() {
        this.#preamble = DEFAULT_LATEX_CONFIG.PREAMBLE;
        this.#opening = DEFAULT_LATEX_CONFIG.OPENING;
        this.#closing = DEFAULT_LATEX_CONFIG.CLOSING;
        this.#pdfDirPath = path.join(__dirname, PDF_DIR);

        if (!fs.existsSync(this.#pdfDirPath)) {
            fs.mkdirSync(this.#pdfDirPath);
        }
    }

    /**
     * Compiles given code as is and sends the pdf to the callback.
     * @param latexCode Plain Latex code to compile
     * @param callback Callback that handles failure/success of the compilation
     */
    compileNormal(latexCode, callback) {
        const timestamp = Date.now();
        const filename = timestamp;
        const texPath = path.join(this.#pdfDirPath, filename + EXTENSIONS.TEX);

        // write latex code to the file
        fs.writeFileSync(texPath, this.#preamble);
        fs.writeFileSync(texPath, this.#opening, {flag: 'a'});
        fs.writeFileSync(filename, "\\pagenumbering{gobble}\n");
        fs.writeFileSync(texPath, latexCode, {flag : 'a'});
        fs.writeFileSync(texPath, this.#closing, {flag : 'a'});

        this.#compile(filename, callback)
    }

    /**
     * Compiles given metaQuestion JSON to Meta-Question format and sends the pdf to the callback.
     * @param metaQuestion JSON holding all information needed to generate the MQ.
     * @param callback Callback that handles failure/success of the compilation
     */
    compileMetaQuestion(metaQuestion, callback) {
        if (!this.#isJsonObject(metaQuestion)) {
            return callback(new Error("Not a JSON object"), null);
        }
        const timestamp = Date.now();
        const filename = timestamp;
        const texPath = path.join(this.#pdfDirPath, filename + EXTENSIONS.TEX);

        // write the preamble + open document
        fs.writeFileSync(texPath,
            `${this.#preamble}\n`
            + "\\usepackage[margin=2cm, paperheight=550cm]{geometry}\n"
            + `${this.#opening}\n`
            + "\\pagenumbering{gobble}\n");

        // write the stem
        if (metaQuestion.hasOwnProperty('stem')) {
            fs.writeFileSync(texPath, "\\section*{Stem:}\n", {flag : 'a'});
            fs.writeFileSync(texPath, metaQuestion.stem, {flag : 'a'});
            fs.writeFileSync(texPath, "\n\\\\\n", {flag : 'a'});
        }

        // write the keys
        if (metaQuestion.hasOwnProperty('keys')) {
            fs.writeFileSync(texPath, "\\section*{Keys:}\n", {flag : 'a'});
            fs.writeFileSync(texPath, "\\begin{itemize}\n", {flag : 'a'});
            metaQuestion.keys.forEach((key) => {
                fs.writeFileSync(texPath,
                    `\t\\item ${key.text} \\\\ \\textbf{Explanation:} ${key.hasOwnProperty('explanation') ? key.explanation : 'none'}\n`,
                    {flag: 'a'});

            })
            fs.writeFileSync(texPath, "\\end{itemize}\n", {flag : 'a'});
        }

        // write the distractors
        if (metaQuestion.hasOwnProperty('distractors')) {
            fs.writeFileSync(texPath, "\\section*{Distractors:}\n", {flag : 'a'});
            fs.writeFileSync(texPath, "\\begin{itemize}\n", {flag : 'a'});
            metaQuestion.distractors.forEach((distractor) => {
                fs.writeFileSync(texPath,
                    `\t\\item ${distractor.text} \\\\ \\textbf{Explanation:} ${distractor.hasOwnProperty('explanation') ? distractor.explanation : 'none'}\n`,
                    {flag: 'a'});
            })
            fs.writeFileSync(texPath, "\\end{itemize}\n", {flag : 'a'});
        }

        // write the appendix
        if (metaQuestion.hasOwnProperty('appendix')) {
            fs.writeFileSync(texPath, "\\section*{Appendix:}\n", {flag : 'a'});
            fs.writeFileSync(texPath, metaQuestion.appendix.content, {flag : 'a'});
            fs.writeFileSync(texPath, "\n\\\\\n", {flag : 'a'});
        }

        // close document
        fs.writeFileSync(texPath, this.#closing, {flag : 'a'});

        this.#compile(filename, (err, pdfPath) => {
            if (err) {
                return callback(err, null);
            }
            // after successful latex compilation crop trailing whitespace
            exec(`cd ${this.#pdfDirPath} && pdfcrop --margins \'30 30 30 30\' ${pdfPath} ${pdfPath}`, (error, stdout, stderr) => {
                if (error) {
                    console.error(`pdfcrop Error: ${stdout}`);
                    return callback(error, null);
                }
                callback(null, pdfPath);
            });
        })
    }

    /**
     * Compiles given exam JSON to test format and sends the pdf to the callback.
     * @param exam JSON holding all information needed to generate the test.
     * @param callback Callback that handles failure/success of the compilation
     */
    compileExam(exam, callback) {
	    console.log(exam);
        if (!Array.isArray(exam)) {
            return callback(new Error("Not an array"), null);
        }
        const timestamp = Date.now();
        const filename = timestamp;
        const texPath = path.join(this.#pdfDirPath, filename + EXTENSIONS.TEX);

        const appendicesMap = {};
        let appendixNumbering = 1;

        // write the preamble + open document
        fs.writeFileSync(texPath,
            `${this.#preamble}\n`
            + `${DEFAULT_LATEX_CONFIG.EXAM_PREAMBLE}\n`
            + `${this.#opening}\n`);

        // Print questions
        fs.writeFileSync(texPath, '\\section{Questions} \n', {flag: 'a'});
        fs.writeFileSync(texPath, DEFAULT_LATEX_CONFIG.QUESTION_COMMANDS, {flag: 'a'});

        fs.writeFileSync(texPath, '\\begin{enumerate}\n', {flag: 'a'}); // questions
        exam.forEach((question)  => {
            fs.writeFileSync(texPath, '\\item ', {flag: 'a'});
            // Relate to appendix
            if (question.hasOwnProperty('appendix')) {
                if (!appendicesMap.hasOwnProperty(question.appendix.tag)) {
                    appendicesMap[question.appendix.tag] = question.appendix;
                    appendicesMap[question.appendix.tag]['number'] = appendixNumbering++;
                }
                const appendixNumber = appendicesMap[question.appendix.tag].number;
                fs.writeFileSync(texPath,
                    `\\textbf{This question relates to appendix 2.${appendixNumber} in page {\\zpageref{app:${question.appendix.tag}}}} \\\\\n`,
                    {flag: 'a'});
            }
            // stem
            fs.writeFileSync(texPath, `${question.stem}\n`, {flag: 'a'});
            // scrambled answers
            question['scrambled'] = question.distractors
                .map(d => d.text)
                .concat(question.key.text)
                .scramble();
            fs.writeFileSync(texPath, '\\begin{enumerate}\n', {flag: 'a'}); // answers
            question.scrambled.forEach(answer => {
                fs.writeFileSync(texPath, `\\item ${answer}\n`, {flag: 'a'});
            });
            fs.writeFileSync(texPath, '\\end{enumerate}\n\n', {flag: 'a'}); // answers
        });
        fs.writeFileSync(texPath, '\\end{enumerate}\n\n', {flag: 'a'}); // questions

        fs.writeFileSync(texPath, '\\newpage\n\n', {flag: 'a'});

        // Print appendices
        fs.writeFileSync(texPath, '\\section{Appendices} \n\n', {flag: 'a'});

        Object.values(appendicesMap)
            .sort((a, b) => a.number - b.number)
            .forEach(appendix => {
                fs.writeFileSync(texPath,
                    `\\subsection{${appendix.title}}\n` +
                    `\\zlabel{app:${appendix.tag}}\n` +
                    `${appendix.content} \n\n`,
                    {flag: 'a'});
            });

        fs.writeFileSync(texPath, '\\newpage\n\n', {flag: 'a'});

        // Print answer sheet
        fs.writeFileSync(texPath, '\\section*{Answer Sheet} \n', {flag: 'a'});
        fs.writeFileSync(texPath, `${DEFAULT_LATEX_CONFIG.ANSWER_SHEET_COMMANDS}\n`, {flag: 'a'});

        fs.writeFileSync(texPath, '\\begin{multicols}{3} \\begin{enumerate}\n', {flag: 'a'}); // answer sheet
        exam.forEach((question) => {
            fs.writeFileSync(texPath, `\\item \\unsolved{${question.scrambled.length}}\n`, {flag: 'a'});
        })
        fs.writeFileSync(texPath, '\\end{enumerate} \\end{multicols}\n\n', {flag: 'a'}); // answer sheet

        fs.writeFileSync(texPath, '\\newpage\n\n', {flag: 'a'});

        // Print solved answer sheet
        fs.writeFileSync(texPath, '\\section*{Solved Answer Sheet} \n', {flag: 'a'});

        fs.writeFileSync(texPath, '\\begin{multicols}{3} \\begin{enumerate}\n', {flag: 'a'}); // solved answer sheet
        exam.forEach((question) => {
            fs.writeFileSync(texPath, `\\item \\solved{${question.scrambled.length}}{${question.scrambled.indexOf(question.key.text) + 1}}\n`, {flag: 'a'});
        })
        fs.writeFileSync(texPath, '\\end{enumerate} \\end{multicols}\n\n', {flag: 'a'}); // solved answer sheet

        fs.writeFileSync(texPath, '\\newpage\n\n', {flag: 'a'});

        // Print solved questions
        fs.writeFileSync(texPath, '\\section*{Solved Questions} \n', {flag: 'a'});
        fs.writeFileSync(texPath, '\\begin{enumerate}\n', {flag: 'a'}); // questions
        exam.forEach((question)  => {
            fs.writeFileSync(texPath, '\\item ', {flag: 'a'});
            // Relate to appendix
            if (question.hasOwnProperty('appendix')) {
                const appendixNumber = appendicesMap[question.appendix.tag].number;
                fs.writeFileSync(texPath,
                    `\\textbf{This question relates to appendix 2.${appendixNumber} in page {\\zpageref{app:${question.appendix.tag}}}} \\\\\n`,
                    {flag: 'a'});
            }
            // stem
            fs.writeFileSync(texPath, `${question.stem}\n`, {flag: 'a'});
            fs.writeFileSync(texPath, '\\begin{enumerate}\n', {flag: 'a'}); // answers
            // key
            fs.writeFileSync(texPath, `\\item \\begin{boxedtext}${question.key.text}\\end{boxedtext}\n`, {flag: 'a'});
            question.distractors.forEach(d => {
                fs.writeFileSync(texPath, `\\item ${d.text}\n`, {flag: 'a'});
            });
            fs.writeFileSync(texPath, '\\end{enumerate}\n\n', {flag: 'a'}); // answers
        });
        fs.writeFileSync(texPath, '\\end{enumerate}\n\n', {flag: 'a'}); // questions

        // close document
        fs.writeFileSync(texPath, this.#closing, {flag : 'a'});

        this.#compile(filename, callback)
    }

    /**
     * Compiles the file and send it bash
     * @param filename File to be compiled.
     * @param callback Callback that handles failure/success of the compilation
     */
    #compile(filename, callback) {
        const texPath = path.join(this.#pdfDirPath, filename + EXTENSIONS.TEX);
        const pdfPath = path.join(this.#pdfDirPath, filename + EXTENSIONS.PDF);

        exec(`cd ${this.#pdfDirPath} && xelatex -interaction=nonstopmode ${texPath}`, (error, stdout, stderr) => {
            if (error) {
                console.log(`xelatex Error: ${stdout}`);
                return callback(error, null);
            }
            callback(null, pdfPath);

            this.#clean(filename);
        });
    }

    /**
     * Cleans leftovers from compilation
     * @param filename File whose leftovers should be cleaned
     */
    #clean(filename) {
        const texPath = path.join(this.#pdfDirPath, filename + EXTENSIONS.TEX);
        const logPath = path.join(this.#pdfDirPath, filename + EXTENSIONS.LOG);
        const auxPath = path.join(this.#pdfDirPath, filename + EXTENSIONS.AUX);
 //       fs.unlinkSync(texPath);
        fs.unlinkSync(logPath);
        fs.unlinkSync(auxPath);
    }

    #isJsonObject(param) {
        return param !== null &&
            typeof param === 'object' &&
            !Array.isArray(param) &&
            Object.prototype.toString.call(param) === '[object Object]';
    }

    /**
     * Shuffle given array's elements in a random order
     * @param array array to shuffle
     */
    #shuffle(array) {
        let currentIndex = array.length;

        // While there remain elements to shuffle...
        while (currentIndex !== 0) {

            // Pick a remaining element...
            let randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }
    }
}

const latexCompiler = new LatexCompiler();

module.exports = latexCompiler;

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

                this.#clean(filename);
            });
        })
    }

    /**
     * Compiles given test JSON to test format and sends the pdf to the callback.
     * @param test JSON holding all information needed to generate the test.
     * @param callback Callback that handles failure/success of the compilation
     */
    compileTest(test, callback) {
        if (!this.#isJsonObject(test)) {
            return callback(new Error("Not a JSON object"), null);
        }
        const timestamp = Date.now();
        const filename = timestamp;
        const texPath = path.join(this.#pdfDirPath, filename + EXTENSIONS.TEX);

        const dummy = "\\begin{Huge}\n"
            + "You have just compiled\n"
            + "\\begin{equation*}\n"
            + "\\frac{a}{Test}\n"
            + "\\end{equation*}\n"
            + "\\end{Huge}\n"

        // write latex code to the file
        fs.writeFileSync(texPath, this.#preamble);
        fs.writeFileSync(texPath, this.#opening, {flag: 'a'});
        fs.writeFileSync(texPath, dummy, {flag : 'a'});
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

        exec(`cd ${this.#pdfDirPath} && xelatex ${texPath}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`xelatex Error: ${stdout}`);
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
        fs.unlinkSync(texPath);
        fs.unlinkSync(logPath);
        fs.unlinkSync(auxPath);
    }

    #isJsonObject(param) {
        return param !== null &&
            typeof param === 'object' &&
            !Array.isArray(param) &&
            Object.prototype.toString.call(param) === '[object Object]';
    }
}

const latexCompiler = new LatexCompiler();

module.exports = latexCompiler;

const path = require("path");
const fs = require("fs");
const {exec} = require("child_process");
const { DEFAULT_LATEX_CONFIG  }= require('./config')

const PDF_DIR = 'pdfs';

const EXTENSIONS = {
    TEX: '.tex',
    LOG: '.log',
    AUX: '.aux',
    PDF: '.pdf',
}

class LatexCompiler {
    #opening
    #closing
    #pdfDirPath

    constructor() {
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
        fs.writeFileSync(texPath, this.#opening);
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
        const timestamp = Date.now();
        const filename = timestamp;
        const texPath = path.join(this.#pdfDirPath, filename + EXTENSIONS.TEX);

        const dummy = "\\begin{Huge}\n"
            + "You have just compiled\n"
            + "\\begin{equation*}\n"
            + "\\frac{a}{Meta-Question}\n"
            + "\\end{equation*}\n"
            + "\\end{Huge}\n"

        // write latex code to the file
        fs.writeFileSync(texPath, this.#opening);
        fs.writeFileSync(texPath, dummy, {flag : 'a'});
        fs.writeFileSync(texPath, this.#closing, {flag : 'a'});

        this.#compile(filename, callback)
    }

    /**
     * Compiles given test JSON to test format and sends the pdf to the callback.
     * @param test JSON holding all information needed to generate the test.
     * @param callback Callback that handles failure/success of the compilation
     */
    compileTest(test, callback) {
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
        fs.writeFileSync(texPath, this.#opening);
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
                console.error(`xelatex Error: ${stderr}`);
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
}

const latexCompiler = new LatexCompiler();

module.exports = latexCompiler;
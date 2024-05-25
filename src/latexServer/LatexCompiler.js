const path = require("path");
const fs = require("fs");
const {exec} = require("child_process");
const DEFAULT_LATEX_CONFIG = require('./config')

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

    constructor() {
        this.#opening = DEFAULT_LATEX_CONFIG.OPENING;
        this.#closing = DEFAULT_LATEX_CONFIG.CLOSING;
    }


    compile(latexCode, callback) {
        const timestamp = Date.now();
        const filename = timestamp;
        const texPath = path.join(__dirname, PDF_DIR, filename + EXTENSIONS.TEX);

        fs.writeFileSync(texPath, this.#opening);
        fs.writeFileSync(texPath, latexCode, {flag : 'a'});
        fs.writeFileSync(texPath, this.#closing, {flag : 'a'});

        exec(`cd ${PDF_DIR} && xelatex ${texPath}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`xelatex Error: ${stderr}`);
                return callback(error, null);
            }
            const pdfPath = path.join(__dirname, PDF_DIR, filename + EXTENSIONS.PDF);
            callback(null, pdfPath);

            const logPath = path.join(__dirname, PDF_DIR, filename + EXTENSIONS.LOG);
            const auxPath = path.join(__dirname, PDF_DIR, filename + EXTENSIONS.AUX);
            fs.unlinkSync(texPath);
            fs.unlinkSync(logPath);
            fs.unlinkSync(auxPath);
        });
    }
}

const latexCompiler = new LatexCompiler();

module.exports = latexCompiler;
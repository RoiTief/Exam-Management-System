const path = require("node:path");
const fs = require("node:fs");
const { exec } = require("node:child_process");
const {EMSError, LATEX_COMPILATION_FAILED} = require("../EMSError");

class LatexCompiler {
    async compile(latexCode, res) {
        const filePath = path.join(__dirname, 'document.tex');
        let pdfPath;

        await fs.writeFileSync(filePath, latexCode);

        await exec(`xelatex ${filePath}`, (error, stdout, stderr) => {
            if (error) {
                throw new EMSError(error.message, LATEX_COMPILATION_FAILED);
            }

            pdfPath = path.join(__dirname, 'document.pdf');
            res.sendFile(pdfPath)
            fs.unlinkSync(filePath);
            fs.unlinkSync(pdfPath);
        });

        return pdfPath;
    }

    getFilePath() {
        return  path.join(__dirname, 'document.tex');
    }
}

module.exports = LatexCompiler;
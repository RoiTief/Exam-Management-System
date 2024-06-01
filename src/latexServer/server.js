const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors')

const latexCompiler = require('./LatexCompiler')
const {LATEX_SERVER} = require("./config");

const app = express();
const upload = multer();
const port = LATEX_SERVER.PORT;

app.use(bodyParser.json());
app.use(cors());

const compileCallback = (res) => {
    return (err, pdfPath) => {
        if (err) {
	    const message = `Error compiling: ${err.message}`;
	    console.log(message);
            res.status(500).send(message);
            return;
        }
        res.sendFile(pdfPath, (err) => {
            if (err) {
                res.status(500).send('Error sending PDF');
            }
        });
    }
}

app.post('/compile', upload.none(), (req, res) => {
    const latexCode = req.body.content;
    latexCompiler.compileNormal(latexCode, compileCallback(res));
});

app.post('/exam', upload.none(), (req, res) => {
    const test = req.body.content;
    latexCompiler.compileExam(test, compileCallback(res));
});

app.post('/metaQuestion', upload.none(), (req, res) => {
    const metaQuestion = req.body.content;
    latexCompiler.compileMetaQuestion(metaQuestion, compileCallback(res));
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors')

const latexCompiler = require('./LatexCompiler')

const app = express();
const upload = multer();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());

app.post('/compile', upload.none(), (req, res) => {
    const latexCode = req.body.latexCode;
    latexCompiler.compile(latexCode, (err, pdfPath) => {
        if (err) {
            res.status(500).send('Error compiling LaTeX');
            return;
        }
        res.sendFile(pdfPath, (err) => {
            if (err) {
                console.error('Error sending PDF:', err);
                res.status(500).send('Error sending PDF');
            }
        });
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

const initSequelize = require("../main/DAL/Sequelize");
const {presentationDbConfig} = require("../main/DAL/Configurations");
const {ANSWER_TYPES, USER_TYPES} = require("../main/Enums");
const MetaQuestionRepository = require("../main/DAL/MetaQuestion/MetaQuestionRepository");
const defineMetaQuestionModel = require("../main/DAL/MetaQuestion/MetaQuestion");
const defineAppendixModel = require("../main/DAL/MetaQuestion/Appendix");
const defineAnswerModel = require("../main/DAL/MetaQuestion/Answer");

const appendicesToAdd = [
    {
        title: "Euler's identity: ",
        tag: "euler identity",
        content: "\\setlength{\\fboxsep}{10pt} % Set the padding (default is 3pt)\n"
            + "\\fbox{\\huge $e^{i\\theta} = \\cos{\\theta} + i\\sin{\\theta}$}",
    },
    {
        title: "Drawings: ",
        tag: "SquareCircle",
        content: "\\begin{tikzpicture}\n" +
            "    % Draw the outer square border\n" +
            "    \\draw[thick] (-0.5, 1) rectangle (3, -3);\n" +
            "\n" +
            "    % Drawing of a square with equation\n" +
            "    \\node at (0, 0) {\\(S = \\)};\n" +
            "    \\draw (0.5, -0.5) rectangle (1.5, 0.5);\n" +
            "    \\node at (2, 0) {\\(= 3\\)};\n" +
            "    \n" +
            "    % Drawing of a circle with equation\n" +
            "    \\node at (0, -2) {\\(C = \\)};\n" +
            "    \\draw (1, -2) circle (0.5);\n" +
            "    \\node at (2, -2) {\\(= 5\\)};\n" +
            "\\end{tikzpicture}",
    }, /*
    {
        title: "Mor's ID",
        tag: "morID",
        content: "imagine there is my id here",
    },
    {
        title: "Roi picture",
        tag: "roiPic",
        content: "an embarrassing picture of roi"
    },
    */
];

const questionsToAdd = [
    {
        stem: '$e^{i\\pi} + 1 = $',
        appendixTag: 'euler identity',
        answers: [
            {
                content: '0',
                explanation: 'Using Euler\'s identity',
                tag: ANSWER_TYPES.KEY,
            },
            {
                content: '$\\frac{what}{\\frac{The}{FUCK}}$',
                explanation: 'This is a fraction?',
                tag: ANSWER_TYPES.DISTRACTOR,
            },
            {
                content: '\\begin{turn}{180}This answer is upside-down\\end{turn}',
                explanation: 'Rotated answer',
                tag: ANSWER_TYPES.DISTRACTOR,
            }, {
                content: '$\\mathbb{N}\\mathbb{I}\\mathbb{C}\\mathbb{E}$',
                explanation: 'This is nice, but not close to the answer.',
                tag: ANSWER_TYPES.DISTRACTOR,
            }
        ],
        keywords: ['key1', 'key2', 'euler'],
    },
    {
        stem: '$ C + S = \\underline{\\hspace{1cm}} $\n',
        appendixTag: 'SquareCircle',
        answers: [
            {
                content: '8',
                explanation: '',
                tag: ANSWER_TYPES.KEY,
            },
            {
                content: '$10 - 2$',
                explanation: '',
                tag: ANSWER_TYPES.KEY,
            },
            {
                content: '1',
                explanation: '',
                tag: ANSWER_TYPES.DISTRACTOR,
            },
            {
                content: '2',
                explanation: '',
                tag: ANSWER_TYPES.DISTRACTOR,
            },
            {
                content: '3',
                explanation: '',
                tag: ANSWER_TYPES.DISTRACTOR,
            },
            {
                content: '4',
                explanation: '',
                tag: ANSWER_TYPES.DISTRACTOR,
            },
            {
                content: '5',
                explanation: '',
                tag: ANSWER_TYPES.DISTRACTOR,
            },
            {
                content: '6',
                explanation: '',
                tag: ANSWER_TYPES.DISTRACTOR,
            },
        ],
        keywords: ['key1', 'computation', 'SquareCircle'],
    },
    {
        stem: 'Which of these shapes can you see in the picture?\n',
        appendixTag: 'SquareCircle',
        answers: [
            {
                content: 'Square',
                explanation: '',
                tag: ANSWER_TYPES.KEY,
            },
            {
                content: 'Circle',
                explanation: '',
                tag: ANSWER_TYPES.KEY,
            },
            {
                content: 'Triangle',
                explanation: '',
                tag: ANSWER_TYPES.DISTRACTOR,
            },
            {
                content: 'Hexagon',
                explanation: '',
                tag: ANSWER_TYPES.DISTRACTOR,
            },
            {
                content: 'Dodecahedron',
                explanation: '',
                tag: ANSWER_TYPES.DISTRACTOR,
            },
            {
                content: 'Sphere',
                explanation: '',
                tag: ANSWER_TYPES.DISTRACTOR,
            },
            {
                content: 'All answers are correct.',
                explanation: '',
                tag: ANSWER_TYPES.DISTRACTOR,
            },
        ],
        keywords: ['key1', 'computation', 'SquareCircle'],
    },
    {
        stem: 'which of the following statements is true?',
        answers: [
            {
                content: 'The sky is blue.',
                tag: ANSWER_TYPES.KEY,
            },
            {
                content: 'Water is wet.',
                tag: ANSWER_TYPES.KEY,
            },
            {
                content: 'The Earth orbits the Sun.',
                tag: ANSWER_TYPES.KEY,
            },
            {
                content: 'Fire is hot.',
                tag: ANSWER_TYPES.KEY,
            },
            {
                content: 'Honey Never Spoils.',
                tag: ANSWER_TYPES.KEY,
            },
            {
                content: 'Bananas are Berries.',
                tag: ANSWER_TYPES.KEY,
            },
            {
                content: 'Octopuses Have Three Hearts.',
                tag: ANSWER_TYPES.KEY,
            },
            {
                content: 'The Earth is flat.',
                tag: ANSWER_TYPES.DISTRACTOR,
            },
            {
                content: 'Fish can fly.',
                tag: ANSWER_TYPES.DISTRACTOR,
            },
            {
                content: 'The sun is cold.',
                tag: ANSWER_TYPES.DISTRACTOR,
            },
            {
                content: 'Humans can breathe underwater without equipment.',
                tag: ANSWER_TYPES.DISTRACTOR,
            },
            {
                content: 'Pigs can talk.',
                tag: ANSWER_TYPES.DISTRACTOR,
            },
            {
                content: 'Rocks are soft.',
                tag: ANSWER_TYPES.DISTRACTOR,
            },
            {
                content: 'Ice is hot.',
                tag: ANSWER_TYPES.DISTRACTOR,
            },
            {
                content: 'The moon is made of cheese.',
                tag: ANSWER_TYPES.DISTRACTOR,
            },
            {
                content: 'Trees can walk.',
                tag: ANSWER_TYPES.DISTRACTOR,
            },
            {
                content: 'Elephants are smaller than ants.',
                tag: ANSWER_TYPES.DISTRACTOR,
            },
            {
                content: 'The Great Wall of China is Visible from Space.',
                tag: ANSWER_TYPES.DISTRACTOR,
            },
            {
                content: 'Goldfish Have a Three-Second Memory.',
                tag: ANSWER_TYPES.DISTRACTOR,
            },
            {
                content: 'Humans Only Use 10% of Their Brain.',
                tag: ANSWER_TYPES.DISTRACTOR,
            },
            {
                content: 'Ostriches Bury Their Heads in the Sand.',
                tag: ANSWER_TYPES.DISTRACTOR,
            },
            {
                content: 'Shaving Hair Makes It Grow Back Thicker.',
                tag: ANSWER_TYPES.DISTRACTOR,
            },
            {
                content: 'You Swallow Eight Spiders a Year in Your Sleep.',
                tag: ANSWER_TYPES.DISTRACTOR,
            },
            {
                content: 'Elephants can fly.',
                tag: ANSWER_TYPES.DISTRACTOR,
            },
            {
                content: 'Cats can read human minds.',
                tag: ANSWER_TYPES.DISTRACTOR,
            },
            {
                content: 'Trees can talk.',
                tag: ANSWER_TYPES.DISTRACTOR,
            },
            {
                content: 'Rocks can grow like plants.',
                tag: ANSWER_TYPES.DISTRACTOR,
            },
        ],
        keywords: ['key1', 'key2', 'key3'],
    },
    /*
    {
        stem: 'what did Idan listen to when he was a kid',
        keys: [{content:'baby motzart', explanation: 'explanation1'}, {content:'baby bethoven', explanation: 'explanation2'}],
        distractors: [{content:'Machrozet Chaffla', explanation: 'explanation1'},
            {content:'zohar Argov', explanation: 'explanation2'}, {content:'Begins "tzachtzachim" speach', explanation: 'explanation3'}],
        keywords: ['key1', 'key2', 'key3'],
    },
    {
        stem: "what is Mor's last name",
        keys: [{content:'Abo', explanation: 'explanation1'},
            {content:'Abu', explanation: 'explanation2'}],
        distractors: [{content:'abow', explanation: 'explanation1'},
            {content:'abou', explanation: 'explanation2'}, {content:'aboo', explanation: 'explanation3'}],
        keywords: ['key1', 'key2', 'key5'],
        appendixTag: 'morID'
    },
    {
        stem: "What is Roi's nickname",
        keys: [{content:'The Tief', explanation: 'explanation1'},
            {content:"Gali's soon to be husband", explanation: 'explanation2'}],
        distractors: [{content:'that blonde guy', explanation: 'explanation1'},
            {content:'that tall guy', explanation: 'explanation2'}, {content:'the one with the black nail polish', explanation: 'explanation3'}],
        keywords: ['key1', 'key2', 'key5'],
        appendixTag: 'roiPic'
    },
    {
        stem: 'How old is Mor',
        keys: [{content:'25', explanation: 'explanation1'},
            {content:'22 with "vetek"', explanation: 'explanation2'}],
        distractors: [{content:'19 (but thank you)', explanation: 'explanation1'},
            {content:'30', explanation: 'explanation2'}, {content:'35', explanation: 'explanation3'}],
        keywords: ['key1', 'key2', 'key5'],
        appendix: 'morID'
    },
    {
        stem: 'where does Ofek live',
        keys: [{content:'in Gan Yavne', explanation: 'explanation1'},
            {content:'next to the orange square', explanation: 'explanation2'},
            {content:"next to mor's brother", explanation: 'explanation1'}],
        distractors: [{content:'at the beach - surffing', explanation: 'explanation1'},
            {content:'riding bike in the fields', explanation: 'explanation2'}, {content:"in may's house", explanation: 'explanation3'}],
        keywords: ['key1', 'key2', 'key3'],
    }
     */
];

describe('Resets PresentationDb "Users" table', () => {
    let sequelize;
    let Appendix;
    let MetaQuestion;
    let Answer;
    let metaQuestionRepo;

    beforeAll(async () => {
        sequelize = initSequelize(presentationDbConfig);
        await sequelize.authenticate();
        metaQuestionRepo = new MetaQuestionRepository(sequelize);
        Appendix = defineAppendixModel(sequelize);
        MetaQuestion = defineMetaQuestionModel(sequelize);
        Answer = defineAnswerModel(sequelize);
        await Appendix.sync({force: true}); // cleans the 'Appendixes' table
        await MetaQuestion.sync({force: true}); // cleans the 'MetaQuestions' table
        await Answer.sync({force: true}); // cleans the 'MetaQuestions' table
    });

    afterAll(async () => {
        await sequelize.close();
    });

    test('adds appendices to the database', async () => {
        appendicesToAdd.forEach(appendixData => {if (!appendixData.keywords) appendixData.keywords = [];});
        await Promise.all(
            appendicesToAdd.map(appendixData => metaQuestionRepo.addAppendix(appendixData, appendixData.keywords))
        );
    });

    test('adds meta-questions to the database', async () => {
        questionsToAdd.forEach(questionData => {
            questionData.answers = [
                ...(questionData.answers ? questionData.answers : []),
                ...(questionData.keys ? questionData.keys.map(key => ({...key, tag: ANSWER_TYPES.KEY })) : []),
                ...(questionData.distractors ? questionData.distractors.map(distractor => ({...distractor, tag: ANSWER_TYPES.DISTRACTOR})) : []),
            ];
            if (!questionData.keywords) questionData.keywords = [];
        })
        await Promise.all(
            questionsToAdd.map(questionData => metaQuestionRepo.addMetaQuestion(questionData, questionData.answers, questionData.keywords))
        );
    })
});
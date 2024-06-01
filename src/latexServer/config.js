const DEFAULT_LATEX_CONFIG = {
    PREAMBLE:
        "\\documentclass{article}\n" +
        "\\usepackage{amsmath}\n" +
        "\\usepackage{amsfonts}\n" +
        "\\usepackage{amssymb}\n" +
        "\\usepackage{rotating}\n",
    EXAM_PREAMBLE:
        "\\usepackage{zref}\n" +
        "\\usepackage{zref-user}\n" +
        "\\usepackage{multicol}\n" +
        "\\usepackage{tikz}\n",
    OPENING: "\\begin{document}\n",
    CLOSING: "\\end{document}\n",
    QUESTION_COMMANDS:
        "\\renewcommand{\\labelenumi}{\\arabic{enumi}.}\n" +
        "\\renewcommand{\\labelenumii}{(\\arabic{enumii})}\n",
    ANSWER_SHEET_COMMANDS:
        "\\renewcommand{\\labelenumi}{{\\large \\arabic{enumi}.}}\n" +
        "\\newcommand{\\circled}[1]{%\n" +
        "    \\tikz[baseline=(char.base)]{\n" +
        "      \\node[shape=circle,draw,fill=white,text=black,inner sep=1pt] (char) {\\sffamily #1};\n" +
        "    }\n" +
        "}\n" +
        "\\newcommand{\\blackcircled}[1]{%\n" +
        "    \\tikz[baseline=(char.base)]{\n" +
        "      \\node[shape=circle,draw,fill=black,text=white,inner sep=1pt] (char) {\\sffamily #1};\n" +
        "    }\n" +
        "}\n" +
        "\\newcommand{\\unsolved}[1]{%\n" +
        "    \\foreach \\x in {1,...,#1} {%\n" +
        "        \\circled{\\x}%\n" +
        "    }\n" +
        "}\n" +
        "\\newcommand{\\solved}[2]{%\n" +
        "  \\foreach \\x in {1,...,#1} {%\n" +
        "    \\ifnum \\x=#2% \n" +
        "        \\blackcircled{\\x}%\n" +
        "    \\else%\n" +
        "        \\circled{\\x}%\n" +
        "    \\fi%\n" +
        "  }\n" +
        "}\n",
    SOLVED_QUESTIONS_COMMANDS:
        "\\newenvironment{boxedtext}{%\n" +
        "    \\begin{tcolorbox}[colback=white,boxrule=0.5pt,colframe=black]%\n" +
        "}{%\n" +
        "    \\end{tcolorbox}%\n" +
        "}\n",
}

const LATEX_SERVER = {
    URL: 'http://164.90.223.94',
    PORT: 3001,
}

module.exports = { DEFAULT_LATEX_CONFIG, LATEX_SERVER };
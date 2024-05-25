const DEFAULT_LATEX_CONFIG = {
    OPENING: "\\documentclass{article}\n" +
        "\\usepackage{amsmath}\n" +
        "\\usepackage{amssymb}\n" +
        "\n" +
        "\\begin{document}\n",
    CLOSING: "\\end{document}\n",
}

const LATEX_SERVER = {
    URL: 'http://164.90.223.94',
    PORT: 3001,
}

module.exports = { DEFAULT_LATEX_CONFIG, LATEX_SERVER };
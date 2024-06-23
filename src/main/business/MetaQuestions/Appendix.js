
class Appendix {
    #dalAppendix

    constructor(dalAppendix) {
        this.#dalAppendix = dalAppendix;
    }

    getTag() {
        return this.#dalAppendix.tag;
    }

    getTitle() {
        return this.#dalAppendix.title;
    }

    async setTitle(newTitle) {
        this.#dalAppendix.title = newTitle;
        await this.#dalAppendix.save();
    }

    getContent() {
        return this.#dalAppendix.content;
    }

    async setContent(newContent) {
        this.#dalAppendix.content = newContent;
        await this.#dalAppendix.save();
    }

    getKeywords() {
        return this.#dalAppendix.keywords.map(dalKeyword => dalKeyword.word);
    }
}

module.exports = Appendix;
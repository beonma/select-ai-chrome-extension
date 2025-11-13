//@ts-nocheck
import Provider from "./Provider";

export default class GeminiNano extends Provider {
    constructor() {
        super();
    }

    private async *generator(prompt: string) {
        yield prompt;
    }

    public rephrase(content: string, tone: string): AsyncGenerator<string> {
        return this.generator(this.getRephrasePrompt(content, tone));
    }

    public fixSpelling(content: string): AsyncGenerator<string> {
        return this.generator(this.getFixSpellingPrompt(content));
    }
}

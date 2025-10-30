import Provider from "./Provider";

export default class GeminiNano extends Provider {
    constructor() {
        super();
    }

    private async *promptStreamGenerator(prompt: string) {
        if (window.LanguageModel === undefined || (await window.LanguageModel?.availability()) !== "available") {
            throw new Error("language model not available.");
        }

        const session = await window.LanguageModel.create({});
        const stream = session.promptStreaming(prompt);

        for await (const chunk of stream) {
            yield chunk;
        }
    }

    public rephrase(content: string, tone: string) {
        return this.promptStreamGenerator(this.getRephrasePrompt(content, tone));
    }

    public fixSpelling(content: string) {
        return this.promptStreamGenerator(this.getFixSpellingPrompt(content));
    }
}

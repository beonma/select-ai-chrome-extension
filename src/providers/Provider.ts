import type { ProviderPayload } from "@src/types";

export default abstract class Provider<P> {
    protected MODEL: string;
    protected abstract INSTANCE: P;

    constructor(payload: Omit<ProviderPayload, "host" | "apiKey">) {
        this.MODEL = payload.model;
    }

    protected abstract streamGenerator(prompt: string): AsyncGenerator<string>;

    private getRephrasePrompt(content: string, tone: string) {
        return `<text>${content}</text>\n\n<instructions>- rephrase text with a ${tone} tone\n- output should be as close as possible to text length\n- the output should be the result only</instructions>`;
    }

    private getFixSpellingPrompt(content: string) {
        return `<text>${content}</text>\n\n<instructions>- fix the spelling in text\n- output should be as close as possible to text length\n- the output should be the result only</instructions>`;
    }

    public rephrase(content: string, tone: string) {
        return this.streamGenerator(this.getRephrasePrompt(content, tone));
    }

    public fixSpelling(content: string) {
        return this.streamGenerator(this.getFixSpellingPrompt(content));
    }
}

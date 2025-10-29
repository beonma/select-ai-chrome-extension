export default abstract class Provider {
    protected getRephrasePrompt(content: string, tone: string) {
        return `<text>${content}</text>\n\n<instructions>- rephrase text with a ${tone} tone\n- output should be as close as possible to text length\n- the output should be the result only</instructions>`;
    }

    protected getFixSpellingPrompt(content: string) {
        return `<text>${content}</text>\n\n<instructions>- fix the spelling in text\n- output should be as close as possible to text length\n- the output should be the result only</instructions>`;
    }

    public abstract rephrase(content: string, tone: string): AsyncGenerator<string>;
    public abstract fixSpelling(content: string): AsyncGenerator<string>;
}

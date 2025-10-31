export default abstract class Provider {
    protected getRephrasePrompt(content: string, tone: string) {
        return `<text>${content}</text>\n\n<instructions>- rephrase text with a ${tone} tone.\n- output should be as close as possible to text length\n- the output should be the result only</instructions>`;
    }

    protected getFixSpellingPrompt(content: string) {
        return `<text>${content}</text>\n\n<instructions>- fix the spelling in text.\n- output should be as close as possible to text length\n- the output should be the result only</instructions>`;
    }

    protected getProofReadPrompt(content: string) {
        return `<text>${content}</text>\n\n<instructions>- proofread text for grammar, spelling, punctuation, clarity, and conciseness.\n- output should keep the same meaning, tone, and intent\n- output should be as close as possible to text length\n- the output should be the result only\n- output should be in plain text</instructions>`;
    }

    protected getSummarizePrompt(content: string) {
        return `<text>${content}</text>\n\n<instructions>- Summarize text, focusing on the main ideas and key details.\n- the output should be the result only\n- output should be in plain text</instructions>`;
    }

    protected getExplainPrompt(content: string) {
        return `<text>${content}</text>\n\n<instructions>- Explain text in simple, clear language.\n- output should be in plain text</instructions>`;
    }

    public abstract rephrase(content: string, tone: string): AsyncGenerator<string>;
    public abstract fixSpelling(content: string): AsyncGenerator<string>;
    public abstract proofRead(content: string): AsyncGenerator<string>;
    public abstract summarize(content: string): AsyncGenerator<string>;
    public abstract explain(content: string): AsyncGenerator<string>;
}

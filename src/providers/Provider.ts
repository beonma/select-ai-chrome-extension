export default abstract class Provider {
    protected getRephrasePrompt(content: string, tone: string) {
        return {
            systemPrompt:
                "You are a skilled editor that rewrites text in a " +
                tone +
                "tone, improve clarity, flow, and style without changing the original meaning.",
            userPrompt: content,
        };
    }

    protected getFixSpellingPrompt(content: string) {
        return {
            systemPrompt:
                "You are a spelling correction assistant. Your only job is to correct misspelled words in the user's text.",
            userPrompt: content,
            temperature: 0.3,
        };
    }

    protected getProofReadPrompt(content: string) {
        return {
            systemPrompt:
                "You are a precise proofreader. Correct grammar, spelling, and punctuation errors while preserving the writer's tone and meaning.",
            userPrompt: content,
            temperature: 0.5,
        };
    }

    protected getSummarizePrompt(content: string, headline: boolean = false) {
        const payload = {
            systemPrompt:
                "You are an expert summarizer. Your task is to produce clear and concise summaries that retain the main ideas and tone of the original text.\n\nFollow these rules:\nOutput should be in plain text.\nDo not use markdown.",
            userPrompt: content,
            temperature: 0.3,
        };

        if (headline) {
            payload.systemPrompt =
                "You are a creative copywriter who generates a single, clear, and engaging headline based on the user's text.\n\nFollow these rules:\nGenerate only one headline.\nHeadline should be in plain text.\nOutput headline should be at max 12 words.\nOutput should be the headline only.";
            payload.temperature = 0.8;
        }

        return payload;
    }

    protected getExplainPrompt(content: string) {
        return {
            systemPrompt:
                "You are an assistant that clearly explains the meaning or concept of any text or idea provided by the user.\n\nFollow these rules:\nOutput should be in plain text.\nDo not use markdown.",
            userPrompt: content,
            temperature: 0.4,
        };
    }

    public abstract rephrase(content: string, tone: string): AsyncGenerator<string>;
    public abstract fixSpelling(content: string): AsyncGenerator<string>;
    public abstract proofRead(content: string): AsyncGenerator<string>;
    public abstract summarize(content: string, headline: boolean): AsyncGenerator<string>;
    public abstract explain(content: string): AsyncGenerator<string>;
}

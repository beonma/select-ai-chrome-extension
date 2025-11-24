import Provider from "./Provider";
import type { StreamGeneratorPayload } from "./RESTProvider";

export default class GeminiNano extends Provider {
    constructor() {
        super();
    }

    private async *promptStreamGenerator(payload: StreamGeneratorPayload) {
        if (window.LanguageModel === undefined || (await window.LanguageModel?.availability()) !== "available") {
            throw new Error(
                "language model not available. Make sure you have the Prompt API for Gemini Nano flag enabled under the chrome flags and refresh.",
            );
        }

        const expectedLanguage: { type: "text"; languages: string[] }[] = [{ type: "text", languages: ["en"] }];

        const session = await window.LanguageModel.create({
            initialPrompts: [{ role: "system", content: payload.systemPrompt }],
            expectedInputs: expectedLanguage,
            expectedOutputs: expectedLanguage,
            temperature: payload.temperature ?? 0.5,
            topK: 40,
        });

        const stream = session.promptStreaming(payload.userPrompt);

        for await (const chunk of stream) {
            yield chunk;
        }

        session.destroy();
    }

    private async *rewriteStreamGenerator(prompt: string, context?: string) {
        if (window.Rewriter === undefined || (await window.Rewriter?.availability()) !== "available") {
            throw new Error(
                "rewriter model not available. Make sure you have the Rewriter API for Gemini Nano flag enabled under the chrome flags and refresh.",
            );
        }

        const session = await window.Rewriter.create({
            tone: "as-is",
            length: "as-is",
            format: "plain-text",
            expectedInputLanguages: ["en"],
            expectedContextLanguages: ["en"],
            outputLanguage: "en",
            sharedContext: context,
        });

        const stream = session.rewriteStreaming(prompt);

        for await (const chunk of stream) {
            yield chunk;
        }
    }

    private async *summarizeStreamGenerator(prompt: string, type: string) {
        if (window.Summarizer === undefined || (await window.Summarizer?.availability()) !== "available") {
            throw new Error(
                "summarizer model not available. Make sure you have the Summarizer API for Gemini Nano flag enabled under the chrome flags and refresh.",
            );
        }

        const session = await window.Summarizer.create({
            length: type === "headline" ? "medium" : (type as "medium" | "short" | "long"),
            format: "plain-text",
            type: type === "headline" ? "headline" : "tldr",
            expectedContextLanguages: ["en"],
            expectedInputLanguages: ["en"],
            outputLanguage: "en",
        });

        const stream = session.summarizeStreaming(prompt);

        for await (const chunk of stream) {
            yield chunk;
        }
    }

    public rephrase(content: string, tone: string) {
        return this.rewriteStreamGenerator(
            content,
            "You are a rewriting assistant that rewrites text in a " +
                tone +
                " tone while preserving its original meaning and key details.",
        );
    }

    public fixSpelling(content: string) {
        return this.rewriteStreamGenerator(content, "fix the spelling in the provided text.");
    }

    public proofRead(content: string) {
        return this.rewriteStreamGenerator(content, "proofread text for grammar, spelling, punctuation and clarity.");
    }

    public summarize(content: string, type: string) {
        return this.summarizeStreamGenerator(content, type);
    }

    public explain(content: string) {
        return this.promptStreamGenerator(this.getExplainPrompt(content));
    }
}

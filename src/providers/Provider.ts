import type { ProviderPayload } from "@src/types";

export default class Provider {
    private MODEL: string;
    private API_KEY: string;
    private ENDPOINT: string;

    constructor(payload: Omit<ProviderPayload, "host">) {
        this.MODEL = payload.model;
        this.API_KEY = payload.apiKey;
        this.ENDPOINT = payload.endpoint;
    }

    async *streamGenerator(prompt: string): AsyncGenerator<string> {
        const response = await fetch(this.ENDPOINT + "/chat/completions", {
            method: "POST",
            headers: {
                Authorization: "Bearer " + this.API_KEY,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                messages: [{ role: "user", content: prompt }],
                // model: "gemini-2.0-flash",
                model: this.MODEL,
                stream: true,
            }),
        });

        if (!response.ok) {
            throw new Error("request failed");
        }

        if (response.body === null) {
            throw new Error("response body is null");
        }

        const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
        let appendedChunks = "";

        while (true) {
            const { done, value } = await reader.read();

            if (appendedChunks.match(/(]|})\n\n$/)) {
                const parsedChunks: StreamResponse[] = appendedChunks
                    .split("\n")
                    .filter(el => el !== "" && !el.includes("[DONE]"))
                    .map(el => JSON.parse(el.substring(6)));

                for (let i = 0; parsedChunks.length > i; i++) {
                    const message = parsedChunks[i].choices[0].delta.content ?? "";
                    yield message;
                }

                appendedChunks = "";
            }

            if (done) {
                break;
            }

            appendedChunks += value;
        }
    }

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

interface StreamResponse {
    choices: {
        delta: {
            content?: string;
            role: "assistant";
        };
        index: number;
    }[];
    created: number;
    id: string;
    model: string;
    object: "chat.completion.chunk";
}

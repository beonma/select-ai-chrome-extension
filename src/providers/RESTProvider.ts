import { ProviderPayload } from "@src/types";
import Provider from "./Provider";

export default class RESTProvider extends Provider {
    private MODEL: string;
    private API_KEY: string;
    private ENDPOINT: string;

    constructor(payload: ProviderPayload) {
        super();
        this.MODEL = payload.model;
        this.API_KEY = payload.apiKey;
        this.ENDPOINT = payload.endpoint;
    }

    private async *streamGenerator(prompt: string): AsyncGenerator<string> {
        const response = await fetch(this.ENDPOINT + "/chat/completions", {
            method: "POST",
            headers: {
                Authorization: "Bearer " + this.API_KEY,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                messages: [{ role: "user", content: prompt }],
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

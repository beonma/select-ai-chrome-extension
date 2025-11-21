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

    private async *streamGenerator({
        systemPrompt,
        userPrompt,
        temperature = 0.8,
    }: StreamGeneratorPayload): AsyncGenerator<string> {
        const requestBody: CompletionRequestBody = {
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
            ],
            model: this.MODEL,
            stream: true,
            temperature: temperature,
        };

        const response = await fetch(this.ENDPOINT + "/chat/completions", {
            method: "POST",
            headers: {
                Authorization: "Bearer " + this.API_KEY,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            const errorObj: GroqErrorObject | GoogleErrorObject = await response.json();

            if (Array.isArray(errorObj)) {
                throw new Error(errorObj[0].error.message);
            }

            throw new Error(errorObj.error.message);
        }

        if (response.body === null) {
            throw new Error("response body is null.");
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

    public proofRead(content: string) {
        return this.streamGenerator(this.getProofReadPrompt(content));
    }

    public summarize(content: string, type: string) {
        return this.streamGenerator(this.getSummarizePrompt(content, type));
    }

    public explain(content: string) {
        return this.streamGenerator(this.getExplainPrompt(content));
    }
}

export type StreamGeneratorPayload = {
    systemPrompt: string;
    userPrompt: string;
    temperature?: number;
};

type StreamResponse = {
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
};

type CompletionRequestBody = {
    messages: {
        content: string;
        role: "system" | "user" | "assistant";
    }[];
    model: string;
    max_tokens?: number;
    frequency_penalty?: number;
    presence_penalty?: number;
    stop?: null | string[];
    stream?: boolean;
    stream_options?: { include_usage: boolean };
    temperature?: number;
    top_p?: number;
};

type GroqErrorObject = {
    error: {
        code: string;
        message: string;
        type: string;
    };
};

type GoogleErrorObject = {
    error: {
        code: number;
        message: string;
        status: string;
    };
}[];

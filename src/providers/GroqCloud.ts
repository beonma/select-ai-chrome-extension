import Provider from "./Provider";
import { Groq } from "groq-sdk";
import type { SDKProviderPayload } from "@src/types";

export default class GroqCloud extends Provider<Groq> {
    protected INSTANCE: Groq;

    constructor(payload: SDKProviderPayload) {
        super({ model: payload.model });
        this.INSTANCE = new Groq({ apiKey: payload.apiKey, dangerouslyAllowBrowser: true });
    }

    async *streamGenerator(prompt: string): AsyncGenerator<string> {
        const result = await this.INSTANCE.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: this.MODEL,
            stream: true,
        });

        for await (const chunk of result) {
            yield chunk.choices[0].delta.content ?? "";
        }
    }
}

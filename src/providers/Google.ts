import Provider from "./Provider";
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { SDKProviderPayload } from "@src/types";

export default class Google extends Provider<GoogleGenerativeAI> {
    INSTANCE: GoogleGenerativeAI;

    constructor(payload: SDKProviderPayload) {
        super({ model: payload.model });
        this.INSTANCE = new GoogleGenerativeAI(payload.apiKey);
    }

    protected async *streamGenerator(prompt: string): AsyncGenerator<string> {
        const result = await this.INSTANCE.getGenerativeModel({ model: this.MODEL }).generateContentStream(prompt);

        for await (const chunk of result.stream) {
            yield chunk.text();
        }
    }
}

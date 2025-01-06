import Anthropic from "@anthropic-ai/sdk";
import Provider from "./Provider";
import { SDKProviderPayload } from "@src/types";

export default class Claude extends Provider<Anthropic> {
    protected INSTANCE: Anthropic;

    constructor(payload: SDKProviderPayload) {
        super({ model: payload.model });
        this.INSTANCE = new Anthropic({ apiKey: payload.apiKey, dangerouslyAllowBrowser: true });
    }

    protected async *streamGenerator(prompt: string): AsyncGenerator<string> {
        const stream = this.INSTANCE.messages.stream({
            max_tokens: 2048,
            model: this.MODEL,
            messages: [{ role: "user", content: prompt }],
        });

        for await (const chunk of stream) {
            if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
                yield chunk.delta.text;
            }
        }
    }
}

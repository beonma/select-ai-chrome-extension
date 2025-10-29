import { SessionCredentialType } from "@src/types";
import Provider from "./Provider";
import providers from "../providers/providers.json";
import GeminiNano from "./GeminiNano";
import RESTProvider from "./RESTProvider";

export default function ({ model, apiKey, providerName }: SessionCredentialType): InstanceType<typeof Provider> {
    switch (providerName) {
        case "gemini-nano":
            return new GeminiNano();
        default: {
            const endpoint = providers[providerName].endpoint;
            return new RESTProvider({ apiKey, model, endpoint });
        }
    }
}

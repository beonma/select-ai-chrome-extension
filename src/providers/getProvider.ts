import { SessionCredentialType } from "@src/types";
import Provider from "./Provider";
import GroqCloud from "./GroqCloud";
import Google from "./Google";
import Claude from "./Claude";

export default function ({ providerName, model, apiKey }: SessionCredentialType): InstanceType<typeof Provider> {
    switch (providerName) {
        case "groq":
            return new GroqCloud({ model, apiKey });
        case "google":
            return new Google({ model, apiKey });
        case "anthropic":
            return new Claude({ model, apiKey });
    }
}

import { SessionCredentialType } from "@src/types";
import Provider from "./Provider";
import providers from "../providers/providers.json";

export default function ({ model, apiKey, providerName }: SessionCredentialType): InstanceType<typeof Provider> {
    const endpoint = providers[providerName].endpoint;
    return new Provider({ apiKey, model, endpoint });
}

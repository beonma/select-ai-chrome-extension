import PROVIDERS from "./providers/providers.json";

export type EditableElement = HTMLInputElement | HTMLTextAreaElement;
export type ProviderId = keyof typeof PROVIDERS;
export type Credential = {
    id: string;
    name: string;
    provider: ProviderId;
    model: string;
    apiKey: string;
    isDefault: boolean;
};

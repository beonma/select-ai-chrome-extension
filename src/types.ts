import PROVIDERS from "./providers/providers.json";

export type EditableElement = HTMLInputElement | HTMLTextAreaElement;
export type ProviderId = keyof typeof PROVIDERS;
export type Credential = {
    id: string;
    name: string;
    provider: ProviderId;
    model: string;
    apiKey: { encryptedData: string; iv: string };
    isDefault: boolean;
};

export type ProviderPayload = {
    model: string;
    apiKey: string;
    endpoint: string;
};

export type SDKProviderPayload = Pick<ProviderPayload, "model" | "apiKey">;

export type SessionCredentialType = SDKProviderPayload & { providerName: ProviderId };

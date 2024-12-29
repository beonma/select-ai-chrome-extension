import PROVIDERS from "./providers/providers.json";

export type EditableElement = HTMLInputElement | HTMLTextAreaElement;
export type ProviderId = keyof typeof PROVIDERS;

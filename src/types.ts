import PROVIDERS from "./providers/providers.json";

export type AvailabilityStatus = "unavailable" | "downloadable" | "downloading" | "available";

declare global {
    interface Window {
        Rewriter:
            | {
                  create: ({
                      tone,
                      format,
                      length,
                      sharedContext,
                  }: {
                      tone?: string;
                      format?: "as-is" | "markdown" | "plain-text";
                      length?: "as-is" | "shorter" | "longer";
                      sharedContext?: string;
                      expectedInputLanguages?: string[];
                      expectedContextLanguages?: string[];
                      outputLanguage?: string;
                  }) => Promise<{
                      rewrite: (
                          content: string,
                          { context, signal }?: { signal?: AbortController; context?: string },
                      ) => Promise<string>;
                      rewriteStreaming: (
                          content: string,
                          { context, signal }?: { signal?: AbortController; context?: string },
                      ) => string;
                      destroy: () => void;
                  }>;
                  availability: () => Promise<AvailabilityStatus>;
              }
            | undefined;
        Writer:
            | {
                  create: ({ test, bo }: { test?: string; bo?: number }) => Promise<string>;
                  availability: () => Promise<AvailabilityStatus>;
              }
            | undefined;
        Summarizer:
            | {
                  create: ({ test, bo }: { test?: string; bo?: number }) => Promise<string>;
                  availability: () => Promise<AvailabilityStatus>;
              }
            | undefined;
        LanguageModel:
            | {
                  create: ({ test, bo }: { test?: string; bo?: number }) => Promise<string>;
                  availability: () => Promise<AvailabilityStatus>;
              }
            | undefined;
        LanguageDetector:
            | {
                  create: ({ test, bo }: { test?: string; bo?: number }) => Promise<string>;
                  availability: () => Promise<AvailabilityStatus>;
              }
            | undefined;
    }
}

export type EditableElement = HTMLInputElement | HTMLTextAreaElement;
export type ProviderId = keyof typeof PROVIDERS;
export type Credential = {
    id: string;
    name: string;
    provider: ProviderId;
    model: string;
    apiKey?: { encryptedData: string; iv: string };
    isDefault: boolean;
};

export type ProviderPayload = {
    model: string;
    apiKey: string;
    endpoint: string;
};

export type SDKProviderPayload = Pick<ProviderPayload, "model" | "apiKey">;

export type SessionCredentialType = SDKProviderPayload & { providerName: ProviderId };

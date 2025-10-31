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
                      tone?: "as-is" | "more-formal" | "more-casual";
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
                      ) => AsyncGenerator<string>;
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
                  create: ({
                      format,
                      length,
                      sharedContext,
                      type,
                      outputLanguage,
                      expectedContextLanguages,
                      expectedInputLanguages,
                  }?: {
                      format?: "markdown" | "plain-text";
                      length?: "medium" | "short" | "long";
                      sharedContext?: string;
                      type?: "tldr" | "key-points" | "teaser" | "headline";
                      expectedInputLanguages?: string[];
                      expectedContextLanguages?: string[];
                      outputLanguage?: string;
                  }) => Promise<{
                      summarize: (
                          text: string,
                          { context, signal }?: { context?: string; signal?: AbortController },
                      ) => Promise<string>;
                      summarizeStreaming: (
                          text: string,
                          { context, signal }?: { context?: string; signal?: AbortController },
                      ) => AsyncGenerator<string>;
                      destroy: () => void;
                  }>;
                  availability: () => Promise<AvailabilityStatus>;
              }
            | undefined;
        LanguageModel:
            | {
                  create: ({
                      temperature,
                      topK,
                      initialPrompts,
                      expectedInputs,
                      expectedOutputs,
                  }?: {
                      temperature?: number;
                      topK?: number;
                      initialPrompts?: { role: "system" | "user" | "assistant"; content: string }[];
                      expectedInputs?: { type: "text"; languages: string[] }[];
                      expectedOutputs?: { type: "text"; languages: string[] }[];
                  }) => Promise<{
                      prompt: (
                          content: string,
                          {
                              context,
                              signal,
                              responseConstraint,
                              omitResponseConstraintInput,
                          }?: {
                              signal?: AbortController;
                              context?: string;
                              responseConstraint?: Record<string, unknown>;
                              omitResponseConstraintInput?: boolean;
                          },
                      ) => Promise<string>;
                      promptStreaming: (
                          content: string,
                          { context, signal }?: { signal?: AbortController; context?: string },
                      ) => AsyncGenerator<string>;
                      destroy: () => void;
                  }>;
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

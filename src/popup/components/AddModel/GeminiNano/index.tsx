import ModelBadge from "./ModelBadge";

// TODO change this array into a simple with keys, eg: {Rewriter: "Rewriter", LanguageModel: "Prompt"}
export const GEMINI_NANO_MODELS = [
    { name: "Rewriter", objectKey: "Rewriter" },
    // { name: "Writer", objectKey: "Writer" },
    { name: "Summarizer", objectKey: "Summarizer" },
    { name: "Prompt", objectKey: "LanguageModel" },
    // { name: "Language Detector", objectKey: "LanguageDetector" },
] as const;

export default function (): JSX.Element {
    return (
        <div className="flex flex-wrap gap-4 justify-start">
            <p>
                Ensure the required flags{" "}
                <code className="px-1 py-0.5 bg-gray-100 border border-gray-300 rounded">
                    Prompt API for Gemini Nano
                </code>{" "}
                and{" "}
                <code className="px-1 py-0.5 bg-gray-100 border border-gray-300 rounded">
                    Rewriter API for Gemini Nano
                </code>{" "}
                are enabled before proceeding. You can activate them by visiting{" "}
                <code className="px-1 py-0.5 bg-gray-100 border border-gray-300 rounded">chrome://flags</code>. This
                feature is experimental, may be unstable, and could be removed at any time.
            </p>
            {GEMINI_NANO_MODELS.map(model => (
                <ModelBadge key={model.objectKey} model={model} />
            ))}
        </div>
    );
}

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
        <div className="flex flex-wrap gap-4">
            <p className="text-red-600">
                Note that this feature is experimental, may be unstable, and could be removed in the future.
            </p>
            {GEMINI_NANO_MODELS.map(model => (
                <ModelBadge key={model.objectKey} model={model} />
            ))}
        </div>
    );
}

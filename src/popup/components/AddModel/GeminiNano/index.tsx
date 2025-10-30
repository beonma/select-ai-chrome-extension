import React from "react";
import ModelBadge from "./ModelBadge";

type Props = {};

export const GEMINI_NANO_MODELS = [
    { name: "Rewriter", objectKey: "Rewriter" },
    { name: "Writer", objectKey: "Writer" },
    { name: "Summarizer", objectKey: "Summarizer" },
    { name: "Prompt", objectKey: "LanguageModel" },
    { name: "Language Detector", objectKey: "LanguageDetector" },
] as const;

export default function (_props: Props): JSX.Element {
    return (
        <div className="flex flex-wrap gap-4">
            {GEMINI_NANO_MODELS.map(model => (
                <ModelBadge key={model.objectKey} model={model} />
            ))}
        </div>
    );
}

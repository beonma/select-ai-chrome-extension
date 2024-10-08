import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GOOGLE_AI_STUDIO_API_KEY as string;

const provider = new GoogleGenerativeAI(API_KEY);
const model = provider.getGenerativeModel({ model: "gemini-1.5-flash" });

export function rephrase(text: string, tone: string) {
    return model.generateContentStream(`
        prompt: rephrase the text given in the text property using a ${tone} tone, the rephrasing should be as close as possible to the content text length, the output should be the rephrased text only.
        text: ${text}.
        `);
}

export function fixSpelling(text: string) {
    return model.generateContentStream(`
        prompt: fix the spelling in the given text property, the fixing should be as close as possible to the content text length, the output should be the treated text only.
        text: ${text}.
        `);
}

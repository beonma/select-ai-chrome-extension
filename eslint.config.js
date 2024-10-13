import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config({
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["src/**/*.ts"],
    rules: {
        "no-console": ["warn", { allow: ["error", "warn"] }],
        // "prettier/prettier": ["warn", { endOfLine: "auto", bracketSpacing: true, printWidth: 100 }],
    },
});

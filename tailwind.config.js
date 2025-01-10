/** @type {import('tailwindcss').Config} */

import defaultTheme from "tailwindcss/defaultTheme";

export default {
    content: ["./src/popup/**/*.tsx", "./static/*.html"],
    theme: {
        extend: {
            fontFamily: {
                poppins: ["Poppins", ...defaultTheme.fontFamily.mono],
                poppinsSemiBold: ["Poppins-SemiBold", ...defaultTheme.fontFamily.mono],
            },
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
            },
            borderRadius: {
                lg: `var(--radius)`,
                md: `calc(var(--radius) - 4px)`,
                sm: "calc(var(--radius) - 8px)",
                xs: "calc(var(--radius) - 16px)",
            },
            keyframes: {
                fadeIn: {
                    "0%": { transform: "translateY(10px)", opacity: 0 },
                    "100%": { transform: "translateY(0px)", opacity: 1 },
                },
            },
            animation: {
                "fadeIn-1": "fadeIn 300ms ease",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};

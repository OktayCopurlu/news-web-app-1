/** @type {import('tailwindcss').Config} */
import typography from "@tailwindcss/typography";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        // UI and navigation (BBC-like sans)
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "Noto Sans",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
        // Article body and headlines (Times/NYT-like serif)
        serif: [
          "Merriweather",
          "ui-serif",
          "Georgia",
          "Cambria",
          "Times New Roman",
          "Times",
          "serif",
        ],
      },
      fontSize: {
        // Headlines and body sizes approximating major news sites
        "display-1": [
          "2.75rem",
          { lineHeight: "1.1", letterSpacing: "-0.01em" },
        ], // ~44px
        "display-2": [
          "2.25rem",
          { lineHeight: "1.15", letterSpacing: "-0.01em" },
        ], // ~36px
        headline: ["1.75rem", { lineHeight: "1.2" }], // ~28px
        subhead: ["1.25rem", { lineHeight: "1.35" }], // ~20px
        "body-lg": ["1.125rem", { lineHeight: "1.75" }], // 18px
        body: ["1rem", { lineHeight: "1.75" }], // 16px
        caption: ["0.875rem", { lineHeight: "1.4" }], // 14px
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            fontFamily: theme("fontFamily.serif").join(", "),
            h1: {
              fontFamily: theme("fontFamily.serif").join(", "),
              fontWeight: "800",
              fontSize: theme("fontSize.display-2")[0],
              lineHeight: theme("fontSize.display-2")[1].lineHeight,
            },
            h2: {
              fontFamily: theme("fontFamily.serif").join(", "),
              fontWeight: "800",
              fontSize: theme("fontSize.headline")[0],
            },
            h3: {
              fontFamily: theme("fontFamily.serif").join(", "),
              fontWeight: "700",
            },
            p: { fontSize: theme("fontSize.body-lg")[0] },
            a: { textDecoration: "none" },
            img: { borderRadius: "0px" },
          },
        },
        invert: {
          css: {
            color: theme("colors.gray.100"),
            a: { color: theme("colors.blue.300") },
          },
        },
      }),
    },
  },
  plugins: [typography],
};

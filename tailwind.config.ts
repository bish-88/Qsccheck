import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "\"Hiragino Sans\"",
          "\"Hiragino Kaku Gothic ProN\"",
          "\"Yu Gothic\"",
          "Meiryo",
          "sans-serif",
        ],
      },
      boxShadow: {
        soft: "0 12px 34px rgba(15, 23, 42, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;

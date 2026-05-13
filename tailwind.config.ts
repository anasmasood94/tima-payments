import type { Config } from "tailwindcss";

/** Palette aligned with B612 Tima Inc (b612ff.com). */
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#000000",
        body: "#545454",
        muted: "#747474",
        line: "#DFDFDF",
        panel: "#F5F5F5",
        decorative: "#D9D9D9",
        brand: {
          DEFAULT: "#43A047",
          dark: "#2E7D32",
          light: "#66BB6A",
          10: "rgba(67, 160, 71, 0.1)",
          15: "rgba(67, 160, 71, 0.15)",
          20: "rgba(67, 160, 71, 0.2)",
        },
        link: "#43A047",
        danger: "#E53E3E",
      },
      fontFamily: {
        sans: ["var(--font-montserrat)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-montserrat)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        ark: "0 0.21875rem 0.34375rem 0 rgba(0, 0, 0, 0.02)",
        "ark-card": "0 0.21875rem 0.34375rem 0 rgba(0, 0, 0, 0.02), 0 0.125rem 0.3125rem 0 rgba(0, 0, 0, 0.01)",
      },
      borderRadius: {
        ark: "0.625rem",
        "ark-outer": "1.875rem",
      },
    },
  },
  plugins: [],
};

export default config;

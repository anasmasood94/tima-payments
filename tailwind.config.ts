import type { Config } from "tailwindcss";

/** Palette aligned with Ark / Coderkubes login (Montserrat + brick accent). */
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
        brick: {
          DEFAULT: "#C04657",
          10: "rgba(192, 70, 87, 0.1)",
          15: "rgba(192, 70, 87, 0.15)",
          20: "rgba(192, 70, 87, 0.2)",
        },
        link: "#3B82F6",
        danger: "#E53E3E",
      },
      fontFamily: {
        sans: ["var(--font-montserrat)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-libre)", "ui-serif", "Georgia", "serif"],
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

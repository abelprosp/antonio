import type { Config } from "tailwindcss";

const withOpacity = (variable: string) =>
  `rgb(var(${variable}) / <alpha-value>)`;

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: withOpacity("--bg"),
        foreground: withOpacity("--fg"),
        card: withOpacity("--card"),
        border: withOpacity("--border"),
        muted: withOpacity("--muted"),
        accent: withOpacity("--accent"),
      },
      fontFamily: {
        display: ["\"Space Grotesk\"", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 18px 45px rgba(15, 23, 42, 0.08)",
        "soft-dark": "0 18px 45px rgba(0, 0, 0, 0.45)",
      },
      borderRadius: {
        xl: "16px",
        "2xl": "20px",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "float-up": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-4px)" },
        },
      },
      animation: {
        "fade-in": "fade-in 320ms ease-out forwards",
        "float-up": "float-up 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;

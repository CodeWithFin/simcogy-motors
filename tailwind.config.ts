import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        border: "var(--border)",
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        success: {
          DEFAULT: "var(--success)",
          foreground: "var(--success-foreground)",
        },
        ring: "var(--ring)",
        overlay: "var(--overlay)",
        "hero-fade": "var(--hero-fade)",
        /* Fixed brand exceptions — do not theme-shift */
        whatsapp: "#25D366",
        brand: {
          DEFAULT: "#e0a87e",
          50: "#fbf6f3",
          100: "#f5ebe3",
          200: "#ead0bd",
          300: "#deb596",
          400: "#e0a87e",
          500: "#d18d5e",
          600: "#c47648",
          700: "#a35e3a",
          800: "#854d34",
          900: "#6b402e",
        },
      },
      fontFamily: {
        sans: ["var(--font-figtree)", "sans-serif"],
        display: ["var(--font-oswald)", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};

export default config;

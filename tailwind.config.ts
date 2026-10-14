import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
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
        destructive: "var(--destructive)",
        success: "var(--success)",
        ring: "var(--ring)",

        solar: "var(--color-solar-yellow)",
        canyon: "var(--color-canyon-orange)",
        forest: "var(--color-forest-green)",
        sky: "var(--color-sky-blue)",
        slate: "var(--color-slate-blue)",
        graphite: "var(--color-graphite)",
        "pure-black": "var(--color-pure-black)",
        concrete: "var(--color-concrete)",
        ash: "var(--color-ash)",
        fog: "var(--color-fog)",
        steel: "var(--color-steel)",
        paper: "var(--color-paper)",
        chalk: "var(--color-chalk)",
        charcoal: "var(--color-charcoal)",
      },
      fontFamily: {
        sans: ["var(--font-adventure)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-liga)", "var(--font-adventure)", "ui-sans-serif", "sans-serif"],
      },
      fontSize: {
        caption: ["10px", { lineHeight: "1.43", letterSpacing: "0px" }],
        body: ["14px", { lineHeight: "1.55", letterSpacing: "-0.14px" }],
        "body-lg": ["16px", { lineHeight: "1.5", letterSpacing: "-0.16px" }],
        subheading: ["20px", { lineHeight: "1.33", letterSpacing: "-0.2px" }],
        "heading-sm": ["24px", { lineHeight: "1.25", letterSpacing: "-0.48px" }],
        "heading-md": ["32px", { lineHeight: "1.19", letterSpacing: "-0.672px" }],
        "heading-lg": ["44px", { lineHeight: "1.14", letterSpacing: "-1.364px" }],
        "heading-xl": ["56px", { lineHeight: "1.07", letterSpacing: "-2.016px" }],
        display: ["72px", { lineHeight: "1", letterSpacing: "-3.024px" }],
        "display-lg": ["120px", { lineHeight: "1", letterSpacing: "-5.4px" }],
        hero: ["360px", { lineHeight: "1", letterSpacing: "-7.92px" }],
      },
      spacing: {
        section: "80px",
        "section-lg": "112px",
      },
      maxWidth: {
        page: "1440px",
      },
      borderRadius: {
        input: "4px",
        icon: "8px",
        nav: "12px",
        card: "20px",
        image: "20px",
        button: "40px",
        chip: "99px",
      },
      boxShadow: {
        card: "0 4px 12px rgba(159, 161, 184, 0.15)",
        float: "0 8px 24px rgba(159, 161, 184, 0.2)",
        nav: "0 2px 8px rgba(0, 0, 0, 0.15)",
      },
    },
  },
  plugins: [],
};

export default config;

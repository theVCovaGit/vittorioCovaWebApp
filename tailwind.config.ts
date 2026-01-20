import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#19333F",
        secondary: "#4B6B70",
        accent: "#34d399",
        light: "#f5f5f5",  
        dark: "#333333",
        architecture: "#92a982",
        product: "#8494ac",
        film: "#d7c97c",
        art: "#bc76b1",
        cream: "#fef4dc",
        brown: "#5c4b4a",    
      },
      fontFamily: {
        basica: ['"Basica"', 'sans-serif'],
        electrolize: ['"Electrolize"', 'sans-serif'],
        barrel: ['"Barrel"', 'sans-serif'],
        minecraft: ['"Minecraft"', 'sans-serif'],
        microextend: ['"MicroExtendFLF-Bold"', 'sans-serif'],
        blurlight: ['"Blur Light"', 'sans-serif'],
      },
      spacing: {
        30: "7.5rem",      // 120px - for left-30
        72: "18rem",
        84: "21rem",
        96: "24rem",
        128: "32rem",      // For wider spacing in galleries
        screen: "100vh",   // Full screen height utility
      },
      screens: {
        xs: "475px",
        md: "768px",      // Better responsiveness
        lg: "1024px",
      },
      animation: {
        fadeIn: "fadeIn 0.5s ease-in-out",
        slideDown: "slideDown 0.3s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-10%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      typography: {
        DEFAULT: {
          css: {
            ul: {
              listStyleType: "disc",
              paddingLeft: "1.5rem",
            },
            ol: {
              listStyleType: "decimal",
              paddingLeft: "1.5rem",
            },
            li: {
              marginBottom: "0.25rem",
            },
            h1: {
              color: "var(--foreground)",
              fontWeight: "bold",
            },
            p: {
              color: "var(--foreground)",
              lineHeight: "1.6",
            },
          },
        },
      },
    },
    
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
  ],
} satisfies Config;


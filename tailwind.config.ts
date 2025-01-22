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
        background: "var(--background)", // Custom CSS variables
        foreground: "var(--foreground)", // Custom CSS variables
        primary: "#1a73e8", // Add primary color
        secondary: "#fbbc05", // Add secondary color
        accent: "#34d399", // Accent color for buttons or highlights
      },
      fontFamily: {
        sans: ['Arial', 'Helvetica', 'sans-serif'], // Default sans-serif stack
        serif: ['Georgia', 'serif'], // Default serif stack
        mono: ['Courier New', 'monospace'], // Default monospace stack
      },
      spacing: {
        72: "18rem", // Custom spacing value
        84: "21rem", // Custom spacing value
        96: "24rem", // Custom spacing value
      },
      screens: {
        xs: "475px", // Extra small screens for finer control
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"), // For blog styling
    require("@tailwindcss/forms"), // For better form styles
  ],
  corePlugins: {
    preflight: false, // Ensure Preflight is explicitly enabled
  },
} satisfies Config;


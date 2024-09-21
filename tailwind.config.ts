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
        primary: '#1E1F29',
        accent: '#0070F3',
        background: '#1E1F29',
        'light-gray': '#E0E0E0',
        'dark-gray': '#2C2C2C',
        'accent-dark': '#0053B3',
      }
    },
  },
  plugins: [],
};
export default config;

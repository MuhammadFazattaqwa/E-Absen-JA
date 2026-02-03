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
        army: {
          50: '#f5f7f4',
          100: '#e8ede5',
          200: '#d1dbc9',
          300: '#b0c2a4',
          400: '#8da67d',
          500: '#6d8a5e',
          600: '#556d49',
          700: '#44573b',
          800: '#384732',
          900: '#2f3b2a',
        },
        hijau: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        krem: {
          50: '#fdfcf8',
          100: '#faf7ed',
          200: '#f5efd6',
          300: '#ede2b8',
          400: '#e3cf8e',
          500: '#d9bc6c',
          600: '#cca550',
          700: '#b08943',
          800: '#8f6e39',
          900: '#755a31',
        },
      },
    },
  },
  plugins: [],
};
export default config;

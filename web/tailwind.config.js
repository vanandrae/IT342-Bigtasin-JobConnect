/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E7F0FA',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#0A65CC',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        warning: {
          50: '#FFF6E6',
          500: '#FFA500',
        },
        success: {
          50: '#E7F6EA',
          500: '#0BA02C',
        },
        danger: {
          500: '#E05151',
        },
      },
    },
  },
  plugins: [],
}
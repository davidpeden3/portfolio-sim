/** @type {import('tailwindcss').Config} */
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Dark mode colors derived from logo
        darkBlue: {
          900: '#0f172a', // Deep navy background
          800: '#1e293b', // Secondary background
          700: '#334155', // Borders and dividers
          600: '#475569'  // Subtle elements
        },
        basshead: {
          blue: {
            500: '#3b82f6', // Primary accent
            600: '#2563eb', // Secondary accent
            700: '#1d4ed8'  // Tertiary accent
          }
        }
      }
    },
  },
  plugins: [
    forms,
    typography,
  ],
}
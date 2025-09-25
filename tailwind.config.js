
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // 👈 manual toggle using .dark on <html>
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  safelist: [
    'text-sidebar-text',
    'text-sidebar-active',
    'text-sidebar-hover',
    'hover:text-sidebar-hover',
    'hover:bg-gray-800',
    'text-accent-blue',
  ],
  theme: {
    extend: {
      colors: {
        sidebar: {
          text: '#cbd5e1',
          active: '#ffffff',
          hover: '#f1f5f9',
        },
        tag: {
          bg: '#334155',
          text: '#e2e8f0',
        },
        accent: {
          blue: '#2563eb',
        },
      },
    },
  },
  plugins: [],
};

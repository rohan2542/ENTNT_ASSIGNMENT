
// // tailwind.config.js
// /** @type {import('tailwindcss').Config} */
// export default {
//   darkMode: "class", // 👈 manual toggle using .dark on <html>
//   content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
//   safelist: [
//     'text-sidebar-text',
//     'text-sidebar-active',
//     'text-sidebar-hover',
//     'hover:text-sidebar-hover',
//     'hover:bg-gray-800',
//     'text-accent-blue',
//   ],
//   theme: {
//     extend: {
//       colors: {
//         sidebar: {
//           text: '#cbd5e1',
//           active: '#ffffff',
//           hover: '#f1f5f9',
//         },
//         tag: {
//           bg: '#334155',
//           text: '#e2e8f0',
//         },
//         accent: {
//           blue: '#2563eb',
//         },
//       },
//     },
//   },
//   plugins: [],
// };


// // tailwind.config.js
// /** @type {import('tailwindcss').Config} */
// export default {
//   darkMode: "class",
//   content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
//   safelist: [
//     'text-sidebar-text',
//     'text-sidebar-active',
//     'text-sidebar-hover',
//     'hover:text-sidebar-hover',
//     'hover:bg-gray-800',
//     'text-accent-blue',
//   ],
//   theme: {
//     extend: {
//       colors: {
//         sidebar: {
//           text: '#94a3b8',    // light slate
//           active: '#f9fafb',  // near white
//           hover: '#e2e8f0',   // cool gray
//         },
//         tag: {
//           bg: '#7c3aed',      // purple
//           text: '#fdf4ff',    // lavender text
//         },
//         accent: {
//           blue: '#14b8a6',    // teal (new accent)
//         },
//         background: {
//           light: '#f9fafb',
//           dark: '#0f172a',
//         },
//       },
//     },
//   },
//   plugins: [],
// };



// // tailwind.config.js
// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   darkMode: "class",
//   content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
//   theme: {
//     extend: {
//       colors: {
//         brand: {
//           bg: "#0f172a",       // dark slate background
//           sidebar: "#1e293b",  // sidebar background
//           accent: "#14b8a6",   // teal accent
//           accentHover: "#0d9488", // darker teal hover
//           text: "#f1f5f9",     // light text
//           muted: "#94a3b8",    // muted text
//           danger: "#ef4444",   // red
//           purple: "#8b5cf6",   // purple secondary accent
//         },
//       },
//     },
//   },
//   plugins: [],
// };



// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "#0f172a",            // deep slate
          card: "rgba(255,255,255,0.05)", // glass effect
          accent: "#06b6d4",        // cyan accent
          accentHover: "#0891b2",   // darker cyan
          purple: "#a855f7",        // purple
          text: "#f8fafc",          // white text
          muted: "#94a3b8",         // muted gray
          danger: "#ef4444",        // red
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

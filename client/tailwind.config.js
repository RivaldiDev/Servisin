/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#caf0f8',  // Light Cyan
          100: '#b2ecf7',
          200: '#90e0ef', // Frosted Blue
          300: '#48cae4',
          400: '#00b4d8', // Turquoise Surf
          500: '#0096c7',
          600: '#0077b6', // Bright Teal Blue (Primary)
          700: '#023e8a',
          800: '#03045e', // Deep Twilight
          900: '#02033b',
          950: '#010220',
          twilight: '#03045e',
          teal: '#0077b6',
          turquoise: '#00b4d8',
          frosted: '#90e0ef',
          cyan: '#caf0f8',
        },
        accent: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316', // vibrant automotive orange
          600: '#ea580c',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'nav': '0 -4px 20px -2px rgba(0, 0, 0, 0.06)',
      }
    },
  },
  plugins: [],
}

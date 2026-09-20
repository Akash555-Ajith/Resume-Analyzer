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
          orange: '#C4450C',
          'orange-hover': '#B33B03',
          'orange-dark': '#9E3300',
          'orange-light': '#FFF7F4',
          'orange-border': '#FDBA74',
          green: '#10B981',
          'green-light': '#D1FAE5',
          'green-dark': '#047857',
          surface: '#F8F9FC',
          card: '#FFFFFF',
          sidebar: '#0F172A',
          'sidebar-active': '#C4450C',
          text: '#0F172A',
          subtext: '#64748B',
          border: '#E2E8F0',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}

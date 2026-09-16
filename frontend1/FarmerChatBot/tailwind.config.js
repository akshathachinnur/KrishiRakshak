/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        'lp-bg': '#0a0f0a',
        'lp-surface': '#141a14',
        'lp-accent': '#d4a053',
        'lp-green': '#39d353',
      },
      keyframes: {
        'lp-drift': {
          '0%': { opacity: '0', transform: 'translateY(0) translateX(0) scale(0.5)' },
          '15%': { opacity: '1' },
          '85%': { opacity: '1' },
          '100%': { opacity: '0', transform: 'translateY(-100vh) translateX(40px) scale(1)' },
        },
      },
      animation: {
        'lp-drift': 'lp-drift linear infinite',
      },
    },
  },
  plugins: [],
}


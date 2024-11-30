/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'bounce-slow': 'bounce-slow 1.5s ease-in-out infinite',
      },
      keyframes: {
        'bounce-slow': {
          '0%': { transform: 'translateX(-50%) translateY(0)' },
          '20%': { transform: 'translateX(-50%) translateY(-10px)' },
          '40%': { transform: 'translateX(-50%) translateY(0)' },
          '60%': { transform: 'translateX(-50%) translateY(-5px)' },
          '80%': { transform: 'translateX(-50%) translateY(0)' },
          '100%': { transform: 'translateX(-50%) translateY(-2px)' },
        },
      },
    },
  },
};

// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}" // Next.js App Router 기반
  ],
  theme: {
    extend: {
      animation: {
        glow: "glowPulse 2s ease-in-out infinite",
      },
      keyframes: {
        glowPulse: {
          "0%, 100%": {
            boxShadow: "0 0 10px rgba(99, 179, 237, 0.4), 0 0 20px rgba(99, 179, 237, 0.2)",
          },
          "50%": {
            boxShadow: "0 0 15px rgba(99, 179, 237, 0.8), 0 0 30px rgba(99, 179, 237, 0.5)",
          },
        },
      },
    },
  },
  plugins: [],
};

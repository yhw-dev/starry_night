/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        glow: '0 0 10px rgba(255,255,255,0.4), 0 0 20px rgba(255,255,255,0.6)',
      },
      animation: {
        glow: "glowTextPulse 2s ease-in-out infinite",
        glowPulse: "glowPulse 2s ease-in-out infinite",
        blink: "blink 1.8s infinite ease-in-out",
        glowFade: 'glowFade 2s ease-in-out infinite'
      },
      keyframes: {
        glowTextPulse: {
          "0%, 100%": {
            textShadow: "0 0 6px rgba(173,216,230,0.4), 0 0 12px rgba(173,216,230,0.3)",
          },
          "50%": {
            textShadow: "0 0 12px rgba(173,216,230,0.9), 0 0 24px rgba(173,216,230,0.6)",
          },
        },
        glowPulse: {
          "0%, 100%": {
            boxShadow: "0 0 10px rgba(99, 179, 237, 0.4), 0 0 20px rgba(99, 179, 237, 0.2)",
          },
          "50%": {
            boxShadow: "0 0 15px rgba(99, 179, 237, 0.8), 0 0 30px rgba(99, 179, 237, 0.5)",
          },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.2" },
        },
        glow: {
          '0%, 100%': {
            boxShadow: '0 0 10px rgba(255, 255, 255, 0.4)',
          },
          '50%': {
            boxShadow: '0 0 20px rgba(255, 255, 255, 0.8)',
          },
        },
        glowFade: {
          '0%, 100%': {
          boxShadow: '0 0 10px rgba(173, 216, 230, 0.2), 0 0 20px rgba(173, 216, 230, 0.3)', // lightblue 약한
          },
          '50%': {
          boxShadow: '0 0 20px rgba(173, 216, 230, 0.8), 0 0 40px rgba(173, 216, 230, 0.5)', // lightblue 강한
          },
        },
      },
    },
  },
  plugins: [],
};

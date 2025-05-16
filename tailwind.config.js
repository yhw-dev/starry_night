/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        glow: '0 0 8px rgba(255, 255, 255, 0.8), 0 0 16px rgba(255, 255, 255, 0.6)',
      },
      textShadow: {
        glow: '0 0 8px rgba(255, 255, 255, 0.8)',
      },
      animation: {
        glow: "glowTextPulse 2s ease-in-out infinite",
        glowPulse: "glowPulse 2s ease-in-out infinite",
        glowFade: "glowFade 2s ease-in-out infinite",
        blink: "blink 1.8s infinite ease-in-out",
        typing: "typing 2s steps(30, end) forwards",
        fadeInChar: "fadeInChar 0.05s ease-in forwards",
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
            textShadow: "0 0 4px rgba(255,255,255,0.4), 0 0 8px rgba(255,255,255,0.3)",
          },
          "50%": {
            textShadow: "0 0 12px rgba(255,255,255,0.8), 0 0 20px rgba(255,255,255,0.6)",
          },
        },
        glowFade: {
          "0%, 100%": {
            boxShadow: "0 0 10px rgba(173, 216, 230, 0.2), 0 0 20px rgba(173, 216, 230, 0.3)",
          },
          "50%": {
            boxShadow: "0 0 20px rgba(173, 216, 230, 0.8), 0 0 40px rgba(173, 216, 230, 0.5)",
          },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.2" },
        },
        typing: {
          "0%": { width: "0ch" },
          "100%": { width: "100%" },
        },
        fadeInChar: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.text-glow': {
          textShadow: '0 0 8px rgba(255, 255, 255, 0.8)',
        },
      })
    },
  ],
}

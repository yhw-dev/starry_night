/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        glow: "glowTextPulse 2s ease-in-out infinite", // 텍스트용 glow (원하면 유지)
        blink: "blink 1.8s infinite ease-in-out",
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
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.2" },
        },
      },
      boxShadow: {
        glow: '0 0 8px rgba(255, 255, 255, 0.8), 0 0 16px rgba(255, 255, 255, 0.6)',
      },
    },
  },
  plugins: [],
}

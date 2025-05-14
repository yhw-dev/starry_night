/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        glow: "glowTextPulse 2s ease-in-out infinite",      // 텍스트 글로우
        glowPulse: "glowPulse 2s ease-in-out infinite",      // 좋아요 버튼용
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
      },
    },
  },
  plugins: [],
};

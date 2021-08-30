const { tailwindExtractor } = require("tailwindcss/lib/lib/purgeUnusedStyles");
const colors = require("tailwindcss/colors");

module.exports = {
  mode: "jit",
  purge: ["./src/**/*.{html,js,svelte,ts}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Roboto", "sans-serif"],
        body: ["Roboto", "sans-serif"],
      },
      container: {
        padding: {
          DEFAULT: "1rem",
          sm: "2rem",
          lg: "4rem",
          xl: "5rem",
          "2xl": "6rem",
        },
      },
      colors: {
        orange: colors.orange,
        lime: colors.lime,
      },
      animation: {
        heartbeat: "8s ease 5s infinite normal running heartbeat",
      },
      keyframes: {
        heartbeat: {
          "0%": { transform: "scale(1)" },
          "4%": { transform: "scale(1.15)" },
          "8%": { transform: "scale(1)" },
          "12%": { transform: "scale(1.15)" },
          "16%": { transform: "scale(1)" },
          "100%": { transform: "scale(1)" },
        },
      },
    },
    container: {
      padding: {
        DEFAULT: "1rem",
        sm: "2rem",
        lg: "4rem",
        xl: "5rem",
        "2xl": "6rem",
      },
    },
  },
  variants: {
    extend: {
      display: ["dark"],
    },
  },
  plugins: [require("@tailwindcss/forms")],
};

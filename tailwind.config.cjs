const { tailwindExtractor } = require("tailwindcss/lib/lib/purgeUnusedStyles");
const colors = require("tailwindcss/colors");

module.exports = {
  purge: {
    content: ["./src/**/*.{html,js,svelte,ts}"],
    options: {
      defaultExtractor: (content) => [
        // If this stops working, please open an issue at https://github.com/svelte-add/tailwindcss/issues rather than bothering Tailwind Labs about it
        ...tailwindExtractor(content),
        // Match Svelte class: directives (https://github.com/tailwindlabs/tailwindcss/discussions/1731)
        ...[...content.matchAll(/(?:class:)*([\w\d-/:%.]+)/gm)].map(
          ([_match, group, ..._rest]) => group
        ),
      ],
      keyframes: true,
    },
  },
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

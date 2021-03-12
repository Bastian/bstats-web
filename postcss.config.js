const postcssImport = require("postcss-import");
const tailwindcss = require("tailwindcss");
const tailwindcssConfig = require("./tailwind.config");

const mode = process.env.NODE_ENV;
const dev = mode === "development";

module.exports = {
    plugins: [
        postcssImport,
        tailwindcss(tailwindcssConfig),
    ].filter(Boolean),
};

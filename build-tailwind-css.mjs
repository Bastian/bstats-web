// ========
// Taken from
// https://github.com/babichjacob/sapper-postcss-template/blob/aa5c4db693f9b11bc9a6412e067f897216b072cc/build-global-css.mjs
// and slightly modified
// ========
import fs from "fs";
import postcss from "postcss";
// eslint-disable-next-line import/extensions
import postcssConfig from "./postcss.config.js";

const { readFile, unlink, writeFile } = fs.promises;

const main = async () => {
    let sourcemap = process.argv[process.argv.length - 1];
    if (sourcemap === "true") sourcemap = true;
    else if (sourcemap === "false") sourcemap = false;

    const pcss = await readFile("src/tailwind.pcss");

    const result = await postcss(postcssConfig.plugins).process(pcss, { from: "src/tailwind.pcss", to: "static/tailwind.css", map: sourcemap ? { inline: sourcemap === "inline" } : false });

    await writeFile("static/tailwind.css", result.css);

    if (result.map) await writeFile("static/tailwind.css.map", result.map.toString());
    else {
        try {
            await unlink("static/tailwind.css.map");
        } catch (err) {
            if (err.code !== "ENOENT") {
                throw err;
            }
        }
    }
};

main();

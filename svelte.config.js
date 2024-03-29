import preprocess from "svelte-preprocess";
import node from "@sveltejs/adapter-node";
import path from "path";

// https://github.com/svelte-add/svelte-add/issues/67
const mode = process.env.NODE_ENV;
const dev = mode === "development";
process.env.TAILWIND_MODE = dev ? "watch" : "build";

/** @type {import('@sveltejs/kit').Config} */
const config = {
    // Consult https://github.com/sveltejs/svelte-preprocess
    // for more information about preprocessors
    preprocess: [
        preprocess({
            postcss: true,
        }),
    ],
    kit: {
        // By default, `npm run build` will create a standard Node app.
        // You can create optimized builds for different platforms by
        // specifying a different adapter
        adapter: node({}),

        prerender: {
            enabled: false,
        },

        // hydrate the <div id="svelte"> element in src/app.html
        target: "#svelte",

        vite: {
            optimizeDeps: {
                include: ["firebase/app", "chart.js"],
            },
            resolve: {
                alias: {
                    $components: path.resolve("./src/components"),
                    $helpers: path.resolve("./src/helpers"),
                    $defs: path.resolve("./src/definitions"),
                    $api: path.resolve("./src/api"),
                },
            },
        },
    },
};

export default config;

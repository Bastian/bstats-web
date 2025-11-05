import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [tailwindcss(), sveltekit(), enhancedImages()],
    server: {
        host: true, // Listen on all network interfaces (required for Docker)
        port: 5173
    },
    resolve: {
        alias: {
            // Workaround for Tailwind CSS v4 ESM loader (esm-cache.loader.mjs) not resolving
            // extensionless imports correctly. The @tabler/icons-svelte package uses
            // `export * as iconsList from './icons-list'` without the .js extension,
            // which causes ERR_MODULE_NOT_FOUND during SSR.
            '@tabler/icons-svelte/dist/icons-list': '@tabler/icons-svelte/dist/icons-list.js'
        }
    }
});

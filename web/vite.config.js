import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { ViteMinifyPlugin } from "vite-plugin-minify";

// https://vite.dev/config/
export default defineConfig({
    plugins: [vue(), ViteMinifyPlugin()],
    build: {
        outDir: "../static",
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: "./index.html",
                app: "./app/index.html",
            },
            output: {
                manualChunks(id) {
                    if (id.includes("reka")) return "ui";
                    if (id.includes("lucide")) return "icons";
                    return null;
                },
            },
        },
    },
});

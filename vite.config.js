import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import handlebars from "vite-plugin-handlebars";

const rootDir = dirname(fileURLToPath(import.meta.url));

/** Project Pages repo `profile` → https://nemoking1210.github.io/profile/ */
export default defineConfig({
  base: "/profile/",
  publicDir: "public",
  plugins: [
    handlebars({
      partialDirectory: resolve(rootDir, "src/partials"),
      compileOptions: {
        preventIndent: true,
      },
    }),
  ],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    assetsDir: "assets",
  },
  server: {
    open: true,
  },
});

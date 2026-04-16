// @ts-check

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://arii.dev",
  integrations: [mdx(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@components": new URL("./src/components", import.meta.url).pathname,
        "@layouts": new URL("./src/layouts", import.meta.url).pathname,
        "@lib": new URL("./src/lib", import.meta.url).pathname,
        "@assets/*": new URL("./src/assets", import.meta.url).pathname,
        "@styles/*": new URL("./src/styles", import.meta.url).pathname,
        "@scripts/*": new URL("./src/scripts", import.meta.url).pathname,
        "@/*": new URL("./src", import.meta.url).pathname,
      },
    },
  },
});

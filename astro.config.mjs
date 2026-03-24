// @ts-check
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  // GitHub Pages configuration - base only for production
  site: "https://hugobepa.github.io",
  base:
    process.env.NODE_ENV === "production" ? "/app-comparativa-modelos" : "/",
  output: "static",

  // Integrations
  integrations: [
    sitemap({
      changefreq: "monthly",
      priority: 0.7,
      lastmod: new Date(),
    }),
  ],

  // Vite configuration for Tailwind CSS 4
  vite: {
    plugins: [tailwindcss()],
  },

  // Build configuration
  build: {
    inlineStylesheets: "auto",
  },

  // i18n for Spanish content
  i18n: {
    defaultLocale: "es",
    locales: ["es"],
  },
});
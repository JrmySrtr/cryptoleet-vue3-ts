import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";
import path, { parse } from "path";

// https://vitejs.dev/config/

export default defineConfig({
  plugins: [
    vue(),
    vuetify({
      autoImport: true,
      styles: { configFile: "src/assets/scss/vuetify-settings.scss" },
    }),
  ],
  resolve: {
    alias: {
      "@/": `${path.resolve(__dirname, "src")}/`,
      "@design": "./src/assets/css/design.css",
      "@themes": "./src/assets/css/themes.css",
      "@elements": "./src/assets/css/elements/",
      "@animate": "./src/assets/css/animate.css",
      vue: path.resolve(`./node_modules/vue`),
    },
  },
  build: {
    emptyOutDir: true,
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Never do that. Each file will be compiled in each components. We prioritize Load On Need everytimes.
        // additionalData: `
        //             @import "./src/assets/scss/design.scss";
        //             @import "./src/assets/scss/themes.scss";
        //             `,
      },
    },
  },
});

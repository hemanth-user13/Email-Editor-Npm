import { defineConfig } from "tsup";
import { sassPlugin } from "esbuild-sass-plugin";
import postcss from "postcss";
import tailwindcss from "@tailwindcss/postcss";
import autoprefixer from "autoprefixer";
import { writeFileSync, readFileSync } from "fs";
import { resolve } from "path";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  outDir: "dist",
  target: "es2018",

  external: [
    "react",
    "react-dom",
    "react/jsx-runtime",
    "react/jsx-dev-runtime"
  ],

  treeshake: true,
  splitting: false,

  esbuildPlugins: [sassPlugin()],

  outExtension({ format }) {
    return {
      js: format === "esm" ? ".mjs" : ".js"
    };
  },

  async onSuccess() {
    const css = readFileSync(resolve("src/styles.css"), "utf-8");

    const result = await postcss([
      tailwindcss(),
      autoprefixer(),
    ]).process(css, {
      from: resolve("src/styles.css"),
    });

    // Remove @layer wrappers so it works in any project regardless of Tailwind version
    const strippedCss = result.css
      .replace(/@layer\s+[\w,\s]+\s*\{/g, "/* layer-start */")
      .replace(/^}\s*$/gm, "/* layer-end */");

    writeFileSync("dist/style.css", strippedCss);
    console.log("✅ dist/style.css generated!");
  },
});
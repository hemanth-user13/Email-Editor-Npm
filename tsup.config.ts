import { defineConfig } from "tsup";
import { sassPlugin } from "esbuild-sass-plugin";
import postcss from "postcss";
import tailwindcss from "@tailwindcss/postcss";
import autoprefixer from "autoprefixer";
import { writeFileSync } from "fs";
import { globSync } from "glob";

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
    const css = `@import "tailwindcss";`;

    const result = await postcss([
      tailwindcss({
        //@ts-ignore
        content: globSync("src/**/*.{ts,tsx}"),
      }),
      autoprefixer(),
    ]).process(css, { from: undefined });

    writeFileSync("dist/style.css", result.css);
    console.log("✅ dist/style.css generated!");
  },
});
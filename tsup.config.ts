import { defineConfig } from "tsup";
import { sassPlugin } from "esbuild-sass-plugin";
import postcss, { AtRule } from "postcss";
import tailwindcss from "@tailwindcss/postcss";
import autoprefixer from "autoprefixer";
import { writeFileSync, readFileSync } from "fs";
import { resolve } from "path";

// PostCSS plugin to unwrap @layer blocks into plain CSS
const unwrapLayers = (): postcss.Plugin => ({
  postcssPlugin: "unwrap-layers",
  AtRule: {
    layer(node: AtRule) {
      // Only unwrap @layer X { ... } blocks, not @layer declarations
      if (node.nodes) {
        node.replaceWith(node.nodes);
      } else {
        node.remove();
      }
    },
  },
});
unwrapLayers.postcss = true;

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
    "react/jsx-dev-runtime",
  ],

  treeshake: true,
  splitting: false,

  esbuildPlugins: [sassPlugin()],

  outExtension({ format }) {
    return {
      js: format === "esm" ? ".mjs" : ".js",
    };
  },

  async onSuccess() {
    const css = readFileSync(resolve("src/styles.css"), "utf-8");

    const result = await postcss([
      tailwindcss(),
      autoprefixer(),
      unwrapLayers(), // 👈 properly unwraps @layer blocks
    ]).process(css, {
      from: resolve("src/styles.css"),
    });

    writeFileSync("dist/style.css", result.css);
    console.log("✅ dist/style.css generated (no @layer wrappers)!");
  },
});
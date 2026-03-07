import { defineConfig } from "tsup";
import { sassPlugin } from "esbuild-sass-plugin";

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
  }
});
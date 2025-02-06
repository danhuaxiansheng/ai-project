import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: {
    resolve: true,
    entry: {
      index: "src/index.ts",
    },
  },
  clean: true,
  external: ["react", "react-dom"],
  treeshake: true,
  sourcemap: true,
  outDir: "dist",
  esbuildOptions(options) {
    options.tsconfig = "./tsconfig.json";
  },
});

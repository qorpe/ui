import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/json-editor/index.tsx"],
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom", "react/jsx-runtime"],
});

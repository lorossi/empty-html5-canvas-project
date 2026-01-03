import terser from "@rollup/plugin-terser";

export default {
  input: "js/lib.js",
  output: {
    file: "dist/js/lib.js",
    format: "iife",
    name: "CanvasLib",
  },
  plugins: [terser()],
};

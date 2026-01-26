/**
 * HTML canvas simple engine.
 * GitHub repo and documentation: https://github.com/lorossi/empty-html5-canvas-project
 * Excludes: sketch.js (user-defined), inject.js (DOM injection)
 * @author Lorenzo Rossi <mail@lorenzoros.si>
 * @license MIT - 2026
 */

export { Color } from "./color.js";
export { CSS_COLOR_NAMES, SANZO_WADA_COLORS } from "./color-definitions.js";
export { Engine } from "./engine.js";
export { Palette, GradientPalette, PaletteFactory } from "./palette.js";
export { Point } from "./point.js";
export { SimplexNoise } from "./simplex-noise-class.js";
export { XOR128 } from "./deps/xor128.js";

import "./jszip.js";

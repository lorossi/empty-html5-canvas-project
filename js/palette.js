import { Color } from "./lib.js";

/* Class representing a color palette */
class Palette {
  /**
   * Create a palette from an array of Color objects
   * @param {Color[]} colors array of Color objects
   */
  constructor(colors) {
    this._colors = colors;
  }

  /**
   * Create a palette from an array of HEX color strings
   * @param {string[]} colors array of HEX color strings
   * @returns {Palette} palette object
   */
  static fromArrayHEX(colors) {
    return new Palette(colors.map((c) => Color.fromHex(c)));
  }

  /**
   * Create a palette from an array of RGB color arrays
   * @param {number[][]} colors array of RGB color arrays
   * @returns {Palette} palette object
   */
  static fromArrayRGB(colors) {
    return new Palette(colors.map((c) => Color.fromRGB(c)));
  }

  /**
   * Shuffle the colors in the palette
   * @typedef {RandomClass} RandomClass An object with a random() method that returns a float between 0 and 1
   * @param {RandomClass} rand random number generator with a random() method. Defaults to Math
   * @returns {Palette} shuffled palette
   */
  shuffle(rand = Math) {
    this._colors = this._colors
      .map((c) => ({ color: c, order: rand.random() }))
      .sort((a, b) => a.order - b.order)
      .map((c) => c.color);

    return this;
  }

  /**
   * Return a copy of the palette
   * @returns {Palette} copy of the palette
   */
  copy() {
    return new Palette(this._colors.map((c) => c.copy()));
  }

  /**
   * Get the color at index i. The index wraps around if it exceeds the number of colors
   * @param {number} i  index of the color
   * @returns  {Color} color at index i
   */
  getColor(i) {
    return this._colors[i % this._colors.length];
  }

  /**
   * Get a random color from the palette
   * @typedef {RandomClass} RandomClass An object with a random() method that returns a float between 0 and 1
   * @param {RandomClass} rand random number generator with a random() method. Defaults to Math
   * @returns {Color} random color from the palette
   */
  getRandomColor(rand = Math) {
    const r = Math.floor(rand.random() * this._colors.length);
    return this.getColor(r);
  }

  /**
   * Get a smoothly interpolated color from the palette
   * @typedef {EasingFunction} EasingFunction Easing function that takes a value between 0 and 1 and returns a value between 0 and 1
   * @param {number} t value between 0 and 1
   * @param {EasingFunction|null} easing easing function to use for the interpolation. Defaults to null (linear)
   * @returns {Color} smoothly interpolated color from the palette
   */
  getSmoothColor(t, easing = null) {
    const n = this._colors.length - 1;
    const integer_part = Math.floor(t * n) % n;
    const fractional_part = t * n - Math.floor(t * n);

    const c1 = this.getColor(integer_part);
    const c2 = this.getColor(integer_part + 1);

    return c1.mix(c2, fractional_part, easing);
  }

  /**
   * Get all colors in the palette
   * @returns {Color[]} array of colors in the palette
   */
  get colors() {
    return this._colors;
  }

  /**
   * Get the number of colors in the palette
   * @returns {number} number of colors in the palette
   */
  get length() {
    return this._colors.length;
  }
}

/* Class representing a factory for palettes */
class PaletteFactory {
  /**
   * Create a palette factory from an array of palettes
   * @param {Array.<Array.<Color>>} palettes array of palettes, each palette is an array of Color objects or HEX color strings
   */
  constructor(palettes) {
    this._palettes = palettes;
  }

  /**
   * Create a palette factory from an array of HEX palettes
   * @param {Array.<Array.<string>>} hex_palettes array of palettes, each palette is an array of HEX color strings
   * @returns {PaletteFactory} palette factory object
   */
  static fromHEXPalettes(hex_palettes) {
    const palettes = hex_palettes.map((p) => Palette.fromArrayHEX(p));
    return new PaletteFactory(palettes);
  }

  /**
   * Get a random palette from the factory
   * @typedef {RandomClass} RandomClass An object with a random() method that returns a float between 0 and 1
   * @param {RandomClass} rand random number generator with a random() method. Defaults to Math
   * @param {boolean} randomize whether to randomize the order of colors in the palette. Defaults to true
   * @returns {Palette} random palette
   */
  getRandomPalette(rand = Math, randomize = true) {
    const colors_index = Math.floor(rand.random() * this._palettes.length);
    let colors = this._palettes[colors_index].map((c) => {
      if (c instanceof Color) {
        return c.copy();
      }

      return Color.fromHex(c);
    });

    if (randomize) {
      colors = colors
        .map((c) => ({ color: c, order: rand.random() }))
        .sort((a, b) => a.order - b.order)
        .map((c) => c.color);
    }

    return new Palette(colors);
  }

  /**
   * Get the palette at index n
   * @param {number} n index of the palette
   * @returns {Palette} palette at index n
   */
  getPalette(n) {
    if (n < 0 || n > this._palettes.length - 1)
      throw new Error("Palette index out of bounds");

    return new Palette(this._palettes[n].map((h) => Color.fromHex(h)));
  }
}

export { Palette, PaletteFactory };

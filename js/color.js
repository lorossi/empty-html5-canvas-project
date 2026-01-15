/**
 * @file Color class for color manipulation and representation
 * @author Lorenzo Rossi
 */

import { CSS_COLOR_NAMES, SANZO_WADA_COLORS } from "./color-definitions.js";

/** Class containing colors.*/
class Color {
  /**
   * Create a color by setting the value of its RGB channels.
   * @param {number} [r] The value of the Red channel in range [0, 255]
   * @param {number} [g] The value of the Green channel in range [0, 255]
   * @param {number} [b] The value of the Blue channel in range [0, 255]
   * @param {number} [a] The value of the Alpha channel in range [0, 1]
   */
  constructor(r = 0, g = 0, b = 0, a = 1) {
    if (r > 255 || r < 0 || g > 255 || g < 0 || b > 255 || b < 0)
      throw new Error("Color values must be in range [0, 255]");
    if (a > 1 || a < 0) throw new Error("Alpha value must be in range [0, 1]");

    this._r = r;
    this._g = g;
    this._b = b;
    this._a = a;

    this._calculateHsl();
  }

  /**
   * Checks if two colors are equal
   * @param {Color} other The other color to compare with
   * @param {boolean} [compare_alpha] If true, the alpha channel will be compared too
   * @returns {boolean} True if the colors are equal, false otherwise
   */
  equals(other, compare_alpha = true) {
    const epsilon = 0.0001;
    const float_eq = (a, b) => Math.abs(a - b) < epsilon;
    return (
      float_eq(this._r, other._r) &&
      float_eq(this._g, other._g) &&
      float_eq(this._b, other._b) &&
      (float_eq(this._a, other._a) || !compare_alpha)
    );
  }

  /**
   * Returns the color as a string
   * @returns {string} The hexadecimal representation of the color
   */
  toString() {
    return this.hex;
  }

  /**
   * Mix two colors, returning a new color.
   * Optionally, an easing function can be passed to control the mix.
   * @typedef {function(number): number} easingFunction
   * @param {Color} other   The other color to mix with
   * @param {number} amount The amount of the other color in range [0, 1]
   * @param {easingFunction} [easing] An optional easing function that accepts a number in range [0, 1] and returns a number in range [0, 1]
   * @returns {Color} The mixed color
   */
  mix(other, amount, easing = null) {
    const t = easing ? easing(amount) : amount;
    const r = this._clamp(this._r + t * (other.r - this._r), 0, 255);
    const g = this._clamp(this._g + t * (other.g - this._g), 0, 255);
    const b = this._clamp(this._b + t * (other.b - this._b), 0, 255);
    const a = this._clamp(this._a + t * (other.a - this._a), 0, 1);
    return new Color(r, g, b, a);
  }

  /**
   * Darken the color by a certain amount, returning a new color.
   * Optionally, an easing function can be passed to control the mix.
   * @typedef {function(number): number} easingFunction
   * @param {number} amount The amount to darken in range [0, 1]
   * @param {easingFunction} easing An optional easing function that accepts a number in range [0, 1] and returns a number in range [0, 1]
   * @returns {Color} The darkened color
   */
  darken(amount, easing = null) {
    const t = easing ? easing(amount) : amount;
    return this.mix(Color.fromMonochrome(0), t);
  }

  /**
   * Lighten the color by a certain amount, returning a new color.
   * Optionally, an easing function can be passed to control the mix.
   * @typedef {function(number): number} easingFunction
   * @param {number} amount The amount to lighten in range [0, 1]
   * @param {easingFunction} easing An optional easing function that accepts a number in range [0, 1] and returns a number in range [0, 1]
   * @returns {Color} The lightened color
   */
  lighten(amount, easing = null) {
    const t = easing ? easing(amount) : amount;
    return this.mix(Color.fromMonochrome(255), t);
  }

  /**
   * Return a copy of the color
   * @returns {Color} A new Color instance with the same values
   */
  copy() {
    return new Color(this._r, this._g, this._b, this._a);
  }

  /**
   * Create a color from HSL values
   * @param {number} h Color hue in range [0, 360]
   * @param {number} s Color saturation in range [0, 100]
   * @param {number} l Color lighting in range [0, 100]
   * @param {number} a Color alpha in range [0, 1]
   * @static
   * @returns {Color} The created Color instance
   */
  static fromHSL(h, s, l, a) {
    const dummy = new Color();
    dummy.h = h;
    dummy.s = s;
    dummy.l = l;
    dummy._calculateRgb();
    return new Color(dummy._r, dummy._g, dummy._b, a);
  }

  /**
   * Create a color from RGB values
   * @param {number} r Red channel value in range [0, 360]
   * @param {number} g Green channel value in range [0, 360]
   * @param {number} b Blue channel value in range [0, 360]
   * @param {number} a Alpha channel value in range [0, 1]
   * @static
   * @returns {Color} The created Color instance
   */
  static fromRGB(r, g, b, a) {
    return new Color(r, g, b, a);
  }

  /**
   * Create a color from a hexadecimal string
   * @param {string} hex The hexadecimal string, with or without the leading #
   * @static
   * @returns {Color} The created Color instance
   */
  static fromHex(hex) {
    // regex to extract r, g, b, a values from hex string
    const regex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i;
    // extract values from hex string
    const [, r, g, b, a] = regex.exec(hex);

    // convert values to decimal
    const dr = parseInt(r, 16);
    const dg = parseInt(g, 16);
    const db = parseInt(b, 16);
    const da = a ? parseInt(a, 16) / 255 : 1;

    // return color
    return new Color(dr, dg, db, da);
  }

  /**
   * Create a color from a hexadecimal string
   * @deprecated Use Color.fromHex instead
   * @param {string} hex The hexadecimal string, with or without the leading #
   * @static
   * @returns {Color} The created Color instance
   */
  static fromHEX(hex) {
    return Color.fromHex(hex);
  }

  /**
   * Create a monochrome color from a decimal value
   * @param {number} ch Red, green and blue value in range [0, 255]
   * @param {number} [a] Alpha value in range [0, 1], defaults to 1
   * @static
   * @returns {Color} The created Color instance
   */
  static fromMonochrome(ch, a = 1) {
    return new Color(ch, ch, ch, a);
  }

  /**
   * Create a color from CSS name. List of name provided by the W3C (https://www.w3.org/wiki/CSS/Properties/color/keywords)
   * @param {string} name The CSS color name
   * @static
   * @returns {Color} The created Color instance
   */
  static fromCSS(name) {
    if (CSS_COLOR_NAMES[name] == undefined) {
      throw new Error("Color name not found");
    }
    return new Color(...CSS_COLOR_NAMES[name]);
  }

  /**
   * Create a color from Sanzo Wada's Dictionary of Color Combinations (https://sanzo-wada.dmbk.io/)
   * @param {string} name The Sanzo Wada color name
   * @static
   * @returns {Color} The created Color instance
   */
  static fromSanzoWada(name) {
    if (SANZO_WADA_COLORS[name] == undefined) {
      throw new Error("Color name not found");
    }
    return new Color(...SANZO_WADA_COLORS[name]);
  }

  /**
   * Converts a color from RGB to HSL
   * @private
   */
  _calculateHsl() {
    const r = this._r / 255;
    const g = this._g / 255;
    const b = this._b / 255;

    let max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    let h,
      s,
      l = (max + min) / 2;

    if (max == min) {
      h = s = 0; // achromatic
    } else {
      let d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    this._h = Math.floor(h * 360);
    this._s = Math.floor(s * 100);
    this._l = Math.floor(l * 100);
  }

  /**
   * Converts a color from HSL to RGB
   * @private
   */
  _calculateRgb() {
    if (this._s == 0) {
      this._r = this._l;
      this._g = this._l;
      this._b = this._l;
    } else {
      const hueToRgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const l = this._l / 100;
      const h = this._h / 360;
      const s = this._s / 100;

      let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      let p = 2 * l - q;

      this._r = Math.floor(hueToRgb(p, q, h + 1 / 3) * 255);
      this._g = Math.floor(hueToRgb(p, q, h) * 255);
      this._b = Math.floor(hueToRgb(p, q, h - 1 / 3) * 255);
    }
  }

  /**
   * Get the hexadecimal representation of a decimal number
   * @param {number} dec The decimal number
   * @returns {string} The hexadecimal representation
   * @private
   */
  _decToHex(dec) {
    return Math.floor(dec).toString(16).padStart(2, 0).toUpperCase();
  }

  /**
   * Get the decimal representation of a hexadecimal number
   * @param {number} hex The hexadecimal number
   * @returns {number} The decimal representation
   * @private
   */
  _hexToDec(hex) {
    return parseInt(hex, 16);
  }

  /**
   * Clamps a value between an interval
   * @param {number} value The value to clamp
   * @param {number} min The minimum value
   * @param {number} max The maximum value
   * @returns {number} The clamped value
   * @private
   */
  _clamp(value, min, max) {
    return Math.min(Math.max(min, value), max);
  }

  set hex(hex) {
    this._r = this._hexToDec(hex.slice(1, 3));
    this._g = this._hexToDec(hex.slice(3, 5));
    this._b = this._hexToDec(hex.slice(5, 7));

    const a = parseInt(hex.slice(7, 9), 16);
    if (isNaN(a)) this._a = 1;
    else this._a = this._clamp(a / 255, 0, 1);

    this._calculateHsl();
  }

  get_hex() {
    return `#${this._decToHex(this._r)}${this._decToHex(
      this._g
    )}${this._decToHex(this._b)}`;
  }

  get hex() {
    return this.get_hex();
  }

  get_hexa() {
    return `#${this._decToHex(this._r)}${this._decToHex(
      this._g
    )}${this._decToHex(this._b)}${this._decToHex(this._a * 255)}`;
  }

  get hexa() {
    return this.get_hexa();
  }

  get_rgb() {
    const [r, g, b] = [this._r, this._g, this._b].map(Math.floor);
    return `rgb(${r}, ${g}, ${b})`;
  }

  get rgb() {
    return this.get_rgb();
  }

  get_rgba() {
    const [r, g, b] = [this._r, this._g, this._b].map(Math.floor);
    const a = this._a;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }

  get rgba() {
    return this.get_rgba();
  }

  get_hsl() {
    const [h, s, l] = [this._h, this._s, this._l].map(Math.floor);
    return `hsl(${h}, ${s}%, ${l}%)`;
  }

  get hsl() {
    return this.get_hsl();
  }

  get_hsla() {
    const [h, s, l] = [this._h, this._s, this._l].map(Math.floor);
    const a = this._a;
    return `hsla(${h}, ${s}%, ${l}%, ${a})`;
  }

  get hsla() {
    return this.get_hsla();
  }

  get r() {
    return this._r;
  }

  set r(x) {
    this._r = Math.floor(this._clamp(x, 0, 255));
    this._calculateHsl();
  }

  get g() {
    return this._g;
  }

  set g(x) {
    this._g = Math.floor(this._clamp(x, 0, 255));
    this._calculateHsl();
  }

  get b() {
    return this._b;
  }

  set b(x) {
    this._b = Math.floor(this._clamp(x, 0, 255));
    this._calculateHsl();
  }

  get a() {
    return this._a;
  }

  set a(x) {
    this._a = this._clamp(x, 0, 1);
  }

  get h() {
    return this._h;
  }

  set h(x) {
    this._h = Math.floor(this._clamp(x, 0, 360));
    this._calculateRgb();
  }

  get s() {
    return this._s;
  }

  set s(x) {
    this._s = Math.floor(this._clamp(x, 0, 100));
    this._calculateRgb();
  }

  get l() {
    return this._l;
  }

  set l(x) {
    this._l = Math.floor(this._clamp(x, 0, 100));
    this._calculateRgb();
  }

  get is_monochrome() {
    if (this._r == this._g && this._g == this._b) return true;
    else return false;
  }

  get luminance() {
    // relative luminance calculation according to WCAG 2.0
    const RsRGB = this._r / 255;
    const GsRGB = this._g / 255;
    const BsRGB = this._b / 255;

    const R =
      RsRGB <= 0.03928 ? RsRGB / 12.92 : Math.pow((RsRGB + 0.055) / 1.055, 2.4);
    const G =
      GsRGB <= 0.03928 ? GsRGB / 12.92 : Math.pow((GsRGB + 0.055) / 1.055, 2.4);
    const B =
      BsRGB <= 0.03928 ? BsRGB / 12.92 : Math.pow((BsRGB + 0.055) / 1.055, 2.4);

    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
  }
}

export { Color, CSS_COLOR_NAMES, SANZO_WADA_COLORS };

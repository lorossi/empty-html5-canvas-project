/**
 * @file Color class for color manipulation and representation
 * @author Lorenzo Rossi
 */

import { CSS_COLOR_NAMES, SANZO_WADA_COLORS } from "./color-definitions.js";

/**
 * @import {easingFunction} from "./doc_types.js"
 */

/**
 * Class representing a color, with methods for manipulation and conversion between different color formats.
 * @class
 */
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

    this._updateFromRGB();
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
    const [r, g, b] = Color._HSLtoRGB(h, s, l);
    return new Color(r, g, b, a);
  }

  /**
   * Create a color from CMYK values
   * @param {number} c Cyan channel value in range [0, 100]
   * @param {number} m Magenta channel value in range [0, 100]
   * @param {number} y Yellow channel value in range [0, 100]
   * @param {number} k Black channel value in range [0, 100]
   * @param {number} a Alpha channel value in range [0, 1]
   * @static
   * @returns {Color} The created Color instance
   */
  static fromCMYK(c, m, y, k, a) {
    const [r, g, b] = Color._CMYKtoRGB(c, m, y, k);
    return new Color(r, g, b, a);
  }

  /**
   * Create a color from RGB values
   * @param {number} r Red channel value in range [0, 255]
   * @param {number} g Green channel value in range [0, 255]
   * @param {number} b Blue channel value in range [0, 255]
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
   * @param {number} r Red channel value in range [0, 255]
   * @param {number} g Green channel value in range [0, 255]
   * @param {number} b Blue channel value in range [0, 255]
   * @returns {Array} An array containing the HSL values, where H is in range [0, 360] and S and L are in range [0, 100]
   * @private
   */
  static _RGBtoHSL(r, g, b) {
    const rr = r / 255;
    const gg = g / 255;
    const bb = b / 255;

    let max = Math.max(rr, gg, bb),
      min = Math.min(rr, gg, bb);
    let h,
      s,
      l = (max + min) / 2;

    if (max == min) {
      h = s = 0; // achromatic
    } else {
      let d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case rr:
          h = (gg - bb) / d + (gg < bb ? 6 : 0);
          break;
        case gg:
          h = (bb - rr) / d + 2;
          break;
        case bb:
          h = (rr - gg) / d + 4;
          break;
      }
      h /= 6;
    }

    return [Math.floor(h * 360), Math.floor(s * 100), Math.floor(l * 100)];
  }

  /**
   * Converts a color from HSL to RGB
   * @param {number} h Color hue in range [0, 360]
   * @param {number} s Color saturation in range [0, 100]
   * @param {number} l Color lighting in range [0, 100]
   * @returns {Array} An array containing the RGB values in range [0, 255]
   * @private
   */
  static _HSLtoRGB(h, s, l) {
    let r, g, b;
    if (s == 0) {
      r = l;
      g = l;
      b = l;
    } else {
      const hueToRgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      l /= 100;
      h /= 360;
      s /= 100;

      let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      let p = 2 * l - q;

      r = Math.floor(hueToRgb(p, q, h + 1 / 3) * 255);
      g = Math.floor(hueToRgb(p, q, h) * 255);
      b = Math.floor(hueToRgb(p, q, h - 1 / 3) * 255);
    }

    return [r, g, b];
  }

  /**
   * Converts a color from RGB to CMYK
   * @param {number} r Red channel value in range [0, 255]
   * @param {number} g Green channel value in range [0, 255]
   * @param {number} b Blue channel value in range [0, 255]
   * @returns {Array} An array containing the CMYK values in range [0, 100]
   * @private
   */
  static _RGBtoCMYK(r, g, b) {
    const rr = r / 255;
    const gg = g / 255;
    const bb = b / 255;

    const k = (1 - Math.max(rr, gg, bb)) * 100;
    let c, m, y;
    if (k == 100) {
      c = 0;
      m = 0;
      y = 0;
    } else {
      c = ((1 - rr - k) / (1 - k)) * 100;
      m = ((1 - gg - k) / (1 - k)) * 100;
      y = ((1 - bb - k) / (1 - k)) * 100;
    }

    return [Math.floor(c), Math.floor(m), Math.floor(y), Math.floor(k)];
  }

  /**
   * Converts a color from CMYK to RGB
   * @param {number} c Cyan channel value in range [0, 100]
   * @param {number} m Magenta channel value in range [0, 100]
   * @param {number} y Yellow channel value in range [0, 100]
   * @param {number} k Black channel value in range [0, 100]
   * @returns {Array} An array containing the RGB values in range [0, 255]
   * @private
   */
  static _CMYKtoRGB(c, m, y, k) {
    const cc = c / 100;
    const mm = m / 100;
    const yy = y / 100;
    const kk = k / 100;

    const r = Math.floor(255 * (1 - cc) * (1 - kk));
    const g = Math.floor(255 * (1 - mm) * (1 - kk));
    const b = Math.floor(255 * (1 - yy) * (1 - kk));

    return [r, g, b];
  }

  /**
   * Update the HSL and CMYK values based on the current RGB values
   * @private
   */
  _updateFromRGB() {
    const [h, s, l] = Color._RGBtoHSL(this._r, this._g, this._b);
    this._h = h;
    this._s = s;
    this._l = l;

    const [c, m, y, k] = Color._RGBtoCMYK(this._r, this._g, this._b);
    this._c = c;
    this._m = m;
    this._y = y;
    this._k = k;
  }

  /**
   * Update the RGB and CMYK values based on the current HSL values
   * @private
   */
  _updateFromHSL() {
    const [r, g, b] = Color._HSLtoRGB(this._h, this._s, this._l);
    this._r = r;
    this._g = g;
    this._b = b;

    const [c, m, y, k] = Color._RGBtoCMYK(this._r, this._g, this._b);
    this._c = c;
    this._m = m;
    this._y = y;
    this._k = k;
  }

  /**
   * Update the RGB and HSL values based on the current CMYK values
   * @private
   */
  _updateFromCMYK() {
    const [r, g, b] = Color._CMYKtoRGB(this._c, this._m, this._y, this._k);
    this._r = r;
    this._g = g;
    this._b = b;

    const [h, s, l] = Color._RGBtoHSL(this._r, this._g, this._b);
    this._h = h;
    this._s = s;
    this._l = l;
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

  get_hex() {
    const [rx, gx, bx] = [this._r, this._g, this._b].map(this._decToHex);

    return `#${rx}${gx}${bx}`;
  }

  get hex() {
    return this.get_hex();
  }

  set hex(hex) {
    const color = Color.fromHex(hex);
    this._r = color._r;
    this._g = color._g;
    this._b = color._b;
    this._a = color._a;
    this._updateFromRGB();
  }

  get_hexa() {
    const [rx, gx, bx] = [this._r, this._g, this._b].map(this._decToHex);
    const ax = this._decToHex(this._a * 255);

    return `#${rx}${gx}${bx}${ax}`;
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
    this._updateFromRGB();
  }

  setR(r) {
    this.r = r;
    this._updateFromRGB();
    return this;
  }

  get g() {
    return this._g;
  }

  set g(x) {
    this._g = Math.floor(this._clamp(x, 0, 255));
    this._updateFromRGB();
  }

  setG(g) {
    this.g = g;
    this._updateFromRGB();
    return this;
  }

  get b() {
    return this._b;
  }

  set b(x) {
    this._b = Math.floor(this._clamp(x, 0, 255));
    this._updateFromRGB();
  }

  setB(b) {
    this.b = b;
    this._updateFromRGB();
    return this;
  }

  get a() {
    return this._a;
  }

  set a(x) {
    this._a = this._clamp(x, 0, 1);
  }

  setA(a) {
    this.a = a;
    return this;
  }

  get h() {
    return this._h;
  }

  set h(x) {
    this._h = Math.floor(this._clamp(x, 0, 360));
    this._updateFromHSL();
  }

  setH(h) {
    this.h = h;
    this._updateFromHSL();
    return this;
  }

  get s() {
    return this._s;
  }

  set s(x) {
    this._s = Math.floor(this._clamp(x, 0, 100));
    this._updateFromHSL();
  }

  setS(s) {
    this.s = s;
    this._updateFromHSL();
    return this;
  }

  get l() {
    return this._l;
  }

  set l(x) {
    this._l = Math.floor(this._clamp(x, 0, 100));
    this._updateFromHSL();
  }

  setL(l) {
    this.l = l;
    this._updateFromHSL();
    return this;
  }

  get c() {
    return this._c;
  }

  set c(x) {
    this._c = Math.floor(this._clamp(x, 0, 100));
    this._updateFromCMYK();
  }

  setC(c) {
    this.c = c;
    this._updateFromCMYK();
    return this;
  }

  get m() {
    return this._m;
  }

  set m(x) {
    this._m = Math.floor(this._clamp(x, 0, 100));
    this._updateFromCMYK();
  }

  setM(m) {
    this.m = m;
    this._updateFromCMYK();
    return this;
  }

  get y() {
    return this._y;
  }

  set y(x) {
    this._y = Math.floor(this._clamp(x, 0, 100));
    this._updateFromCMYK();
  }

  setY(y) {
    this.y = y;
    this._updateFromCMYK();
    return this;
  }

  get k() {
    return this._k;
  }

  set k(x) {
    this._k = Math.floor(this._clamp(x, 0, 100));
    this._updateFromCMYK();
  }

  setK(k) {
    this.k = k;
    this._updateFromCMYK();
    return this;
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

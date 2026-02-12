import { Color } from "../js/lib.js";

const lerp = (x, y, t) => x * (1 - t) + y * t;
const color_lerp = (c1, c2, t) => {
  const r = lerp(c1.r, c2.r, t);
  const g = lerp(c1.g, c2.g, t);
  const b = lerp(c1.b, c2.b, t);
  const a = lerp(c1.a, c2.a, t);
  return new Color(r, g, b, a);
};
const color_equal = (c1, c2, epsilon = 0.0001) => {
  return (
    Math.abs(c1.r - c2.r) < epsilon &&
    Math.abs(c1.g - c2.g) < epsilon &&
    Math.abs(c1.b - c2.b) < epsilon &&
    Math.abs(c1.a - c2.a) < epsilon
  );
};

const ease_in_poly = (t, n = 2) => Math.pow(t, n);
const ease_out_poly = (t, n = 2) => 1 - Math.pow(1 - t, n);
const ease_in_out_poly = (t, n = 2) => {
  if (t < 0.5) return 0.5 * Math.pow(2 * t, n);
  return 1 - 0.5 * Math.pow(2 * (1 - t), n);
};
const dec_to_hex = (dec) => {
  const hex = dec.toString(16).toUpperCase();
  return hex.length === 1 ? `0${hex}` : hex;
};

class SFC32 {
  constructor(a, b, c, d) {
    this._a = a;
    this._b = b;
    this._c = c;
    this._d = d;
  }

  random() {
    this._a >>>= 0;
    this._b >>>= 0;
    this._c >>>= 0;
    this._d >>>= 0;

    let t = (this._a + this._b) | 0;
    this._a = this._b ^ (this._b >>> 9);
    this._b = (this._c + (this._c << 3)) | 0;
    this._c = (this._c << 21) | (this._c >>> 11);
    this._d = (this._d + 1) | 0;
    t = (t + this._d) | 0;
    this._c = (this._c + t) | 0;
    return (t >>> 0) / 4294967296;
  }
}

export {
  lerp,
  color_lerp,
  color_equal,
  ease_in_poly,
  ease_out_poly,
  ease_in_out_poly,
  dec_to_hex,
  SFC32,
};

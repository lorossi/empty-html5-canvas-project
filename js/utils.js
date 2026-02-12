class Utils {
  /**
   *  Remaps a number from one range to another.
   * @param {number} value the number to remap
   * @param {number} old_min the lower bound of the value's current range
   * @param {number} old_max the upper bound of the value's current range
   * @param {number} new_min the lower bound of the value's target range
   * @param {number} new_max the upper bound of the value's target range
   * @returns {number} remapped value
   */
  static remap(value, old_min, old_max, new_min, new_max) {
    return (
      new_min + ((value - old_min) * (new_max - new_min)) / (old_max - old_min)
    );
  }
  /**
   * Clamps a number between a minimum and maximum value.
   * @param {number} value the number to clamp
   * @param {number} min the minimum value
   * @param {number} max the maximum value
   * @returns {number} clamped value
   */
  static clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  /**
   * Wraps a value into the range [min, max).
   * @param {number} value the number to wrap
   * @param {number} min the inclusive lower bound
   * @param {number} max the exclusive upper bound
   * @returns {number} wrapped value
   */
  static wrap(value, min, max) {
    if (min >= max) throw new Error("Utils: min must be less than max");

    const range = max - min;
    return ((((value - min) % range) + range) % range) + min;
  }

  /**
   * Linearly interpolates between two values.
   * @param {number} a start value
   * @param {number} b end value
   * @param {number} t interpolation factor in range [0, 1]
   * @returns {number} interpolated value
   */
  static lerp(a, b, t) {
    if (t < 0 || t > 1)
      throw new Error("Utils: interpolation factor must be in range [0, 1]");
    return a + (b - a) * t;
  }

  /**
   * Polynomial easing in out function. Returns a number in range [0, 1].
   * @param {number} t input number in range [0, 1]
   * @param {number} n power of the easing function. Default is 2 (quadratic easing)
   * @returns {number} eased value
   */
  static ease_in_out_poly(t, n = 2) {
    if (t < 0 || t > 1) throw new Error("Utils: input must be in range [0, 1]");
    if (t < 0.5) return (2 * t) ** n / 2;
    return 1 - (-2 * t + 2) ** n / 2;
  }

  /**
   * Polynomial easing in function. Returns a number in range [0, 1].
   * @param {number} t input number in range [0, 1]
   * @param {number} n power of the easing function. Default is 2 (quadratic easing)
   * @returns {number} eased value
   */
  static ease_in_poly(t, n = 2) {
    if (t < 0 || t > 1) throw new Error("Utils: input must be in range [0, 1]");
    return t ** n;
  }

  static ease_out_poly(t, n = 2) {
    if (t < 0 || t > 1) throw new Error("Utils: input must be in range [0, 1]");
    return 1 - (1 - t) ** n;
  }

  /**
   * Sinusoidal easing in-out function. Returns a number in range [0, 1].
   * @param {number} t input number in range [0, 1]
   * @returns {number} eased value
   */
  static ease_in_out_sin(t) {
    if (t < 0 || t > 1) throw new Error("Utils: input must be in range [0, 1]");
    return Math.sin((t * Math.PI) / 2);
  }

  /**
   * Sinusoidal easing in function. Returns a number in range [0, 1].
   * @param {number} t input number in range [0, 1]
   * @returns {number} eased value
   */
  static ease_in_sin(t) {
    if (t < 0 || t > 1) throw new Error("Utils: input must be in range [0, 1]");
    return 1 - Math.cos((t * Math.PI) / 2);
  }

  /**
   * Sinusoidal easing out function. Returns a number in range [0, 1].
   * @param {number} t input number in range [0, 1]
   * @returns {number} eased value
   */
  static ease_out_sin(t) {
    if (t < 0 || t > 1) throw new Error("Utils: input must be in range [0, 1]");
    return Math.sin((t * Math.PI) / 2);
  }

  /**
   * Exponential easing in-out function. Returns a number in range [0, 1].
   * @param {number} t input number in range [0, 1]
   * @returns {number} eased value
   */
  static ease_in_out_exp(t) {
    if (t < 0 || t > 1) throw new Error("Utils: input must be in range [0, 1]");
    if (t === 0) return 0;
    if (t === 1) return 1;
    if (t < 0.5) return 2 ** (20 * t - 10) / 2;
    return (2 - 2 ** (-20 * t + 10)) / 2;
  }

  /**
   * Exponential easing in function. Returns a number in range [0, 1].
   * @param {number} t input number in range [0, 1]
   * @returns {number} eased value
   */
  static ease_in_exp(t) {
    if (t < 0 || t > 1) throw new Error("Utils: input must be in range [0, 1]");
    if (t === 0) return 0;
    return 2 ** (10 * t - 10);
  }

  /**
   * Exponential easing out function. Returns a number in range [0, 1].
   * @param {number} t input number in range [0, 1]
   * @returns {number} eased value
   */
  static ease_out_exp(t) {
    if (t < 0 || t > 1) throw new Error("Utils: input must be in range [0, 1]");
    if (t === 1) return 1;
    return 1 - 2 ** (-10 * t);
  }
}

export { Utils };

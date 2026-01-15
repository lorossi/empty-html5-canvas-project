/**
 * @file SimplexNoise class for generating simplex noise
 */

import {
  createNoise2D,
  createNoise3D,
  createNoise4D,
} from "./simplex-noise.js";
import { XOR128 } from "./xor128.js";

/**
 * Class handling simplex noise.
 * This class interfaces with the SimplexNoise library by Jonas Wagner.
 * The number generation is taken care of by my xor128 library.
 */
class SimplexNoise {
  /**
   * Create a noise object
   * @param {number|string|Array} [seed] The seed for the noise (optional)
   */
  constructor(seed = null) {
    // initialize the random function with the seed
    // it needs to be passed to the noise function
    // If no seed is passed, a random seed is generated
    let state;

    if (Array.isArray(seed)) {
      if (seed.length < 4)
        throw new Error("Array seed must have at least 4 elements");

      state = seed.slice(0, 4);
    } else if (typeof seed === "number") {
      const s = new SplitMix32(seed);
      state = [s.next(), s.next(), s.next(), s.next()];
    } else if (typeof seed === "string") {
      const s = SplitMix32.fromString(seed);
      state = [s.next(), s.next(), s.next(), s.next()];
    } else if (seed === null) {
      state = new Array(4)
        .fill(0)
        .map(() => Math.floor(Math.random() * 0xffffffff));
    } else {
      throw new Error("Seed must be a number, string, array or null");
    }

    const rand_f = new XOR128(state);

    // initialize the noise function with the random function
    this._noise = {
      2: createNoise2D(rand_f),
      3: createNoise3D(rand_f),
      4: createNoise4D(rand_f),
    };

    // set the octaves and falloff
    this._octaves = 1;
    this._falloff = 0.5;
    this._max_value = this._calculateMaxValue();
  }

  /**
   * Get the noise value at a given point
   * @param {number} x x-coordinate
   * @param {number} y y-coordinate
   * @param {number} [z] z-coordinate
   * @param {number} [w] w-coordinate
   * @returns {number} Noise value at the given point in range [-1, 1]
   */
  noise(x, y, z = null, w = null) {
    let n = 0;
    let amp = 1;
    let freq = 1;

    // calculate the number of parameters and the noise function to use
    const dim = Math.min(Math.max(arguments.length, 2), 4);
    // iterate over the octaves to give a more detailed noise value
    for (let i = 0; i < this._octaves; i++) {
      n += this._noise[dim](x * freq, y * freq, z * freq, w * freq) * amp;
      amp *= this._falloff;
      freq *= 1 / this._falloff;
    }

    return n / this._max_value;
  }

  /**
   *
   * @param {number} octaves Number of octaves to use
   * @param {number} falloff Falloff of the noise
   */
  setDetail(octaves = 1, falloff = 0.5) {
    this._octaves = octaves;
    this._falloff = falloff;

    this._max_value = this._calculateMaxValue();
  }

  _calculateMaxValue() {
    let max_value = 0;
    for (let i = 0; i < this._octaves; i++) max_value += this._falloff ** i;

    return max_value;
  }

  /**
   * Set the number of octaves to use
   */
  set octaves(o) {
    this._octaves = o;
    this._max_value = this._calculateMaxValue();
  }

  /**
   * Get the number of octaves to use
   * @returns {number} Number of octaves
   */
  get octaves() {
    return this._octaves;
  }

  /**
   * Set the falloff of the noise
   */
  set falloff(f) {
    this._falloff = f;
    this._max_value = this._calculateMaxValue();
  }

  /**
   * Get the falloff of the noise
   * @returns {number} Falloff
   */
  get falloff() {
    return this._falloff;
  }

  /**
   * Get the maximum value of the noise
   * @returns {number} Maximum value
   */
  get max_value() {
    return this._max_value;
  }

  /**
   * Get the minimum value of the noise
   * @returns {number} Minimum value
   */
  get min_value() {
    return -this.max_value;
  }
}

/**
 * SplitMix32 for seeding XOR128
 * @private
 */
class SplitMix32 {
  constructor(seed) {
    this.state = seed >>> 0;
  }

  static fromString(string) {
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
      const char = string.charCodeAt(i);
      hash = (hash << 5) - hash + char;
    }
    return new SplitMix32(hash >>> 0);
  }

  next() {
    let z = (this.state += 0x9e3779b9) >>> 0;
    z = (z ^ (z >>> 16)) >>> 0;
    z = Math.imul(z, 0x85ebca6b) >>> 0;
    z = (z ^ (z >>> 13)) >>> 0;
    z = Math.imul(z, 0xc2b2ae35) >>> 0;
    return (z ^ (z >>> 16)) >>> 0;
  }
}

export { SimplexNoise };

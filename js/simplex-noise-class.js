import {
  createNoise2D,
  createNoise3D,
  createNoise4D,
} from "./simplex-noise.js";
import { XOR128 } from "./xor128.js";

/** Class handling simplex noise.
 * This class interfaces with the SimplexNoise library by Jonas Wagner.
 * The number generation is taken care of by my xor128 library.
 */
class SimplexNoise {
  /**
   * Create a noise object
   * @param {Number|String|Array} seed The seed for the noise (optional)
   */
  constructor(seed = null) {
    // initialize the random function with the seed
    // it needs to be passed to the noise function
    // If no seed is passed, a random seed is generated

    let rand_f;

    if (seed) {
      let x, y, z, w;

      // initialize the four seed values
      if (typeof seed === "number") {
        // if the seed is a number, use it as the seed
        x = seed;
        y = seed + 1;
        z = seed + 2;
        w = seed + 3;
      } else if (typeof seed === "string") {
        // if the seed is a string, use its hash as the seed
        const h = this._hash(seed);
        // i'm not sure that this is the best way to do this
        x = h;
        y = h + 1;
        z = h + 2;
        w = h + 3;
      } else if (Array.isArray(seed)) {
        // pass the seeds to the random function
        x = seed[0];
        y = seed[1];
        z = seed[2];
        w = seed[3];
      }
      rand_f = new XOR128(x, y, z, w);
    } else {
      // no seed is passed, generate a random seed
      rand_f = new XOR128();
    }

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
   * Simple hash function
   *
   * @param {string} string to be hashed
   * @returns {number} hash
   * @private
   */
  _hash(string) {
    if (string.length == 0) return 0;

    let hash = 0;
    for (let i = 0; i < string.length; i++) {
      const char = string.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
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
    // iterate over the octaves to five a more detailed noise value
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

export { SimplexNoise };

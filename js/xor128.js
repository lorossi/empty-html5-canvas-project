/**
 * XOR128 js implementation
 * @version 1.0.0
 * @author Lorenzo Rossi - https://www.lorenzoros.si - https://github.com/lorossi/
 * @license MIT
 */

class XOR128 {
  /**
   * XOR128 pseudo-random number generator.
   * Based on the implementation by WizCorp https://github.com/Wizcorp/xor128/
   * All parameters are optional, if nothing is passed a random value from
   *  js functions Math.random() will be used
   *
   * @param {number} [x] first seed
   * @param {number} [y] second seed
   * @param {number} [z] third seed
   * @param {number} [w] fourth seed
   * @returns {XOR128}
   */
  constructor(x = null, y = null, z = null, w = null) {
    if (x == null || x == undefined) x = Math.floor(Math.random() * 4294967296);
    if (y == null || x == undefined) y = Math.floor(Math.random() * 4294967296);
    if (z == null || x == undefined) z = Math.floor(Math.random() * 4294967296);
    if (w == null || x == undefined) w = Math.floor(Math.random() * 4294967296);

    if (
      typeof x !== "number" ||
      typeof y !== "number" ||
      typeof z !== "number" ||
      typeof w !== "number"
    )
      throw new Error("XOR128: seed values must be numbers");

    if (x < 1 || y < 1 || z < 1 || w < 1)
      throw new Error("XOR128: seed values must be greater than 0");

    this._x = x;
    this._y = y;
    this._z = z;
    this._w = w;
  }

  /**
   * Returns a random number in range [a, b) (i.e. a included, b excluded)
   * If only one parameter is passed, the random number will be generated in range [0, a)
   * If no parameters are passed, the random number will be generated in range [0, 1)
   *
   * @param {number} [a] if two parameters are passed, minimum range value; maximum range value otherwise
   * @param {number} [b] maximum range value
   * @returns {number} random number
   */
  random(a = null, b = null) {
    if (a == null && b == null) {
      a = 0;
      b = 1;
    } else if (b == null) {
      b = a;
      a = 0;
    }

    const t = this._x ^ ((this._x << 11) >>> 0);

    this._x = this._y;
    this._y = this._z;
    this._z = this._w;
    this._w = (this._w ^ (this._w >>> 19) ^ (t ^ (t >>> 8))) >>> 0;

    return (this._w / 4294967296) * (b - a) + a;
  }

  /**
   * Returns a random integer in range [a, b) (i.e. a included, b excluded)
   * If only one parameter is passed, the random number will be generated in range [0, a)
   * If no parameters are passed, the random number will be generated in range [0, 1]
   *
   * @param {number} [a] if two parameters are passed, minimum range value; maximum range value otherwise
   * @param {number} [b] maximum range value
   * @returns {number} random number
   */
  random_int(a = null, b = null) {
    if (a == null && b == null) {
      a = 0;
      b = 2;
    } else if (b == null) {
      b = a;
      a = 0;
    }

    return Math.floor(this.random(a, b + 1));
  }

  /**
   * Returns a random integer in range (average - interval, average + interval)
   * If only one parameter is passed, the random number will be generated in range (average - 0.5, average + 0.5)
   * If no parameters are passed, the random number will be generated in range [0, 1]
   *
   * @param {number} [a=0.5] average value of the random numbers
   * @param {number} [b=0.5] semi interval of the random numbers
   * @returns {number} random number
   */
  random_interval(average = 0.5, interval = 0.5) {
    return this.random(average - interval, average + interval);
  }

  /**
   * Returns a random item from the provided array
   *
   * @param {Array} arr an array
   * @returns {any} item from input array
   */
  random_from_array(arr) {
    return arr[this.random_int(0, arr.length)];
  }

  /**
   * Shuffles the provided array without returning it (the original array gets shuffled)
   *
   * @param {Array} arr an array
   */
  shuffle_array(arr) {
    return arr
      .map((s) => ({ sort: this.random(), value: s }))
      .sort((a, b) => a.sort - b.sort)
      .map((a) => a.value);
  }

  /**
   * Shuffles and returns a string
   *
   * @param {String} string the string to be shuffled
   * @returns {String}
   */
  shuffle_string(string) {
    return string
      .split("")
      .map((s) => ({ sort: this.random(), value: s }))
      .sort((a, b) => a.sort - b.sort)
      .map((a) => a.value)
      .join("");
  }
}

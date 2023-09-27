/**
 * XOR128 js implementation
 * @version 1.1.0
 * @author Lorenzo Rossi - https://www.lorenzoros.si - https://github.com/lorossi/
 * @license MIT
 */

class XOR128State {
  /**
   * Internal state of the XOR128 pseudo-random number generator.
   * @private
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @param {number} w
   * @throws {Error} if any of x, y, z or w is not a number
   */
  constructor(x, y, z, w) {
    if (
      typeof x !== "number" ||
      typeof y !== "number" ||
      typeof z !== "number" ||
      typeof w !== "number"
    )
      throw new Error("XOR128: seed must be a number");
    this._state = [x, y, z, w];
  }

  /**
   * Get the current internal state as an array of 4 numbers.
   *
   * @returns {Array} current internal state
   */
  get state() {
    return this._state;
  }

  /**
   * Return true if the internal state is all zero, false otherwise.
   *
   * @returns {boolean} true if the internal state is all zero, false otherwise
   */
  isAllZero() {
    return this._state.every((x) => x === 0);
  }

  /**
   * Rotate the internal state.
   *
   * @returns {void}
   */
  rotateState() {
    const [x, y, z, w] = this._state;
    this._state = [y, z, w, x];
  }

  /**
   * Set the first word of the internal state.
   *
   * @returns {void}
   * @throws {Error} if x is not a number
   */
  setFirstWord(x) {
    if (typeof x !== "number")
      throw new Error("XOR128: first word must be a number");

    this._state[0] = x;
  }
}

class SplitMix64State {
  /**
   * Internal state of the SplitMix64 pseudo-random number generator.
   * @private
   * @param {number} seed
   * @returns {void}
   * @throws {Error} if seed is not a number
   */
  constructor(seed) {
    if (typeof seed !== "number")
      throw new Error("SplitMix64State: seed must be a number");

    this._seed = seed;
  }

  /**
   * Get the current internal state.
   *
   * @returns {number} current internal state
   */
  get seed() {
    return this._seed;
  }

  /**
   * Set the internal state.
   *
   * @param {number} seed
   * @returns {void}
   * @throws {Error} if seed is not a number
   */
  set seed(seed) {
    if (typeof seed !== "number")
      throw new Error("SplitMix64State: seed must be a number");

    this._seed = seed;
  }

  /**
   * Mix the internal state.
   * @returns {Array} array of two numbers
   */
  mix() {
    let big_seed = BigInt(this._seed);
    big_seed += 0x9e3779b97f4a7c15n;

    this._seed = Number(big_seed & BigInt(0xffffffffffffffffn));

    let z = big_seed;
    z = (z ^ (z >> BigInt(30n))) * BigInt(0xbf58476d1ce4e5b9n);
    z = (z ^ (z >> BigInt(30n))) * BigInt(0x94d049bb133111ebn);
    z = z ^ (z >> BigInt(31n));

    const z_lower = Number(z & 0xffffffffn);
    const z_upper = Number(z >> 32n);
    return [z_lower, z_upper];
  }
}

class XOR128 {
  /**
   * XOR128 pseudo-random number generator.
   * Formerly based on the implementation by WizCorp https://github.com/Wizcorp/xor128/,
   * now based on the xor128 as described on Wikipedia https://en.wikipedia.org/wiki/Xorshift
   * All parameters are optional, if nothing is passed a random value from
   *  js functions Math.random() will be used
   *
   * @param {number|Array} [x] seed or array of seeds. \
   *  If an array is passed, the first 4 elements will be used as seeds
   * @returns {XOR128}
   * @throws {Error} if x is not a number or an array of 4 numbers
   */
  constructor(x = null) {
    if (x instanceof Array) {
      // an array was passed, use the first 4 elements as seeds
      if (x.length != 4) throw new Error("XOR128: array must have 4 elements");
      this._xor_state = new XOR128State(...x);
    } else if (x === null) {
      // no seed was passed, use Math.random()
      const xx = Math.floor(Math.random() * (2 ** 53 - 1));
      return new XOR128(xx);
    } else if (typeof x === "number") {
      // a number was passed, use it as seed
      if (x <= 0) throw new Error("XOR128: seed must be a non-negative number");

      // create a SplitMix64State from the seed
      this._split_state = new SplitMix64State(x);

      const s1 = this._split_state.mix();
      const s2 = this._split_state.mix();

      // create a XOR128State from the seeds
      this._xor_state = new XOR128State(s1[0], s1[1], s2[0], s2[1]);

      // check if the seed is all
      // this might happen but it is not recommended
      if (this._xor_state.isAllZero())
        console.warn(
          "XOR128: seed is all zero, this is not recommended. ",
          "If no seed was passed, try instantiating the class again"
        );
    } else throw new Error("XOR128: parameter must be a number or an array");

    // check if the seed is all zero
    if (this._xor_state.isAllZero())
      throw new Error("XOR128: seed must not be all zero");
  }

  /**
   * Returns a random number in range [a, b) (i.e. a included, b excluded)
   * If only one parameter is passed, the random number will be generated in range [0, a)
   * If no parameters are passed, the random number will be generated in range [0, 1)
   *
   * @param {number|undefined} [a] if two parameters are passed, minimum range value; maximum range value otherwise
   * @param {number|undefined} [b] maximum range value
   * @returns {number} random number
   */
  random(a = undefined, b = undefined) {
    if (a === undefined && b === undefined) {
      // if no parameters are passed, generate a random number in range [0, 1)
      a = 0;
      b = 1;
    } else if (b === undefined) {
      // if only one parameter is passed, generate a random number in range [0, a)
      b = a;
      a = 0;
    }

    if (a > b)
      throw new Error("XOR128: first parameter must be smaller than second");

    if (typeof a !== "number" || typeof b !== "number")
      throw new Error("XOR128: parameters must be numbers");

    // all calculations are done with BigInts to avoid precision errors
    let t = BigInt(this._xor_state.state[3]);
    let s = BigInt(this._xor_state.state[0]);

    this._xor_state.rotateState();

    t ^= t << BigInt(11);
    t ^= t >> BigInt(8);
    t ^= s ^ (s >> BigInt(19));

    // convert the first word of the internal state to a 32 bit number
    const x = Number(BigInt.asUintN(32, t));
    this._xor_state.setFirstWord(x);

    // convert the result to a number in range [0, 1]
    let r = Number(BigInt.asUintN(32, t)) / (2 ** 32 - 1);

    // re map the result to the desired range
    return a + r * (b - a);
  }

  /**
   * Returns a random integer in range [a, b) (i.e. a included, b excluded)
   * If only one parameter is passed, the random number will be generated in range [0, a)
   * If no parameters are passed, the random number will be generated in range [0, 1]
   *
   * @param {number|undefined} [a] if two parameters are passed, minimum range value; maximum range value otherwise
   * @param {number|undefined} [b] maximum range value
   * @returns {number} random number
   */
  random_int(a = undefined, b = undefined) {
    if (a === undefined && b === undefined) {
      // if no parameters are passed, generate a random number in range [0, 1]
      a = 0;
      b = 2;
    } else if (b === undefined) {
      // if only one parameter is passed, generate a random number in range [0, a)
      b = a;
      a = 0;
    }

    return Math.floor(this.random(a, b));
  }

  /**
   * Returns a random boolean
   *
   * @returns {boolean} random boolean
   */
  random_bool() {
    return this.random() > 0.5;
  }

  /**
   * Returns a random string
   *
   * @param {number} [length=10] length of the string
   * @param {string} [chars="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"] characters to use
   */
  random_string(
    length = 10,
    chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  ) {
    return new Array(length)
      .fill(0)
      .map(() => chars.charAt(this.random_int(0, chars.length)))
      .join("");
  }

  /**
   * Returns a random integer in range (average - interval, average + interval)
   * If only one parameter is passed, the random number will be generated in range (average - 0.5, average + 0.5)
   * If no parameters are passed, the random number will be generated in range [0, 1]
   *
   * @param {number} [average=0.5] average value of the random numbers
   * @param {number} [interval=0.5] semi interval of the random numbers
   * @returns {number} random number
   */
  random_interval(average = 0.5, interval = 0.5) {
    return this.random(average - interval, average + interval);
  }

  /**
   * Returns a random item from the provided array
   *
   * @param {Array} arr an array
   * @returns {*} item from input array
   */
  random_from_array(arr) {
    if (!(arr instanceof Array))
      throw new Error("XOR128: parameter must be an array");

    return arr[this.random_int(0, arr.length)];
  }

  /**
   * Returns a random char from the provided string
   *
   * @param {string} str a string
   * @returns {string} char from input string
   */
  random_from_string(str) {
    if (typeof str !== "string")
      throw new Error("XOR128: parameter must be a string");

    return str.charAt(this.random_int(0, str.length));
  }

  /**
   * Returns a random item from the provided array or a random char from the provided string
   *
   * @returns {*} item from input array or char from input string
   */
  pick(x) {
    if (x instanceof Array) return this.random_from_array(x);
    else if (typeof x === "string") return this.random_from_string(x);
    else throw new Error("XOR128: parameter must be an array or a string");
  }

  /**
   * Shuffles the provided array (the original array does not get shuffled)
   *
   * @param {Array} arr an array
   */
  shuffle_array(arr) {
    if (!arr) return null;

    return [...arr]
      .map((s) => ({ sort: this.random(), value: s }))
      .sort((a, b) => a.sort - b.sort)
      .map((a) => a.value);
  }

  /**
   * Shuffles and returns a string
   *
   * @param {string} string the string to be shuffled
   * @returns {string}
   */
  shuffle_string(string) {
    if (!string) return "";

    return string
      .split("")
      .map((s) => ({ sort: this.random(), value: s }))
      .sort((a, b) => a.sort - b.sort)
      .map((a) => a.value)
      .join("");
  }

  /**
   * Shuffles and returns an array or a string.
   *
   * @param {Array|string} x an array or a string
   * @returns {*} shuffled array or string
   */
  shuffle(x) {
    if (x instanceof Array) return this.shuffle_array(x);
    if (typeof x === "string") return this.shuffle_string(x);

    throw new Error("XOR128: parameter must be an array or a string");
  }
}

export { XOR128 };

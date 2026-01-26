class XOR128State {
  /**
   * Internal state of the XOR128 pseudo-random number generator.
   * @private
   * @param {number} x first word of the internal state
   * @param {number} y second word of the internal state
   * @param {number} z third word of the internal state
   * @param {number} w fourth word of the internal state
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
   * @returns {Array} current internal state
   */
  get state() {
    return this._state;
  }

  /**
   * Return true if the internal state is all zero, false otherwise.
   * @returns {boolean} true if the internal state is all zero, false otherwise
   */
  isAllZero() {
    return this._state.every((x) => x === 0);
  }

  /**
   * Rotate the internal state.
   */
  rotateState() {
    const [x, y, z, w] = this._state;
    this._state = [y, z, w, x];
  }

  /**
   * Set the first word of the internal state.
   * @param {number} x new value for the first word
   * @throws {Error} if x is not a number
   */
  setFirstWord(x) {
    if (typeof x !== "number")
      throw new Error("XOR128: first word must be a number");

    this._state[0] = x;
  }
}

export { XOR128State };

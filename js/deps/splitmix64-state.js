class SplitMix64State {
  /**
   * Internal state of the SplitMix64 pseudo-random number generator.
   * @private
   * @param {number} seed - initial seed
   * @throws {Error} if seed is not a number
   */
  constructor(seed) {
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

export { SplitMix64State };

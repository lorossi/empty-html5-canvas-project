/**
 * @file Point class representing a 2D point
 */

/** Class containing a simple 2D point */
class Point {
  /**
   * Create a point by its coordinates
   * @param {number} x x-coordinate
   * @param {number} y y-coordinate
   */
  constructor(x, y) {
    if (arguments.length != 2)
      throw new Error("Point must have only two coordinates");
    this._x = x;
    this._y = y;
  }

  /**
   * Create a point from an array of two numbers
   * @param {number[]} arr array of two numbers representing the point coordinates
   * @returns {Point} point created from the array
   */
  static fromArray(arr) {
    if (arr.length != 2) throw new Error("Array must have only two elements");
    return new Point(arr[0], arr[1]);
  }

  /**
   * Return a copy of the point
   * @returns {Point} copy of the point
   */
  copy() {
    return new Point(this._x, this._y);
  }

  /**
   * Return the distance between two points
   * @param {Point} other other point
   * @returns {number} distance between the two points
   */
  distance(other) {
    return Math.sqrt((other.x - this._x) ** 2 + (other.y - this._y) ** 2);
  }

  /**
   * Returns true if the point is equal to another point
   * @param {Point} other other point
   * @param {number} epsilon tolerance for floating point comparison
   * @returns {boolean} true if the points are equal
   */
  equals(other, epsilon = 0.0001) {
    const float_eq = (a, b) => Math.abs(a - b) < epsilon;
    return float_eq(this._x, other.x) && float_eq(this._y, other.y);
  }

  /**
   * Add another point to this point
   * @param {Point} other other point
   * @returns {Point} this point after addition
   */
  add(other) {
    const x = this._x + other.x;
    const y = this._y + other.y;
    return new Point(x, y);
  }

  /**
   * Subtract another point from this point
   * @param {Point} other other point
   * @returns {Point} this point after subtraction
   */
  subtract(other) {
    const x = this._x - other.x;
    const y = this._y - other.y;
    return new Point(x, y);
  }

  /**
   * Multiply this point by a scalar
   * @param {number} scalar scalar value
   * @returns {Point} this point after multiplication
   */
  multiply(scalar) {
    const x = this._x * scalar;
    const y = this._y * scalar;
    return new Point(x, y);
  }

  /**
   * Divide this point by a scalar
   * @param {number} scalar scalar value
   * @returns {Point} this point after division
   */
  divide(scalar) {
    if (scalar === 0) throw new Error("Cannot divide by zero");
    const x = this._x / scalar;
    const y = this._y / scalar;
    return new Point(x, y);
  }

  /**
   * Returns the point as a string
   * @returns {string} string representation of the point
   */
  toString() {
    return `(${this._x}, ${this._y})`;
  }

  /**
   * Linearly interpolate between this point and another point
   * @param {Point} other other point
   * @param {number} t interpolation factor [0, 1]
   * @returns {Point} this point after interpolation
   */
  lerp(other, t) {
    const x = this._x + (other.x - this._x) * t;
    const y = this._y + (other.y - this._y) * t;
    return new Point(x, y);
  }

  /**
   * Returns the point x coordinate
   * @returns {number} x coordinate
   */
  get x() {
    return this._x;
  }

  /**
   * Sets the point x coordinate
   * @param {number} nx new x coordinate
   */
  set x(nx) {
    this._x = nx;
  }

  /**
   * Returns the point y coordinate
   * @returns {number} y coordinate
   */
  get y() {
    return this._y;
  }

  /**
   * Sets the point y coordinate
   * @param {number} ny new y coordinate
   */
  set y(ny) {
    this._y = ny;
  }

  /**
   * Returns the point as an array
   * @returns {number[]} array representation of the point
   */
  toArray() {
    return [this._x, this._y];
  }
}

export { Point };
